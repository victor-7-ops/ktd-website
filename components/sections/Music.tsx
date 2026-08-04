"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { AlbumCarousel } from "@/components/ui/AlbumCarousel";

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("rgb(")) return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  if (color.startsWith("#")) {
    const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
    return `${color}${a}`;
  }
  return color;
}

export function Music() {
  const [accent, setAccent] = useState("#2a1a0a"); // Maglaho default

  return (
    <section
      id="music"
      className="bg-black py-28 px-6 md:px-10 transition-[background] duration-700 ease-out"
      style={{ background: `radial-gradient(circle at 50% 30%, ${withAlpha(accent, 0.35)}, #000 70%)` }}
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>Discography</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Songs That
            <br />
            <span className="text-amber">Tell a Story.</span>
          </h2>
        </Reveal>

        {/* Spotify bar */}
        <Reveal delay={140}>
          <div className="mt-10 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--navy-soft)] px-5 py-3">
            <span className="text-lg">🎵</span>
            <span className="font-sans text-sm text-gray">Now streaming on</span>
            <span className="font-sans text-sm font-semibold text-white">Spotify · Apple Music · YouTube</span>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-14">
            <AlbumCarousel onActiveChange={setAccent} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
