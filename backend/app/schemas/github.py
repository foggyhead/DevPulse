from pydantic import BaseModel
from typing import Optional


class UserProfile(BaseModel):
    login: str
    name: Optional[str]
    avatar_url: str
    bio: Optional[str]
    public_repos: int
    followers: int
    following: int
    created_at: str


class LanguageStat(BaseModel):
    name: str
    bytes: int
    percentage: float


class CommitActivity(BaseModel):
    week: int
    days: list[int]
    total: int


class PRVelocity(BaseModel):
    number: int
    title: str
    state: str
    created_at: str
    closed_at: Optional[str]
    merged_at: Optional[str]
    turnaround_hours: Optional[float]


class DevRhythm(BaseModel):
    hour: int
    commit_count: int


class AnalyticsSummary(BaseModel):
    profile: UserProfile
    languages: list[LanguageStat]
    commit_activity: list[CommitActivity]
    pr_velocity: list[PRVelocity]
    dev_rhythm: list[DevRhythm]
    avg_pr_turnaround_hours: Optional[float]
    total_commits_last_year: int
    current_streak: int
    longest_streak: int
