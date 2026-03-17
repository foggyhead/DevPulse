export interface UserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
}

export interface CommitActivity {
  week: number;
  days: number[];
  total: number;
}

export interface PRVelocity {
  number: number;
  title: string;
  state: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  turnaround_hours: number | null;
}

export interface DevRhythm {
  hour: number;
  commit_count: number;
}

export interface AnalyticsSummary {
  profile: UserProfile;
  languages: LanguageStat[];
  commit_activity: CommitActivity[];
  pr_velocity: PRVelocity[];
  dev_rhythm: DevRhythm[];
  avg_pr_turnaround_hours: number | null;
  total_commits_last_year: number;
  current_streak: number;
  longest_streak: number;
}
