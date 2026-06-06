"use client";

import { useState, useCallback } from "react";
import { discography } from "@/lib/data/discography";

export function AlbumCarousel() {
  const [active, setActive] = useState(2); // start centered on Maglaho
  const count = discography.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);

  const getStyle = (i: number) => {
    const offset = i - active;
    const abs = Math.abs(offset);
    if (abs === 0) return { transform: "translateX(0) rotateY(0deg) scale(1)", opacity: 1, filter: "none", zIndex: 10 };
    if (abs === 1) return { transform: `translateX(${offset * 52}%) rotateY(${-offset * 35}deg) scale(0.82)`, opacity: 0.55, filter: "blur(1px)", zIndex: 5 };
    return { transform: `translateX(${offset * 68}%) rotateY(${-offset * 50}deg) scale(0.68)`, opacity: 0.2, filter: "blur(2px)", zIndex: 1 };
  };

  const album = discography[active];

  return (
    <div className="w-full">
      {/* Carousel track */}
      <div
        className="relative mx-auto flex h-72 items-center justify-center md:h-80"
        style={{ perspective: "1200px" }}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }}
        tabIndex={0}
        role="region"
        aria-label="Album carousel"
      >
        {discography.map((d, i) => (
          <button
            key={d.title}
            onClick={() => setActive(i)}
            aria-label={`Select ${d.title}`}
            className="absolute flex h-56 w-44 flex-col items-center justify-end overflow-hidden rounded-2xl border border-[var(--border)] md:h-64 md:w-52"
            style={{
              ...getStyle(i),
              background: `linear-gradient(160deg, ${d.accent}cc, #0a0a0f)`,
              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s, filter 0.5s",
            }}
          >
            {/* Album art placeholder — big title */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-4xl tracking-wide text-white/10 md:text-5xl">
              {d.title.split(" ").map((w) => w[0]).join("")}
            </span>
            {/* Bottom scrim */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
            <p className="relative z-10 mb-3 px-3 text-center font-display text-lg tracking-wide text-white">
              {d.title}
            </p>
          </button>
        ))}
      </div>

      {/* Active album info */}
      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-amber">
          {album.chapter}
        </span>
        <h3 className="font-display text-4xl tracking-wide text-white">
          {album.title}
        </h3>
        {album.credit && (
          <p className="font-sans text-sm text-gray-dim">{album.credit}</p>
        )}
        <p className="max-w-sm font-serif text-sm italic text-gray">{album.desc}</p>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[var(--border)] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber/70">
            {album.label}
          </span>
          <span className="font-mono text-[10px] text-gray-dim">{album.year}{album.duration ? ` · ${album.duration}` : ""}</span>
        </div>
        <a
          href={album.spotify}
          className="mt-2 rounded-full bg-amber px-6 py-2.5 font-sans text-sm font-medium text-black transition-colors hover:bg-amber-glow"
        >
          ▶ Play on Spotify
        </a>
      </div>

      {/* Arrow controls */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button onClick={prev} aria-label="Previous album" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-gray transition-colors hover:border-amber hover:text-amber">
          ←
        </button>
        <div className="flex gap-2">
          {discography.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Go to album ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-amber" : "w-1.5 bg-gray-dim"}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next album" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-gray transition-colors hover:border-amber hover:text-amber">
          →
        </button>
      </div>
    </div>
  );
}
