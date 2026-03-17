"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowLeft, RefreshCw, AlertCircle, UserX } from "lucide-react";

import { fetchAnalytics } from "@/lib/api";
import type { AnalyticsSummary } from "@/types/github";

import ProfileCard from "@/components/bento/ProfileCard";
import CommitHeatmap from "@/components/bento/CommitHeatmap";
import LanguageBreakdown from "@/components/bento/LanguageBreakdown";
import DevRhythmCard from "@/components/bento/DevRhythm";
import PRVelocityCard from "@/components/bento/PRVelocityCard";
import TechDebtCard from "@/components/bento/TechDebtCard";
import LoadingAnimation from "@/components/ui/LoadingAnimation";

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(157,143,205,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(230,230,250,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(230,230,250,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function DashboardHeader({
  username,
  onRefresh,
  refreshing,
}: {
  username: string;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const router = useRouter();
  return (
    <motion.header
      className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-4 border-b"
      style={{
        background: "rgba(18,18,18,0.88)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(230,230,250,0.06)",
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            style={{ background: "rgba(157,143,205,0.15)", border: "1px solid rgba(230,230,250,0.1)" }}
          >
            <Activity size={12} style={{ color: "#e6e6fa" }} />
          </div>
          <span className="text-sm font-semibold text-[#f0f0f0] hidden sm:block">DevPulse</span>
        </div>
        <span className="hidden sm:block" style={{ color: "rgba(230,230,250,0.1)" }}>/</span>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs transition-colors duration-150 flex-shrink-0"
          style={{ color: "#6b6b8a" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#c4c4e8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#6b6b8a")}
        >
          <ArrowLeft size={12} strokeWidth={2} />
          <span className="hidden sm:block">Search</span>
        </button>
        <span style={{ color: "rgba(230,230,250,0.1)" }}>/</span>
        <span className="font-mono text-xs truncate" style={{ color: "#9d8fcd" }}>
          @{username}
        </span>
      </div>

      <motion.button
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs transition-all duration-200 disabled:opacity-40 flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(230,230,250,0.07)",
          color: "#6b6b8a",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={refreshing ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw size={11} strokeWidth={2} />
        </motion.div>
        <span className="hidden sm:block">Refresh</span>
      </motion.button>
    </motion.header>
  );
}

function ErrorState({ message, onRetry, is404 }: { message: string; onRetry: () => void; is404?: boolean }) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            background: is404 ? "rgba(157,143,205,0.08)" : "rgba(248,113,113,0.08)",
            border: `1px solid ${is404 ? "rgba(157,143,205,0.2)" : "rgba(248,113,113,0.2)"}`,
          }}
        >
          {is404 ? (
            <UserX size={20} style={{ color: "#9d8fcd" }} />
          ) : (
            <AlertCircle size={20} style={{ color: "#f87171" }} />
          )}
        </div>
        <h2 className="mb-2 text-lg font-semibold text-[#f0f0f0]">
          {is404 ? "User not found" : "Couldn't load analytics"}
        </h2>
        <p className="mb-6 max-w-sm text-sm" style={{ color: "#6b6b8a" }}>
          {message}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(230,230,250,0.08)",
              color: "#6b6b8a",
            }}
          >
            ← Search again
          </button>
          {!is404 && (
            <button
              onClick={onRetry}
              className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(157,143,205,0.1)",
                border: "1px solid rgba(157,143,205,0.2)",
                color: "#9d8fcd",
              }}
            >
              Try again
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function BentoDashboard({ data }: { data: AnalyticsSummary }) {
  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Row 1: Profile + Heatmap */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
        <div className="md:col-span-1">
          <ProfileCard
            profile={data.profile}
            totalCommits={data.total_commits_last_year}
            currentStreak={data.current_streak}
            longestStreak={data.longest_streak}
          />
        </div>
        <div className="md:col-span-2">
          <CommitHeatmap
            data={data.commit_activity}
            currentStreak={data.current_streak}
            longestStreak={data.longest_streak}
          />
        </div>
      </div>

      {/* Row 2: Language + Dev Rhythm + PR Velocity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
        <div>
          <LanguageBreakdown languages={data.languages} />
        </div>
        <div>
          <DevRhythmCard data={data.dev_rhythm} />
        </div>
        <div className="sm:col-span-2 md:col-span-1">
          <PRVelocityCard prs={data.pr_velocity} />
        </div>
      </div>

      {/* Row 3: Tech Debt full width */}
      <div>
        <TechDebtCard
          prs={data.pr_velocity}
          avgTurnaround={data.avg_pr_turnaround_hours}
        />
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    setIs404(false);
    try {
      const result = await fetchAnalytics(username);
      setData(result);
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setError(msg);
      setIs404(msg.toLowerCase().includes("not found"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) load();
  }, [username]);

  return (
    <main className="min-h-screen bg-[#121212]">
      <BackgroundOrbs />
      <DashboardHeader username={username} onRefresh={load} refreshing={loading && !!data} />

      <AnimatePresence mode="wait">
        {loading && !data && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 md:px-6"
          >
            <LoadingAnimation username={username} />
          </motion.div>
        )}

        {error && !data && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState message={error} onRetry={load} is404={is404} />
          </motion.div>
        )}

        {data && !loading && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BentoDashboard data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
