import type { AnalyticsSummary } from "@/types/github";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchAnalytics(username: string): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/api/v1/github/analytics/${username}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to fetch analytics for @${username}`);
  }

  return res.json();
}
