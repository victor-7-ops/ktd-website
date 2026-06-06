"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

const inquiryTypes = ["Booking", "Press", "Collab", "Fan"] as const;
type InquiryType = (typeof inquiryTypes)[number];

const directLinks = [
  { icon: "📸", label: "Instagram", value: "@kidzthesedaysofficial", url: "https://instagram.com/kidzthesedaysofficial" },
  { icon: "✉️", label: "Email", value: "contact@ktd.ph", url: "mailto:contact@ktd.ph" },
  { icon: "🎵", label: "Spotify", value: "KIDZ THESE DAYS", url: "#" },
  { icon: "▶", label: "YouTube", value: "KIDZ THESE DAYS", url: "#" },
];

export function Contact() {
  const [inquiry, setInquiry] = useState<InquiryType>("Booking");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("inquiry_type", inquiry);
    // Formspree placeholder — replace NEXT_PUBLIC_FORMSPREE_ID in .env.local
    const id = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "placeholder";
    await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    }).catch(() => {});
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-navy py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>Connect</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Let's Make
            <br />
            <span className="text-amber">Something.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 md:grid-cols-2">
          {/* Left — form */}
          <Reveal delay={120}>
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-amber/30 bg-[var(--amber-faint)] p-10 text-center">
                <span className="text-4xl">✓</span>
                <p className="font-display text-2xl text-white">Message Sent.</p>
                <p className="font-serif text-sm text-gray">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Inquiry type pills */}
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-amber/60">
                    Inquiry Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInquiry(type)}
                        className={`rounded-full border px-4 py-1.5 font-sans text-sm transition-all ${
                          inquiry === type
                            ? "border-amber bg-amber/10 text-amber"
                            : "border-[var(--border)] text-gray hover:border-amber/40"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-amber/60">Name</label>
                    <input id="name" name="name" required type="text"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--navy-mid)] px-4 py-3 font-sans text-sm text-white placeholder-gray-dim outline-none focus:border-amber/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-amber/60">Email</label>
                    <input id="email" name="email" required type="email"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--navy-mid)] px-4 py-3 font-sans text-sm text-white placeholder-gray-dim outline-none focus:border-amber/50"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-amber/60">Message</label>
                  <textarea id="message" name="message" required rows={5}
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--navy-mid)] px-4 py-3 font-sans text-sm text-white placeholder-gray-dim outline-none focus:border-amber/50"
                    placeholder="What's on your mind?"
                  />
                </div>

                <button
                  type="submit"
                  className="self-start rounded-full bg-amber px-8 py-3 font-sans text-sm font-medium text-black transition-colors hover:bg-amber-glow"
                >
                  Send Message →
                </button>
              </form>
            )}
          </Reveal>

          {/* Right — direct links + EPK */}
          <Reveal delay={180}>
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-amber/60">
                  Direct Links
                </p>
                <ul className="flex flex-col gap-1">
                  {directLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        className="group flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[var(--border)] hover:bg-[var(--navy-soft)]"
                      >
                        <span className="text-xl">{link.icon}</span>
                        <div>
                          <p className="font-sans text-xs text-gray-dim">{link.label}</p>
                          <p className="font-sans text-sm font-medium text-white group-hover:text-amber transition-colors">
                            {link.value}
                          </p>
                        </div>
                        <span className="ml-auto font-mono text-xs text-gray-dim group-hover:text-amber transition-colors">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EPK download */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--navy-soft)] p-6">
                <p className="font-sans text-sm font-semibold text-white">
                  Electronic Press Kit
                </p>
                <p className="mt-1 font-serif text-xs leading-relaxed text-gray">
                  Bio, photos, press quotes, streaming stats, and booking info —
                  all in one document.
                </p>
                {/* TODO: replace href with real EPK PDF path in /public/ktd-epk.pdf */}
                <a
                  href="/ktd-epk.pdf"
                  className="mt-4 inline-block rounded-full border border-amber px-5 py-2.5 font-sans text-sm text-amber transition-all hover:bg-amber hover:text-black"
                >
                  Download Electronic Press Kit (EPK)
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
