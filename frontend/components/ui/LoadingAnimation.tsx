"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Code2,
  GitCommit,
  GitPullRequest,
  Activity,
  Check,
} from "lucide-react";

const NODES = [
  { id: "profile",   label: "Profile",      Icon: User,           angle: -90,  message: "Fetching profile…" },
  { id: "langs",     label: "Languages",    Icon: Code2,          angle: -18,  message: "Scanning repositories…" },
  { id: "commits",   label: "Commits",      Icon: GitCommit,      angle: 54,   message: "Mapping commit history…" },
  { id: "prs",       label: "PR Velocity",  Icon: GitPullRequest, angle: 126,  message: "Computing PR velocity…" },
  { id: "rhythm",    label: "Dev Rhythm",   Icon: Activity,       angle: 198,  message: "Analysing dev rhythm…" },
];

const R = 110; // orbit radius (px)
const toRad = (deg: number) => (deg * Math.PI) / 180;

function nodePos(angle: number) {
  return {
    x: R * Math.cos(toRad(angle)),
    y: R * Math.sin(toRad(angle)),
  };
}

export default function LoadingAnimation({ username }: { username: string }) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < NODES.length; i++) {
        await new Promise((r) => setTimeout(r, 900 + i * 300));
        if (cancelled) return;
        setActiveIdx(i);
      }
      await new Promise((r) => setTimeout(r, 600));
      if (!cancelled) setDone(true);
    };
    run();
    return () => { cancelled = true; };
  }, [username]);

  const currentMsg =
    activeIdx >= 0 && activeIdx < NODES.length
      ? NODES[activeIdx].message
      : "Connecting to GitHub…";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 select-none">
      {/* Network graph */}
      <div className="relative flex items-center justify-center" style={{ width: R * 2 + 80, height: R * 2 + 80 }}>
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          viewBox={`${-R - 40} ${-R - 40} ${(R + 40) * 2} ${(R + 40) * 2}`}
        >
          {/* Orbit ring */}
          <circle
            cx={0}
            cy={0}
            r={R}
            fill="none"
            stroke="rgba(230,230,250,0.04)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />

          {/* Connection lines */}
          {NODES.map((n, i) => {
            const pos = nodePos(n.angle);
            const lit = i <= activeIdx;
            return (
              <motion.line
                key={n.id}
                x1={0} y1={0}
                x2={pos.x} y2={pos.y}
                stroke={lit ? "rgba(157,143,205,0.35)" : "rgba(230,230,250,0.06)"}
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.18 }}
              />
            );
          })}
        </svg>

        {/* Center node — username */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center rounded-full text-center"
          style={{
            width: 72, height: 72,
            background: "rgba(157,143,205,0.08)",
            border: "1.5px solid rgba(157,143,205,0.25)",
          }}
          animate={{ boxShadow: ["0 0 0px rgba(157,143,205,0)", "0 0 24px rgba(157,143,205,0.2)", "0 0 0px rgba(157,143,205,0)"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-[-6px] rounded-full"
            style={{
              border: "1px solid transparent",
              borderTopColor: "rgba(157,143,205,0.5)",
              borderRightColor: "rgba(157,143,205,0.2)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <span className="font-mono text-[10px] font-medium leading-none" style={{ color: "#9d8fcd" }}>
            @
          </span>
          <span
            className="font-mono text-[11px] font-semibold leading-none mt-0.5 max-w-[56px] truncate px-1"
            style={{ color: "#e6e6fa" }}
          >
            {username}
          </span>
        </motion.div>

        {/* Orbit nodes */}
        {NODES.map((n, i) => {
          const pos = nodePos(n.angle);
          const lit = i <= activeIdx;
          const isDone = done || i < activeIdx;

          return (
            <motion.div
              key={n.id}
              className="absolute flex flex-col items-center gap-1"
              style={{
                left: "50%",
                top: "50%",
                x: pos.x - 24,
                y: pos.y - 24,
                width: 48,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 + 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Node icon circle */}
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: lit ? "rgba(157,143,205,0.12)" : "rgba(255,255,255,0.025)",
                  border: lit
                    ? "1px solid rgba(157,143,205,0.3)"
                    : "1px solid rgba(230,230,250,0.06)",
                }}
                animate={
                  lit && !isDone
                    ? { boxShadow: ["0 0 0px rgba(157,143,205,0)", "0 0 14px rgba(157,143,205,0.25)", "0 0 0px rgba(157,143,205,0)"] }
                    : {}
                }
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check size={14} style={{ color: "#4ade80" }} strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div key="icon" initial={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }}>
                      <n.Icon
                        size={14}
                        style={{ color: lit ? "#c4c4e8" : "#4b4b6a" }}
                        strokeWidth={1.8}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label */}
              <span
                className="text-center text-[9px] leading-tight font-medium"
                style={{ color: lit ? "rgba(196,196,232,0.8)" : "rgba(107,107,138,0.5)" }}
              >
                {n.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Status text */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMsg}
            className="text-xs"
            style={{ color: "#6b6b8a" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {currentMsg}
          </motion.p>
        </AnimatePresence>

        {/* Dot progress */}
        <div className="flex items-center gap-1.5">
          {NODES.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: i <= activeIdx ? 6 : 4,
                height: i <= activeIdx ? 6 : 4,
                background: i <= activeIdx ? "#9d8fcd" : "rgba(230,230,250,0.1)",
              }}
              animate={{ scale: i === activeIdx ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.6, repeat: i === activeIdx ? Infinity : 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
