"use client";

import { motion } from "framer-motion";
import type { CommitActivity } from "@/types/github";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getColor(count: number): string {
  if (count === 0) return "rgba(230,230,250,0.05)";
  if (count <= 3) return "rgba(157,143,205,0.25)";
  if (count <= 7) return "rgba(157,143,205,0.5)";
  if (count <= 14) return "rgba(157,143,205,0.75)";
  return "rgba(230,230,250,0.9)";
}

function getMonthLabels(weeks: CommitActivity[]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((w, i) => {
    const month = new Date(w.week * 1000).getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });
  return labels;
}

export default function CommitHeatmap({
  data,
  currentStreak: _currentStreak,
  longestStreak: _longestStreak,
}: {
  data: CommitActivity[];
  currentStreak: number;
  longestStreak: number;
}) {
  const monthLabels = getMonthLabels(data);
  const totalCommits = data.reduce((s, w) => s + w.total, 0);

  return (
    <motion.div
      className="bento-tile p-5 h-full"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#f0f0f0]">Commit Activity</h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#6b6b8a" }}>
            {totalCommits.toLocaleString()} contributions in the last year
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#6b6b8a" }}>
          <span>Less</span>
          {[0, 3, 7, 14, 20].map((v) => (
            <span
              key={v}
              className="h-2.5 w-2.5 rounded-sm inline-block"
              style={{ background: getColor(v) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap — horizontally scrollable on small screens */}
      <div className="overflow-x-auto pb-1">
        <div style={{ minWidth: "600px" }}>
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 ml-6">
            {data.map((_, i) => {
              const label = monthLabels.find((m) => m.col === i);
              return (
                <div key={i} className="flex-1 text-[9px]" style={{ color: "#6b6b8a", minWidth: "10px" }}>
                  {label?.label || ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1 flex-shrink-0">
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="h-[11px] flex items-center text-[9px]"
                  style={{ color: i % 2 === 1 ? "#6b6b8a" : "transparent" }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {data.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
                {week.days.map((count, di) => (
                  <motion.div
                    key={di}
                    className="h-[11px] w-[11px] rounded-[2px] cursor-pointer flex-shrink-0"
                    style={{ background: getColor(count) }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.015 * wi + 0.003 * di, duration: 0.15 }}
                    title={`${count} commit${count !== 1 ? "s" : ""}`}
                    whileHover={{
                      scale: 1.5,
                      background: count > 0 ? "rgba(230,230,250,0.95)" : "rgba(230,230,250,0.2)",
                      zIndex: 10,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
