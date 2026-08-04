"use client";

import { useState, useCallback, useEffect } from "react";
import { discography } from "@/lib/data/discography";
import { getSpotifyAccentColor, getSpotifyThumbnail } from "@/lib/spotifyColor";

interface AlbumCarouselProps {
  onActiveChange?: (accent: string) => void;
}

export function AlbumCarousel({ onActiveChange }: AlbumCarouselProps = {}) {
  const [active, setActive] = useState(2); // start centered on Maglaho
  const [covers, setCovers] = useState<Record<string, string>>({});
  const count = discography.length;

  useEffect(() => {
    let cancelled = false;
    discography.forEach((d) => {
      if (!d.spotify) return;
      getSpotifyThumbnail(d.spotify).then((url) => {
        if (!cancelled && url) setCovers((prev) => ({ ...prev, [d.spotify as string]: url }));
      });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const current = discography[active];
    onActiveChange?.(current.accent); // fallback while real color loads
    if (!current.spotify) return;
    let cancelled = false;
    getSpotifyAccentColor(current.spotify).then((color) => {
      if (!cancelled && color) onActiveChange?.(color);
    });
    return () => { cancelled = true; };
  }, [active, onActiveChange]);

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
  const spotifyEmbedSrc = album.spotify
    ? album.spotify.replace("open.spotify.com/track/", "open.spotify.com/embed/track/")
    : null;

  return (
    <div className="w-full">
      {/* Carousel track */}
      <div
        className="relative mx-auto flex h-72 items-center justify-center md:h-80"
        style={{ perspective: "1200px" }}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }}
        tabIndex={0}
        role="region"
        aria-label="Album carousel — use left and right arrow keys to browse"
      >
        {discography.map((d, i) => (
          <button
            key={d.title}
            onClick={() => setActive(i)}
            aria-label={`Select ${d.title}`}
            aria-current={i === active ? "true" : undefined}
            className="absolute flex h-56 w-44 flex-col items-center justify-end overflow-hidden rounded-2xl border border-[var(--border)] md:h-64 md:w-52"
            style={{
              ...getStyle(i),
              background: `linear-gradient(160deg, ${d.accent}cc, #0a0a0f)`,
              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s, filter 0.5s",
            }}
          >
            {/* Album art — real Spotify cover once loaded, letter placeholder until then */}
            {d.spotify && covers[d.spotify] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={covers[d.spotify]}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-4xl tracking-wide text-white/10 md:text-5xl">
                {d.title.split(" ").map((w) => w[0]).join("")}
              </span>
            )}
            {/* Bottom scrim */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
            <p className="relative z-10 mb-3 px-3 text-center font-display text-lg tracking-wide text-white">
              {d.title}
            </p>
          </button>
        ))}
      </div>

      {/* Active album info */}
      <div
        className="mt-8 flex flex-col items-center gap-3 text-center"
        aria-live="polite"
        aria-atomic="true"
      >
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
        {spotifyEmbedSrc ? (
          <iframe
            key={spotifyEmbedSrc}
            title={`${album.title} — Spotify player`}
            src={spotifyEmbedSrc}
            width="100%"
            height="152"
            style={{ maxWidth: 360, borderRadius: 12, marginTop: 8 }}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : (
          <span className="mt-2 rounded-full border border-[var(--border)] px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-gray-dim">
            Streaming link coming soon
          </span>
        )}
      </div>

      {/* Arrow controls */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button onClick={prev} aria-label="Previous album" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-gray transition-colors hover:border-amber hover:text-amber">
          ←
        </button>
        <div className="flex gap-2">
          {discography.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to album ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
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
