import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { shows } from "@/lib/data/shows";

export function Shows() {
  return (
    <section id="shows" className="bg-[var(--navy-soft)] py-28 px-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionLabel>Live</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            See Us <span className="text-amber">Live.</span>
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-col gap-4">
          {shows.map((show, i) => {
            const upcoming = show.status === "upcoming";
            return (
              <Reveal key={i} delay={i * 80}>
                <div
                  className={`flex flex-col items-start gap-4 rounded-2xl border p-6 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    upcoming
                      ? "border-amber/30 bg-[var(--amber-faint)]"
                      : "border-[var(--border)] bg-[var(--navy-soft)] opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Big date */}
                    <span
                      className="font-display leading-none text-amber"
                      style={{ fontSize: "clamp(36px,5vw,56px)" }}
                    >
                      {show.date}
                    </span>
                    <div>
                      <p className="font-sans text-base font-semibold text-white">
                        {show.name}
                      </p>
                      <p className="font-mono text-xs text-gray-dim">{show.venue}</p>
                    </div>
                  </div>

                  {upcoming ? (
                    <a
                      href={show.ticketUrl ?? "#"}
                      className="shrink-0 rounded-full bg-amber px-6 py-2.5 font-sans text-sm font-medium text-black transition-colors hover:bg-amber-glow"
                    >
                      Get Tickets
                    </a>
                  ) : (
                    <span className="shrink-0 rounded-full border border-[var(--border)] px-4 py-2 font-mono text-xs text-gray-dim">
                      Past Show
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
