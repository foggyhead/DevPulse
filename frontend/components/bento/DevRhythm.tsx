"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { DevRhythm } from "@/types/github";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const hour = Number(label);
  const display = hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: "rgba(26,26,26,0.95)",
        border: "1px solid rgba(230,230,250,0.08)",
        backdropFilter: "blur(12px)",
        color: "#f0f0f0",
      }}
    >
      <span style={{ color: "#9d8fcd" }}>{display}</span>
      {" · "}
      {payload[0].value} push events
    </div>
  );
};

export default function DevRhythmCard({ data }: { data: DevRhythm[] }) {
  const maxCommits = Math.max(...data.map((d) => d.commit_count), 1);
  const totalEvents = data.reduce((s, d) => s + d.commit_count, 0);
  const peakHour = data.reduce((best, d) => d.commit_count > best.commit_count ? d : best, data[0]);

  const peakLabel = () => {
    const h = peakHour?.hour ?? 0;
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
  };

  const peakSession = () => {
    const h = peakHour?.hour ?? 0;
    if (h >= 5 && h < 12) return "Morning dev";
    if (h >= 12 && h < 17) return "Afternoon grinder";
    if (h >= 17 && h < 21) return "Evening coder";
    return "Night owl";
  };

  const hasData = totalEvents > 0;

  return (
    <motion.div
      className="bento-tile p-5 h-full flex flex-col"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#f0f0f0]">Developer's Rhythm</h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#6b6b8a" }}>
            {hasData ? `${totalEvents} push events analyzed` : "Peak productivity hours"}
          </p>
        </div>
        {hasData && peakHour && (
          <div className="text-right">
            <span className="text-xs font-semibold" style={{ color: "#9d8fcd" }}>
              {peakLabel()}
            </span>
            <p className="text-[10px]" style={{ color: "#6b6b8a" }}>
              {peakSession()}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[120px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="15%" margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b6b8a", fontSize: 9 }}
                tickFormatter={(v) => v % 6 === 0 ? `${v}h` : ""}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="commit_count" radius={[3, 3, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.commit_count === maxCommits
                        ? "rgba(230,230,250,0.9)"
                        : entry.commit_count > maxCommits * 0.6
                        ? "rgba(157,143,205,0.55)"
                        : entry.commit_count > 0
                        ? "rgba(157,143,205,0.25)"
                        : "rgba(157,143,205,0.06)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-center" style={{ color: "#6b6b8a" }}>
              No recent public push events found.<br />
              <span style={{ color: "rgba(107,107,138,0.6)", fontSize: 10 }}>
                Private repos or low recent activity.
              </span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
