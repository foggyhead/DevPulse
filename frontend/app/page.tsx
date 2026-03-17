"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Search,
  Github,
  Activity,
  GitBranch,
  Zap,
  BarChart2,
  Sparkles,
} from "lucide-react";

/* ── Stagger children helper ──────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Feature pill data ────────────────────────────────────────── */
const FEATURES = [
  { icon: Activity, label: "Developer Rhythm" },
  { icon: GitBranch, label: "PR Velocity" },
  { icon: BarChart2, label: "Language DNA" },
  { icon: Zap, label: "Tech Debt Insights" },
];

/* ── Animated background orbs ────────────────────────────────── */
function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Top lavender glow */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(157,143,205,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-right subtle orb */}
      <motion.div
        className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(230,230,250,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(230,230,250,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(230,230,250,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ── Cursor glow that follows mouse ──────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: springX,
        top: springY,
        background:
          "radial-gradient(circle, rgba(157,143,205,0.06) 0%, transparent 65%)",
      }}
    />
  );
}

/* ── Search bar ───────────────────────────────────────────────── */
function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = value.trim().replace(/^@/, "");
    if (!username) return;
    setLoading(true);
    // Brief pause for animation feel, then navigate
    await new Promise((r) => setTimeout(r, 300));
    router.push(`/dashboard/${username}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow ring on focus */}
      <AnimatePresence>
        {focused && (
          <motion.div
            className="absolute -inset-[1px] rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(157,143,205,0.25), rgba(230,230,250,0.1), rgba(157,143,205,0.15))",
              borderRadius: "inherit",
            }}
          />
        )}
      </AnimatePresence>

      {/* Input container */}
      <div
        className="relative flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-300"
        style={{
          background: focused
            ? "rgba(255,255,255,0.055)"
            : "rgba(255,255,255,0.03)",
          border: focused
            ? "1px solid rgba(230,230,250,0.14)"
            : "1px solid rgba(230,230,250,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: focused
            ? "0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(157,143,205,0.08)"
            : "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ color: focused ? "#9d8fcd" : "#6b6b8a" }}
          transition={{ duration: 0.2 }}
        >
          <Github size={18} strokeWidth={1.5} />
        </motion.div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter GitHub username to uncover their story."
          disabled={loading}
          className="flex-1 bg-transparent text-sm text-[#f0f0f0] placeholder:text-[#6b6b8a] focus:outline-none disabled:opacity-50"
          style={{ fontFamily: "var(--font-inter)" }}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Trailing — search button */}
        <motion.button
          type="submit"
          disabled={!value.trim() || loading}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: value.trim()
              ? "linear-gradient(135deg, rgba(157,143,205,0.25), rgba(230,230,250,0.08))"
              : "transparent",
            border: "1px solid rgba(230,230,250,0.1)",
            color: value.trim() ? "#e6e6fa" : "#6b6b8a",
          }}
        >
          {loading ? (
            <motion.div
              className="h-3 w-3 rounded-full border border-lavender-muted border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              <Search size={12} strokeWidth={2} />
              Analyze
            </>
          )}
        </motion.button>
      </div>

      {/* Hint text */}
      <AnimatePresence>
        {!focused && !value && (
          <motion.p
            className="mt-2.5 text-center text-xs"
            style={{ color: "#6b6b8a" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Try{" "}
            {["torvalds", "gaearon", "sindresorhus"].map((u, i) => (
              <span key={u}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(u);
                    inputRef.current?.focus();
                  }}
                  className="font-mono text-[11px] transition-colors duration-150"
                  style={{ color: "rgba(157,143,205,0.7)" }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#9d8fcd")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "rgba(157,143,205,0.7)")
                  }
                >
                  @{u}
                </button>
                {i < 2 && <span style={{ color: "#333" }}> · </span>}
              </span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

/* ── Feature pills ────────────────────────────────────────────── */
function FeaturePills() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {FEATURES.map(({ icon: Icon, label }) => (
        <motion.span
          key={label}
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(230,230,250,0.07)",
            color: "#9d8fcd",
          }}
        >
          <Icon size={11} strokeWidth={2} />
          {label}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ── Header ───────────────────────────────────────────────────── */
function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <motion.div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(157,143,205,0.2), rgba(230,230,250,0.06))",
            border: "1px solid rgba(230,230,250,0.1)",
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Activity size={14} style={{ color: "#e6e6fa" }} strokeWidth={2} />
        </motion.div>
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: "#f0f0f0" }}
        >
          DevPulse
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {["Features", "Docs", "GitHub"].map((item) => (
          <motion.a
            key={item}
            href="#"
            className="text-xs transition-colors duration-200"
            style={{ color: "#6b6b8a" }}
            whileHover={{ color: "#c4c4e8" }}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      {/* CTA */}
      <motion.a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(230,230,250,0.08)",
          color: "#9d8fcd",
        }}
        whileHover={{
          background: "rgba(255,255,255,0.07)",
          borderColor: "rgba(230,230,250,0.13)",
        }}
        whileTap={{ scale: 0.97 }}
      >
        <Github size={12} strokeWidth={2} />
        Star on GitHub
      </motion.a>
    </motion.header>
  );
}

/* ── Hero Section ─────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-32 pt-24">
      <motion.div
        className="w-full max-w-2xl text-center"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-8 inline-flex items-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(157,143,205,0.08)",
              border: "1px solid rgba(157,143,205,0.18)",
              color: "#9d8fcd",
            }}
          >
            <Sparkles size={11} strokeWidth={2} />
            GitHub Analytics, Reimagined
            <span
              className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "#9d8fcd" }}
            />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="mb-5 text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl"
        >
          <span className="gradient-text-vivid">Decode</span>{" "}
          <span style={{ color: "#f0f0f0" }}>the</span>
          <br />
          <span style={{ color: "#f0f0f0" }}>developer.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mb-10 max-w-md text-base leading-relaxed md:text-lg"
          style={{ color: "#6b6b8a" }}
        >
          Uncover commit rhythms, language DNA, PR velocity, and technical debt
          signals — all in one{" "}
          <span style={{ color: "#9d8fcd" }}>elegant dashboard</span>.
        </motion.p>

        {/* Search bar */}
        <motion.div variants={fadeUp} className="mb-8">
          <SearchBar />
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={fadeUp}>
          <FeaturePills />
        </motion.div>

        {/* Scroll nudge */}
      </motion.div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#121212]">
      <BackgroundOrbs />
      <CursorGlow />
      <Header />
      <Hero />

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t mt-8"
        style={{ borderColor: "rgba(230,230,250,0.05)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="mx-auto max-w-5xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-lg flex-shrink-0"
              style={{
                background: "rgba(157,143,205,0.1)",
                border: "1px solid rgba(230,230,250,0.08)",
              }}
            >
              <Activity size={12} style={{ color: "#9d8fcd" }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: "rgba(196,196,232,0.5)" }}>
              DevPulse
            </span>
            <span style={{ color: "rgba(230,230,250,0.08)" }}>·</span>
            <span className="text-xs" style={{ color: "rgba(107,107,138,0.5)" }}>
              Built with intention by{" "}
              <span style={{ color: "rgba(157,143,205,0.7)" }}>Harsha</span>
            </span>
          </div>

          {/* Center: links */}
          <div className="flex items-center gap-6">
            {["Features", "Docs", "GitHub"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-150"
                style={{ color: "rgba(107,107,138,0.45)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(196,196,232,0.7)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(107,107,138,0.45)")}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right: copyright */}
          <span className="text-xs" style={{ color: "rgba(107,107,138,0.3)" }}>
            © 2026 DevPulse
          </span>
        </div>
      </motion.footer>
    </main>
  );
}
