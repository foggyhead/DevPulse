"use client";

import { motion } from "framer-motion";

/* ── Skeleton primitives ──────────────────────────────────────── */
function SkeletonLine({ width = "100%", delay = 0 }: { width?: string; delay?: number }) {
  return (
    <motion.div
      className="skeleton h-2.5 rounded-full"
      style={{ width }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    />
  );
}

function SkeletonBlock({
  height,
  delay = 0,
  className = "",
}: {
  height: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`skeleton rounded-xl ${className}`}
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    />
  );
}

/* ── Bento tile wrapper ───────────────────────────────────────── */
function BentoTile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`glass-card p-5 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Ghost tile: Profile ──────────────────────────────────────── */
function GhostProfile() {
  return (
    <BentoTile className="col-span-2 md:col-span-1" delay={0.05}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="skeleton h-14 w-14 flex-shrink-0 rounded-full" />
        {/* Info */}
        <div className="flex-1 space-y-2.5 pt-1">
          <SkeletonLine width="60%" delay={0.1} />
          <SkeletonLine width="40%" delay={0.15} />
          <SkeletonLine width="75%" delay={0.2} />
        </div>
      </div>
      {/* Stats row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[0.25, 0.3, 0.35].map((d, i) => (
          <div
            key={i}
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(230,230,250,0.05)" }}
          >
            <SkeletonLine width="50%" delay={d} />
            <div className="mt-1.5">
              <SkeletonLine width="70%" delay={d + 0.05} />
            </div>
          </div>
        ))}
      </div>
    </BentoTile>
  );
}

/* ── Ghost tile: Heatmap ──────────────────────────────────────── */
function GhostHeatmap() {
  return (
    <BentoTile className="col-span-2 md:col-span-2" delay={0.1}>
      <div className="mb-4 flex items-center justify-between">
        <SkeletonLine width="140px" delay={0.12} />
        <SkeletonLine width="60px" delay={0.15} />
      </div>
      {/* Heatmap grid */}
      <div className="flex gap-1">
        {Array.from({ length: 26 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, row) => (
              <motion.div
                key={row}
                className="skeleton h-3 w-3 rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.random() * 0.6 + 0.1 }}
                transition={{ delay: 0.15 + col * 0.01 + row * 0.005, duration: 0.3 }}
              />
            ))}
          </div>
        ))}
      </div>
    </BentoTile>
  );
}

/* ── Ghost tile: Language breakdown ──────────────────────────── */
function GhostLanguages() {
  const widths = ["72%", "52%", "38%", "24%", "15%"];
  return (
    <BentoTile delay={0.15}>
      <div className="mb-4">
        <SkeletonLine width="120px" delay={0.17} />
      </div>
      <div className="space-y-3">
        {widths.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-2.5 w-2.5 rounded-full flex-shrink-0" />
            <div
              className="skeleton h-2 rounded-full"
              style={{ width: w, opacity: 0.7 - i * 0.1 }}
            />
            <div className="skeleton ml-auto h-2 w-8 rounded-full" />
          </div>
        ))}
      </div>
      {/* Donut ghost */}
      <div className="mt-5 flex justify-center">
        <div className="skeleton h-24 w-24 rounded-full" style={{ opacity: 0.4 }} />
      </div>
    </BentoTile>
  );
}

/* ── Ghost tile: Developer Rhythm (peak hours) ───────────────── */
function GhostRhythm() {
  const bars = [40, 65, 80, 55, 90, 70, 45, 30, 60, 85, 50, 35];
  return (
    <BentoTile delay={0.2}>
      <div className="mb-4 flex items-center gap-2">
        <SkeletonLine width="130px" delay={0.22} />
      </div>
      {/* Bar chart ghost */}
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="skeleton flex-1 rounded-t-sm"
            style={{ height: `${h}%`, opacity: 0.3 + (h / 100) * 0.4 }}
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.22 + i * 0.03, duration: 0.4, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        {["00", "06", "12", "18"].map((t) => (
          <span key={t} style={{ color: "rgba(107,107,138,0.3)", fontSize: 10 }}>
            {t}h
          </span>
        ))}
      </div>
    </BentoTile>
  );
}

/* ── Ghost tile: PR Velocity ──────────────────────────────────── */
function GhostPRVelocity() {
  return (
    <BentoTile delay={0.25}>
      <div className="mb-4">
        <SkeletonLine width="100px" delay={0.27} />
      </div>
      <div className="flex items-end gap-2">
        <SkeletonBlock height="48px" delay={0.28} className="w-16" />
        <div className="flex-1 space-y-2 pb-1">
          <SkeletonLine width="80%" delay={0.3} />
          <SkeletonLine width="60%" delay={0.33} />
        </div>
      </div>
      <SkeletonBlock height="4px" delay={0.35} className="mt-4 w-full rounded-full" />
    </BentoTile>
  );
}

/* ── Ghost tile: Tech Debt Insights ──────────────────────────── */
function GhostTechDebt() {
  return (
    <BentoTile className="col-span-2 md:col-span-1" delay={0.3}>
      <div className="mb-4 flex items-center justify-between">
        <SkeletonLine width="150px" delay={0.32} />
        <div
          className="skeleton h-5 w-16 rounded-full"
          style={{ opacity: 0.5 }}
        />
      </div>
      <div className="space-y-3">
        {[0.34, 0.38, 0.42].map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(230,230,250,0.04)" }}
          >
            <div className="skeleton h-7 w-7 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <SkeletonLine width="70%" delay={d} />
              <SkeletonLine width="45%" delay={d + 0.04} />
            </div>
            <SkeletonLine width="30px" delay={d + 0.06} />
          </div>
        ))}
      </div>
    </BentoTile>
  );
}

/* ── "Awaiting" overlay label ────────────────────────────────── */
function AwaitingLabel() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div
        className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs backdrop-blur-sm"
        style={{
          background: "rgba(18,18,18,0.75)",
          border: "1px solid rgba(230,230,250,0.08)",
          color: "rgba(107,107,138,0.7)",
        }}
      >
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "rgba(157,143,205,0.5)" }}
        />
        Enter a username above to populate your dashboard
      </div>
    </motion.div>
  );
}

/* ── Main GhostGrid export ────────────────────────────────────── */
export default function GhostGrid() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Fade-out at bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, #121212)",
        }}
      />

      {/* Awaiting label */}
      <AwaitingLabel />

      {/* Bento grid */}
      <div
        className="grid grid-cols-2 gap-4 opacity-70 md:grid-cols-3"
        style={{ filter: "blur(0.3px)" }}
      >
        <GhostProfile />
        <GhostHeatmap />
        <GhostLanguages />
        <GhostRhythm />
        <GhostPRVelocity />
        <GhostTechDebt />
      </div>
    </div>
  );
}
