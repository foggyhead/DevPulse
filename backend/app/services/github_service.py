"""
GitHub data pipeline service.
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from datetime import datetime
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.schemas.github import (
    AnalyticsSummary,
    CommitActivity,
    DevRhythm,
    LanguageStat,
    PRVelocity,
    UserProfile,
)


class GitHubService:
    BASE = settings.GITHUB_API_BASE

    def __init__(self) -> None:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
        self._client = httpx.AsyncClient(headers=headers, timeout=20.0)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=8))
    async def _get(self, path: str, **params: Any) -> Any:
        resp = await self._client.get(f"{self.BASE}{path}", params=params)
        resp.raise_for_status()
        return resp.json()

    async def _get_paginated(self, path: str, max_pages: int = 5, **params: Any) -> list[Any]:
        results: list[Any] = []
        page = 1
        while page <= max_pages:
            data = await self._get(path, page=page, per_page=100, **params)
            if not data:
                break
            results.extend(data)
            if len(data) < 100:
                break
            page += 1
        return results

    async def _get_stats_with_202(self, path: str) -> list[Any]:
        """Handle GitHub's 202 Accepted for stats endpoints — retries up to 3x."""
        for _ in range(3):
            resp = await self._client.get(f"{self.BASE}{path}")
            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 202:
                await asyncio.sleep(2)
            else:
                return []
        return []

    # ── Profile ───────────────────────────────────────────────────

    async def get_profile(self, username: str) -> UserProfile:
        data = await self._get(f"/users/{username}")
        return UserProfile(
            login=data["login"],
            name=data.get("name"),
            avatar_url=data["avatar_url"],
            bio=data.get("bio"),
            public_repos=data["public_repos"],
            followers=data["followers"],
            following=data["following"],
            created_at=data["created_at"],
        )

    # ── Language breakdown ────────────────────────────────────────

    async def get_languages(self, username: str) -> list[LanguageStat]:
        repos = await self._get_paginated(f"/users/{username}/repos", max_pages=3)
        tasks = [
            self._get(f"/repos/{username}/{r['name']}/languages")
            for r in repos
            if not r.get("fork")
        ]
        raw_languages = await asyncio.gather(*tasks, return_exceptions=True)

        totals: dict[str, int] = defaultdict(int)
        for lang_map in raw_languages:
            if isinstance(lang_map, dict):
                for lang, count in lang_map.items():
                    totals[lang] += count

        grand_total = sum(totals.values()) or 1
        return [
            LanguageStat(name=k, bytes=v, percentage=round(v / grand_total * 100, 2))
            for k, v in sorted(totals.items(), key=lambda x: -x[1])
        ]

    # ── Commit activity + streaks ─────────────────────────────────

    async def get_commit_activity(self, username: str) -> tuple[list[CommitActivity], int, int]:
        """
        Aggregates commit activity across the top 5 most-active repos.
        Returns (weekly_activity, current_streak_days, longest_streak_days).
        """
        repos = await self._get_paginated(f"/users/{username}/repos", max_pages=2)
        own_repos = [r for r in repos if not r.get("fork")]
        # Sort by most recently pushed to get active repos
        top_repos = sorted(own_repos, key=lambda r: r.get("pushed_at", ""), reverse=True)[:5]

        tasks = [
            self._get_stats_with_202(f"/repos/{username}/{r['name']}/stats/commit_activity")
            for r in top_repos
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        aggregated: dict[int, list[int]] = {}
        for result in results:
            if not isinstance(result, list) or not result:
                continue
            for week in result:
                ts = week.get("week", 0)
                days = week.get("days", [0] * 7)
                if ts not in aggregated:
                    aggregated[ts] = [0] * 7
                for i, count in enumerate(days):
                    aggregated[ts][i] += count

        weeks = [
            CommitActivity(week=ts, days=days, total=sum(days))
            for ts, days in sorted(aggregated.items())
        ]

        # Calculate streaks from daily data
        all_days = [c for w in weeks for c in w.days]

        # Current streak: count backwards from today
        current_streak = 0
        for count in reversed(all_days):
            if count > 0:
                current_streak += 1
            else:
                break

        # Longest streak
        longest_streak = 0
        cur_run = 0
        for count in all_days:
            if count > 0:
                cur_run += 1
                longest_streak = max(longest_streak, cur_run)
            else:
                cur_run = 0

        return weeks, current_streak, longest_streak

    # ── PR velocity ───────────────────────────────────────────────

    async def get_pr_velocity(self, username: str) -> tuple[list[PRVelocity], float | None]:
        try:
            search_data = await self._get(
                "/search/issues",
                q=f"author:{username} type:pr",
                sort="created",
                order="desc",
                per_page=50,
            )
        except Exception:
            return [], None

        items = search_data.get("items", [])
        prs: list[PRVelocity] = []
        turnaround_hours: list[float] = []

        for item in items:
            created = item.get("created_at")
            closed = item.get("closed_at")
            merged = item.get("pull_request", {}).get("merged_at")
            resolution = merged or closed

            turnaround: float | None = None
            if created and resolution:
                dt_created = datetime.fromisoformat(created.replace("Z", "+00:00"))
                dt_resolved = datetime.fromisoformat(resolution.replace("Z", "+00:00"))
                turnaround = (dt_resolved - dt_created).total_seconds() / 3600
                turnaround_hours.append(turnaround)

            prs.append(PRVelocity(
                number=item["number"],
                title=item["title"],
                state=item["state"],
                created_at=created,
                closed_at=closed,
                merged_at=merged,
                turnaround_hours=round(turnaround, 1) if turnaround else None,
            ))

        avg = round(sum(turnaround_hours) / len(turnaround_hours), 1) if turnaround_hours else None
        return prs, avg

    # ── Developer Rhythm ──────────────────────────────────────────

    async def get_dev_rhythm(self, username: str) -> list[DevRhythm]:
        """
        Builds hour-of-day commit histogram using:
        1. Public push events (timestamps)
        2. Commit search API (actual commit timestamps, more accurate)
        """
        hour_counts: dict[int, int] = defaultdict(int)

        # Source 1: Public push events
        try:
            events = await self._get_paginated(f"/users/{username}/events/public", max_pages=5)
            for event in events:
                if event.get("type") == "PushEvent":
                    created_at = event.get("created_at", "")
                    if created_at:
                        dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                        num = len(event.get("payload", {}).get("commits", [{}]))
                        hour_counts[dt.hour] += max(num, 1)
        except Exception:
            pass

        # Source 2: Commit search (requires commits preview header)
        try:
            resp = await self._client.get(
                f"{self.BASE}/search/commits",
                params={"q": f"author:{username}", "sort": "author-date", "order": "desc", "per_page": 100},
                headers={"Accept": "application/vnd.github.cloak-preview+json"},
            )
            if resp.status_code == 200:
                for item in resp.json().get("items", []):
                    date_str = item.get("commit", {}).get("author", {}).get("date", "")
                    if date_str:
                        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                        hour_counts[dt.hour] += 1
        except Exception:
            pass

        return [DevRhythm(hour=h, commit_count=hour_counts.get(h, 0)) for h in range(24)]

    # ── Full analytics pipeline ───────────────────────────────────

    async def get_analytics(self, username: str) -> AnalyticsSummary:
        (commit_activity, current_streak, longest_streak), languages, dev_rhythm, (prs, avg_turnaround), profile = (
            await asyncio.gather(
                self.get_commit_activity(username),
                self.get_languages(username),
                self.get_dev_rhythm(username),
                self.get_pr_velocity(username),
                self.get_profile(username),
            )
        )

        total_commits = sum(w.total for w in commit_activity)

        return AnalyticsSummary(
            profile=profile,
            languages=languages,
            commit_activity=commit_activity,
            pr_velocity=prs,
            dev_rhythm=dev_rhythm,
            avg_pr_turnaround_hours=avg_turnaround,
            total_commits_last_year=total_commits,
            current_streak=current_streak,
            longest_streak=longest_streak,
        )

    async def close(self) -> None:
        await self._client.aclose()


github_service = GitHubService()
