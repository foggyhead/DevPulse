"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus, AlertTriangle } from "lucide-react";
import type { PRVelocity } from "@/types/github";

function classify(avgHours: number | null) {
  if (avgHours === null) return { label: "No Data", color: "#6b6b8a", icon: Minus, score: null, description: "No closed PRs to analyze." };
  if (avgHours < 24) return { label: "Fast Iteration", color: "#4ade80", icon: TrendingDown, score: 95, description: "Sub-24h turnaround — lean, healthy pipeline. Minimal review bottlenecks." };
  if (avgHours < 72) return { label: "Moderate Pace", color: "#9d8fcd", icon: Minus, score: 65, description: "1–3 day turnaround. Healthy pace with room for tighter review cycles." };
  if (avgHours < 168) return { label: "Elevated Debt", color: "#fb923c", icon: TrendingUp, score: 35, description: "3–7 day turnaround signals review bottlenecks or complex PR scope." };
  return { label: "High Debt Risk", color: "#f87171", icon: TrendingUp, score: 15, description: "7+ day turnaround. Long-lived PRs increase merge conflict risk." };
}

function MetricRow({ label, value, sub, delay }: { label: string; value: string; sub?: string; delay: number }) {
  return (
    <motion.div
      className="flex items-center justify-between rounded-xl px-3 py-2.5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(230,230,250,0.04)" }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div>
        <p className="text-[11px]" style={{ color: "#6b6b8a" }}>{label}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: "#4b4b6a" }}>{sub}</p>}
      </div>
      <span className="text-sm font-semibold tabular-nums" style={{ color: "#e6e6fa" }}>{value}</span>
    </motion.div>
  );
}

function ScoreMeter({ score, color }: { score: number; color: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px]" style={{ color: "#6b6b8a" }}>Pipeline Health Score</span>
        <span className="text-xs font-semibold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function TechDebtCard({ prs, avgTurnaround }: { prs: PRVelocity[]; avgTurnaround: number | null }) {
  const { label, color, icon: StatusIcon, score, description } = classify(avgTurnaround);

  const mergedPRs = prs.filter((p) => p.merged_at);
  const mergeRate = prs.length > 0 ? ((mergedPRs.length / prs.length) * 100).toFixed(0) : "—";

  const fmt = (h: number | null) => {
    if (h === null) return "—";
    if (h < 1) return `${(h * 60).toFixed(0)}m`;
    if (h < 24) return `${h.toFixed(1)}h`;
    return `${(h / 24).toFixed(1)}d`;
  };

  // PR size classification
  const fastPRs = mergedPRs.filter(p => (p.turnaround_hours ?? 0) < 24).length;
  const slowPRs = mergedPRs.filter(p => (p.turnaround_hours ?? 0) >= 168).length;

  return (
    <motion.div
      className="bento-tile p-5 h-full"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#f0f0f0]">Technical Debt Insights</h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#6b6b8a" }}>PR turnaround · merge velocity · pipeline health</p>
        </div>
        <AlertTriangle size={14} style={{ color: "#9d8fcd" }} strokeWidth={1.5} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status badge */}
        <div className="md:col-span-1">
          <motion.div
            className="flex items-start gap-2.5 rounded-xl p-3 h-full"
            style={{ background: `${color}10`, border: `1px solid ${color}25` }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.32, duration: 0.4 }}
          >
            <StatusIcon size={18} style={{ color }} strokeWidth={2} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color }}>{label}</p>
              <p className="text-[10px] leading-relaxed" style={{ color: "#6b6b8a" }}>{description}</p>
              {score !== null && <ScoreMeter score={score} color={color} />}
            </div>
          </motion.div>
        </div>

        {/* Metrics */}
        <div className="md:col-span-2 space-y-2">
          <MetricRow label="Avg PR Turnaround" value={fmt(avgTurnaround)} sub="open → merge/close" delay={0.34} />
          <MetricRow label="Merge Rate" value={`${mergeRate}%`} sub={`${mergedPRs.length} of ${prs.length} PRs merged`} delay={0.38} />
          <MetricRow label="Fast Merges (< 24h)" value={`${fastPRs}`} sub="rapid iteration count" delay={0.42} />
          {slowPRs > 0 && (
            <MetricRow label="Long-lived PRs (> 7d)" value={`${slowPRs}`} sub="potential bottleneck signal" delay={0.46} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
