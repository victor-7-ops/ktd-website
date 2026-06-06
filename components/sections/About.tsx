"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/lib/data/members";

export function About() {
  return (
    <section id="about" className="bg-black py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <Reveal>
          <SectionLabel>Our Story</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            From Strangers
            <br />
            <span className="text-amber">to a Sound.</span>
          </h2>
        </Reveal>

        {/* Two-column body */}
        <div className="mt-16 grid gap-16 md:grid-cols-2">

          {/* Left — origin story */}
          <Reveal delay={120}>
            <div className="space-y-6 font-serif text-[var(--text-body)] leading-relaxed text-gray">
              <p>
                Paolo, Harold, and Victor were strangers who showed up to the
                same charity music event in 2022. Nobody planned what happened
                next. One rehearsal became one gig. One gig became a band —
                formed officially in November 2022.
              </p>
              <p>
                Later, Azi walked in as a judge at a school Battle of the Bands.
                He came to evaluate other bands. He stayed to complete the sound.
              </p>
              <p>
                The name came from Victor. "Kids these days" — a phrase people
                say with disappointment. He flipped it. The "z" is deliberate.
                KIDZ THESE DAYS exists to prove this generation is open to new
                experiments and fresh ideas in music.
              </p>

              {/* Pull-quote */}
              <blockquote
                className="mt-10 border-l-2 border-amber pl-6 font-serif italic text-white"
                style={{ fontSize: "var(--text-heading)" }}
              >
                "We aim to flip that script."
                <cite className="mt-3 block font-sans text-sm not-italic text-amber/70">
                  — Victor Alexis, Drums
                </cite>
              </blockquote>

              {/* Unstable Records reveal — now surfaces here intentionally */}
              <p className="mt-8 font-sans text-sm text-gray-dim">
                Signed to{" "}
                <span className="text-amber">Unstable Records</span> —
                a Singapore-based Filipino indie label, est. December 2022.
                Distributed through Viva Records and Universal Music PH.
              </p>
            </div>
          </Reveal>

          {/* Right — milestone timeline */}
          <Reveal delay={200}>
            <ol className="relative space-y-0">
              {timeline.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} />
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timeline)[number];
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <li ref={ref} className="group relative flex gap-6 pb-10 last:pb-0">
      {/* Vertical line */}
      <div className="relative flex flex-col items-center">
        <motion.div
          className="h-3 w-3 rounded-full border-2 border-amber bg-black transition-colors group-hover:bg-amber"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: index * 0.08, duration: 0.35, ease: "backOut" }}
        />
        {/* connector */}
        <motion.div
          className="mt-1 flex-1 w-px bg-gradient-to-b from-amber/40 to-amber/05"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ delay: index * 0.08 + 0.15, duration: 0.4 }}
          style={{ originY: 0 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="pb-2 pt-0"
        initial={{ opacity: 0, x: -10 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ delay: index * 0.08 + 0.05, duration: 0.5 }}
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-amber">
          {item.date}
        </span>
        <p className="mt-1 font-sans text-sm font-light leading-relaxed text-gray">
          {item.text}
        </p>
        {item.badge && (
          <span className="mt-2 inline-block rounded-full border border-[var(--border)] bg-[var(--amber-faint)] px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">
            {item.badge}
          </span>
        )}
      </motion.div>
    </li>
  );
}
