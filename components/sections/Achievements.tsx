import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { achievements, labels, mentors } from "@/lib/data/achievements";

export function Achievements() {
  return (
    <section id="achievements" className="bg-navy py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>Milestones</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Three Years.
            <br />
            <span className="text-amber">A Lifetime of Moments.</span>
          </h2>
        </Reveal>

        {/* Cred cards grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--navy-soft)] p-6 transition-colors hover:border-amber/30">
                <span className="text-2xl">{a.icon}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber">
                  {a.tag}
                </span>
                <h3 className="font-sans text-base font-semibold text-white">
                  {a.title}
                </h3>
                <p className="font-serif text-sm leading-relaxed text-gray">
                  {a.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Label connections */}
        <Reveal delay={200}>
          <div className="mt-20">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber/60">
              Label Connections
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {labels.map((l) => (
                <div
                  key={l.name}
                  className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--navy-mid)] px-6 py-4"
                >
                  <span className="font-sans text-sm font-semibold text-white">
                    {l.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber">
                    {l.role}
                  </span>
                  <span className="font-sans text-xs text-gray-dim">{l.note}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Mentors wall */}
        <Reveal delay={260}>
          <div className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber/60">
              Globe GoJam S2 Mentors
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {mentors.map((m) => (
                <div
                  key={m.name}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--navy-soft)] py-6 text-center"
                >
                  <span className="text-3xl">{m.icon}</span>
                  <span className="font-sans text-sm font-semibold text-white">
                    {m.name}
                  </span>
                  <span className="font-mono text-[10px] text-amber/70">
                    {m.band}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
