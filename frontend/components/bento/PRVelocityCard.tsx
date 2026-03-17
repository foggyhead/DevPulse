"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GitPullRequest, GitMerge, XCircle } from "lucide-react";
import type { PRVelocity } from "@/types/github";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs max-w-[200px]"
      style={{
        background: "rgba(26,26,26,0.95)",
        border: "1px solid rgba(230,230,250,0.08)",
        backdropFilter: "blur(12px)",
        color: "#f0f0f0",
      }}
    >
      <p className="truncate mb-1" style={{ color: "#c4c4e8" }}>
        {payload[0].payload.title}
      </p>
      <span style={{ color: "#9d8fcd" }}>
        {payload[0].value?.toFixed(1)}h
      </span>{" "}
      turnaround
    </div>
  );
};

export default function PRVelocityCard({ prs }: { prs: PRVelocity[] }) {
  const closed = prs.filter((p) => p.merged_at || p.closed_at);
  const chartData = closed
    .slice(0, 20)
    .reverse()
    .map((p, i) => ({
      i: i + 1,
      turnaround: p.turnaround_hours,
      title: p.title,
      state: p.merged_at ? "merged" : "closed",
    }));

  const merged = prs.filter((p) => p.merged_at).length;
  const open = prs.filter((p) => p.state === "open").length;
  const closedCount = prs.filter((p) => p.closed_at && !p.merged_at).length;

  return (
    <motion.div
      className="bento-tile p-5 h-full flex flex-col"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#f0f0f0]">PR Velocity</h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#6b6b8a" }}>
            Pull request turnaround time
          </p>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex gap-2 mb-4">
        {[
          { icon: GitMerge, label: "Merged", value: merged, color: "#9d8fcd" },
          { icon: GitPullRequest, label: "Open", value: open, color: "#4ade80" },
          { icon: XCircle, label: "Closed", value: closedCount, color: "#6b6b8a" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-0.5 rounded-xl py-2.5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(230,230,250,0.05)",
            }}
          >
            <Icon size={12} style={{ color }} strokeWidth={1.8} />
            <span className="text-sm font-semibold text-[#f0f0f0]">{value}</span>
            <span className="text-[10px]" style={{ color: "#6b6b8a" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9d8fcd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9d8fcd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="i" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(230,230,250,0.06)" }} />
              <Area
                type="monotone"
                dataKey="turnaround"
                stroke="#9d8fcd"
                strokeWidth={1.5}
                fill="url(#prGrad)"
                dot={false}
                activeDot={{ r: 3, fill: "#e6e6fa", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="flex-1 flex items-center justify-center text-xs" style={{ color: "#6b6b8a" }}>
          No closed PRs found
        </p>
      )}
    </motion.div>
  );
}
