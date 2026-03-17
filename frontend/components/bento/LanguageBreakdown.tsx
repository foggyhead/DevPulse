"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { LanguageStat } from "@/types/github";

// Lavender-toned palette that stays on-brand
const PALETTE = [
  "#9d8fcd", "#c4b8e8", "#7b6fb5", "#e6e6fa",
  "#6b6b8a", "#b0a8d4", "#5a5470", "#d4cff0",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: "rgba(26,26,26,0.95)",
        border: "1px solid rgba(230,230,250,0.08)",
        color: "#f0f0f0",
        backdropFilter: "blur(12px)",
      }}
    >
      <span style={{ color: payload[0].payload.fill }}>{payload[0].name}</span>
      {" · "}
      <span style={{ color: "#9d8fcd" }}>{payload[0].value.toFixed(1)}%</span>
    </div>
  );
};

export default function LanguageBreakdown({ languages }: { languages: LanguageStat[] }) {
  const top = languages.slice(0, 7);

  return (
    <motion.div
      className="bento-tile p-5 h-full flex flex-col"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="text-sm font-semibold text-[#f0f0f0] mb-1">Language DNA</h3>
      <p className="text-[11px] mb-4" style={{ color: "#6b6b8a" }}>
        Across public repos
      </p>

      {/* Donut chart */}
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              strokeWidth={0}
              paddingAngle={2}
            >
              {top.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend bars */}
      <div className="mt-3 space-y-2 flex-1">
        {top.map((lang, i) => (
          <motion.div
            key={lang.name}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.35 }}
          >
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="text-[11px] flex-1 truncate" style={{ color: "#c4c4e8" }}>
              {lang.name}
            </span>
            <span className="text-[11px] tabular-nums" style={{ color: "#6b6b8a" }}>
              {lang.percentage.toFixed(1)}%
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
