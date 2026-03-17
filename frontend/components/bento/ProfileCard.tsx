"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, BookOpen, GitCommit, Calendar, Flame, Trophy } from "lucide-react";
import type { UserProfile } from "@/types/github";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function StatPill({
  icon: Icon,
  value,
  label,
  delay,
  highlight,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className="flex flex-col items-center gap-1 rounded-xl p-3"
      style={{
        background: highlight ? "rgba(157,143,205,0.08)" : "rgba(255,255,255,0.025)",
        border: highlight ? "1px solid rgba(157,143,205,0.18)" : "1px solid rgba(230,230,250,0.05)",
      }}
    >
      <Icon size={13} style={{ color: highlight ? "#e6e6fa" : "#9d8fcd" }} strokeWidth={1.8} />
      <span className="text-sm font-semibold text-[#f0f0f0]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      <span className="text-[10px]" style={{ color: "#6b6b8a" }}>
        {label}
      </span>
    </motion.div>
  );
}

export default function ProfileCard({
  profile,
  totalCommits,
  currentStreak,
  longestStreak,
}: {
  profile: UserProfile;
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
}) {
  const joinYear = new Date(profile.created_at).getFullYear();

  return (
    <motion.div
      className="bento-tile p-5 h-full"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Avatar + name */}
      <motion.div variants={fadeUp} className="flex items-start gap-3 mb-4">
        <div
          className="relative flex-shrink-0 rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid rgba(230,230,250,0.1)" }}
        >
          <Image
            src={profile.avatar_url}
            alt={profile.login}
            width={56}
            height={56}
            className="rounded-2xl"
          />
          <span
            className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#121212]"
            style={{ background: "#4ade80" }}
          />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-[#f0f0f0] truncate">
            {profile.name || profile.login}
          </h2>
          <p className="text-xs" style={{ color: "#9d8fcd" }}>
            @{profile.login}
          </p>
          {profile.bio && (
            <p className="mt-1.5 text-[11px] leading-relaxed line-clamp-2" style={{ color: "#6b6b8a" }}>
              {profile.bio}
            </p>
          )}
        </div>
      </motion.div>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <StatPill icon={GitCommit} value={totalCommits} label="Commits / yr" delay={0.1} />
        <StatPill icon={BookOpen} value={profile.public_repos} label="Repos" delay={0.15} />
        <StatPill icon={Users} value={profile.followers.toLocaleString()} label="Followers" delay={0.2} />
        <StatPill icon={Calendar} value={`Since ${joinYear}`} label="Member" delay={0.25} />
      </div>

      {/* Streak row */}
      <div className="grid grid-cols-2 gap-2">
        <StatPill icon={Flame} value={`${currentStreak}d`} label="Current Streak" delay={0.3} highlight={currentStreak > 0} />
        <StatPill icon={Trophy} value={`${longestStreak}d`} label="Best Streak" delay={0.35} />
      </div>
    </motion.div>
  );
}
