"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

const chapters = [
  {
    num: "I",
    title: "Liwasan",
    subtitle: "The Spark",
    mood: ["friendship", "longing", "warmth"],
    desc: "Where it begins. A chance encounter that feels like something more. Liwasan captures the electric moment when friendship tilts toward something neither person knows how to name yet.",
    year: "2024",
    locked: false,
  },
  {
    num: "II",
    title: "Maglaho",
    subtitle: "The Unraveling",
    mood: ["fade", "distance", "grief"],
    desc: "The moment everything starts to fade. What was once vivid goes quiet. Maglaho is the song you play when you realize you've already lost something — you just didn't know when.",
    year: "Jun 2025",
    locked: false,
  },
  {
    num: "III",
    title: "Hustisya",
    subtitle: "The Reckoning",
    mood: ["anger", "clarity", "release"],
    desc: "Produced by Brian Lotho at Sonic State Audio. After the fade comes the fire. Hustisya is the confrontation you've been rehearsing in your head — finally said out loud.",
    year: "Sep 2025",
    locked: false,
  },
  {
    num: "IV",
    title: "???",
    subtitle: "Coming Soon",
    mood: ["unknown"],
    desc: "The story isn't over.",
    year: "???",
    locked: true,
  },
];

export function StoryMap() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const zOffsets = ["translateZ(0px)", "translateZ(-20px)", "translateZ(-40px)", "translateZ(-70px)"];
  const opacities = [1, 0.85, 0.7, 0.3];

  return (
    <section id="story" className="relative overflow-hidden bg-black py-28 px-6 md:px-10">
      {/* Ambient amber glow at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-amber/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl" ref={sectionRef}>
        <Reveal>
          <SectionLabel>The Story So Far</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Every Song
            <br />
            <span className="text-amber">is a Chapter.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-xl font-serif text-sm leading-relaxed text-gray">
            Liwasan, Maglaho, and Hustisya form a connected arc — a romance that
            blooms from friendship, slowly unravels, and demands justice. Like
            chapters in a novel, each song only fully makes sense when you know
            what came before.
          </p>
        </Reveal>

        {/* Panels */}
        <div
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          style={{ perspective: "900px" }}
        >
          {chapters.map((ch, i) => (
            <ChapterPanel
              key={ch.num}
              chapter={ch}
              index={i}
              zOffset={zOffsets[i]}
              opacity={opacities[i]}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </div>

        {/* Amber connecting path */}
        <AmberPath />
      </div>
    </section>
  );
}

function ChapterPanel({
  chapter, index, zOffset, opacity, expanded, onToggle,
}: {
  chapter: (typeof chapters)[number];
  index: number;
  zOffset: string;
  opacity: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        transform: zOffset,
        opacity: inView ? opacity : 0,
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <button
        onClick={onToggle}
        disabled={chapter.locked}
        className={`relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
          chapter.locked
            ? "cursor-default border-[var(--border)] bg-[var(--navy-soft)] blur-[1px]"
            : expanded
            ? "border-amber/40 bg-[var(--navy-mid)]"
            : "border-[var(--border)] bg-[var(--navy-soft)] hover:border-amber/30"
        }`}
      >
        {/* Big faint chapter number */}
        <span className="pointer-events-none absolute -right-2 -top-4 font-display text-[120px] leading-none text-white/[0.03] select-none">
          {chapter.num}
        </span>

        <div className="relative p-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber/60">
            Chapter {chapter.num} · {chapter.year}
          </span>
          <h3 className="mt-2 font-display text-3xl tracking-wide text-white">
            {chapter.locked ? "???" : chapter.title}
          </h3>
          <p className="mt-1 font-serif text-xs italic text-amber/70">
            {chapter.subtitle}
          </p>

          {!chapter.locked && (
            <div className="mt-3 flex flex-wrap gap-1">
              {chapter.mood.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--amber-faint)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Expanded description */}
          {expanded && !chapter.locked && (
            <p className="mt-4 font-serif text-sm leading-relaxed text-gray">
              {chapter.desc}
            </p>
          )}

          {chapter.locked && (
            <div className="mt-6 flex flex-col items-center gap-2 py-4">
              <span className="text-3xl">🔒</span>
              <p className="font-sans text-xs text-gray-dim">The story isn't over.</p>
            </div>
          )}

          {!chapter.locked && (
            <span className="mt-4 block font-mono text-[10px] text-amber/50">
              {expanded ? "↑ collapse" : "↓ expand"}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

function AmberPath() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <svg
      ref={ref}
      className="mt-10 w-full overflow-visible"
      height="24"
      viewBox="0 0 1000 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Dots at chapter positions */}
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={83 + i * 278}
          cy={12}
          r={4}
          fill="#E8A838"
          opacity={i === 3 ? 0.3 : 0.8}
        />
      ))}
      {/* Connecting line that draws itself */}
      <line
        x1="83" y1="12" x2="917" y2="12"
        stroke="#E8A838"
        strokeWidth="1"
        strokeDasharray="834"
        strokeDashoffset={inView ? "0" : "834"}
        opacity="0.3"
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s" }}
      />
    </svg>
  );
}
