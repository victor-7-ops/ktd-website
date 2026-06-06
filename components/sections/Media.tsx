"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

const tabs = ["All", "Live", "Press", "Behind the Scenes"] as const;
type Tab = (typeof tabs)[number];

const mediaItems = [
  { label: "iWant ASAP — Live Performance", category: "Live", aspect: "wide", note: "ABS-CBN · June 2, 2024" },
  { label: "Official Press Photo", category: "Press", aspect: "tall", note: "Black outfit series" },
  { label: "GoJam S2 — TriNoma Finals", category: "Live", aspect: "square", note: "Ayala TriNoma · Oct 26, 2024" },
  { label: "VivaMix @ Handuraw Pizza", category: "Live", aspect: "wide", note: "Oct 2024" },
  { label: "Press Photo — Unstable Records", category: "Press", aspect: "square", note: "Signed artist shoot" },
  { label: "Rehearsal Footage", category: "Behind the Scenes", aspect: "tall", note: "Pre-GoJam prep" },
  { label: "GoJam Mentorship Session", category: "Behind the Scenes", aspect: "square", note: "With Gab Alipe · Urbandub" },
  { label: "iWant ASAP Promo Poster", category: "Press", aspect: "wide", note: "Official ABS-CBN branded" },
];

const aspectMap = {
  wide: "col-span-2 row-span-1 h-48",
  tall: "col-span-1 row-span-2 h-full min-h-[320px]",
  square: "col-span-1 row-span-1 h-48",
};

export function Media() {
  const [active, setActive] = useState<Tab>("All");

  const filtered = mediaItems.filter(
    (m) => active === "All" || m.category === active
  );

  return (
    <section id="media" className="bg-[var(--navy-soft)] py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>Media</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            The Visual
            <br />
            <span className="text-amber">World.</span>
          </h2>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`rounded-full border px-4 py-1.5 font-sans text-sm transition-all ${
                  active === tab
                    ? "border-amber bg-amber/10 text-amber"
                    : "border-[var(--border)] text-gray hover:border-amber/40 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Masonry grid */}
        <Reveal delay={160}>
          <div className="mt-8 grid auto-rows-auto grid-cols-2 gap-4 md:grid-cols-4">
            {filtered.map((item, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--navy-mid)] ${aspectMap[item.aspect as keyof typeof aspectMap]}`}
              >
                {/* Placeholder — swap for <Image> when real photos arrive */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <span className="font-display text-2xl text-amber/20">KTD</span>
                  <span className="font-sans text-xs font-medium text-white/60">{item.label}</span>
                  <span className="font-mono text-[9px] text-gray-dim">{item.note}</span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-amber/0 transition-colors hover:bg-amber/5" />
              </div>
            ))}
          </div>
        </Reveal>

        {/* YouTube embed slot */}
        <Reveal delay={200}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--navy-mid)]">
            <div className="flex aspect-video w-full items-center justify-center">
              {/* Replace the div below with an <iframe> when the real video ID is known */}
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-4xl">▶</span>
                <span className="font-display text-xl text-white">"Huli Na Ba" — Lyric Video</span>
                <span className="font-mono text-xs text-gray-dim">YouTube embed · add video ID to Media.tsx</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
