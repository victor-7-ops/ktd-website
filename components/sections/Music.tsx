import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { AlbumCarousel } from "@/components/ui/AlbumCarousel";

export function Music() {
  return (
    <section id="music" className="bg-black py-28 px-6 md:px-10">
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
            <AlbumCarousel />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
