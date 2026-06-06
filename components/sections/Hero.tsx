"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// 3D scene: client-only, never SSR'd (WebGL must not run on the server).
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const NAME = "KIDZ THESE DAYS";

// Hero background tiers:
//   video  — desktop, motion OK: live band footage (the signature)
//   3d     — mobile, or when the video file is missing/fails to load
//   static — reduced-motion: a still amber wash, no animation
type HeroMode = "video" | "3d" | "static";

export function Hero() {
  // null = undecided (avoids a hydration flash before we read matchMedia)
  const [mode, setMode] = useState<HeroMode | null>(null);
  const [particleCount, setParticleCount] = useState(700);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setParticleCount(mobile ? 250 : 700);
    setMode(reduced ? "static" : mobile ? "3d" : "video");
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-stretch bg-black p-3 md:p-5"
    >
      {/* Inset framed card holds the whole hero */}
      <div className="relative flex flex-1 items-center overflow-hidden rounded-[28px] border border-[var(--border)] bg-[#0B0D12]">
      {/* Background tier: live video / 3D scene / static wash */}
      <div className="absolute inset-0">
        {mode === "video" && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-poster.jpg"
            // If hero.mp4 isn't present yet, drop to the 3D scene instead.
            onError={() => setMode("3d")}
          >
            <source src="/video/hero.mp4" type="video/mp4" />
            <source src="/video/hero.webm" type="video/webm" />
          </video>
        )}

        {mode === "3d" && <HeroScene particleCount={particleCount} />}

        {mode === "static" && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 40%, rgba(232,168,56,0.18), transparent 55%)",
            }}
          />
        )}
      </div>

      {/* Amber color grade — only over the live video, to match the
          "Late Night City Pop" world (grain + vignette layer on top of this). */}
      {mode === "video" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,15,0.35) 0%, rgba(10,10,15,0.55) 100%), radial-gradient(ellipse at 70% 50%, rgba(232,168,56,0.10), transparent 55%)",
          }}
        />
      )}

      {/* Vignette + legibility wash over the scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.85) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.4) 45%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <SectionLabel>Cebu City · Since 2022</SectionLabel>
          </motion.div>

          <h1
            className="mt-6 font-display leading-[0.88] tracking-wide text-white"
            style={{ fontSize: "var(--text-hero)" }}
            aria-label={NAME}
          >
            {NAME.split(" ").map((word, wi) => (
              <span key={wi} className="block">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="inline-block overflow-hidden align-bottom"
                    aria-hidden="true"
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.8 + (wi * 6 + ci) * 0.04,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 font-serif text-xl text-gray md:text-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            Indie Pop-Rock · OPM · City Pop · Funk
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
          >
            <a
              href="#music"
              className="rounded-full bg-amber px-7 py-3 font-sans font-medium text-black transition-colors hover:bg-amber-glow"
            >
              ▶ Listen
            </a>
            <a
              href="#about"
              className="rounded-full border border-[var(--border)] px-7 py-3 font-sans font-light text-white/90 transition-colors hover:border-amber hover:text-amber"
            >
              Our Story ↓
            </a>
          </motion.div>

          <motion.div
            className="mt-12 flex gap-6 font-mono text-xs uppercase tracking-widest text-gray-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <a href="#" className="transition-colors hover:text-amber">
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-amber">
              Spotify
            </a>
            <a href="#" className="transition-colors hover:text-amber">
              YouTube
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 hidden flex-col items-center gap-2 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-dim">
          Scroll
        </span>
        <motion.span
          className="h-10 w-px bg-gradient-to-b from-amber to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </motion.div>
      </div>
    </section>
  );
}
