import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { members } from "@/lib/data/members";

export function Members() {
  return (
    <section id="members" className="bg-navy py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">

        <Reveal>
          <SectionLabel>The Band</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Four People.
            <br />
            <span className="text-amber">One Sound.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 font-sans text-sm font-light text-gray-dim max-w-md">
            Every member has a story. Every story is part of the music.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={i * 80}>
              <TiltCard className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--navy-soft)]">

                  {/* Photo / initials area */}
                  <div className="relative flex h-52 items-center justify-center bg-[var(--navy-mid)]">
                    {/* Placeholder: initials. Swap for <Image> once photos arrive. */}
                    <span
                      className="font-display text-6xl tracking-wide text-amber/20"
                      aria-hidden="true"
                    >
                      {m.initials}
                    </span>
                    {/* Gradient scrim for legibility of role badge */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--navy-soft)] to-transparent" />
                    {/* Role badge */}
                    <span className="absolute bottom-3 left-4 rounded-full border border-[var(--border)] bg-[var(--amber-faint)] px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber">
                      {m.role}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="font-sans text-base font-semibold text-white">
                      {m.name}
                    </h3>
                    <p className="font-serif text-sm leading-relaxed text-gray">
                      {m.story}
                    </p>
                    <hr className="mt-auto border-[var(--border)]" />
                    <p className="font-serif text-sm italic text-amber/80">
                      "{m.quote}"
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
