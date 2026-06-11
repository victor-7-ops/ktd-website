import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

interface Platform {
  icon: string;
  name: string;
  handle: string;
  desc: string;
  url: string | null;
  cta: string;
  disabled?: boolean;
}

const platforms: Platform[] = [
  { icon: "📸", name: "Instagram", handle: "@kidzthesedaysofficial", desc: "Photos, stories, and behind-the-scenes.", url: "https://instagram.com/kidzthesedaysofficial", cta: "Follow" },
  { icon: "🎵", name: "Spotify", handle: "KIDZ THESE DAYS", desc: "Stream all releases. Save for new music alerts.", url: null, cta: "Link coming soon", disabled: true },
  { icon: "▶", name: "YouTube", handle: "KIDZ THESE DAYS", desc: "Music videos, lyric videos, live performances.", url: null, cta: "Link coming soon", disabled: true },
  { icon: "🎵", name: "Apple Music", handle: "KIDZ THESE DAYS", desc: "All releases on Apple Music.", url: null, cta: "Link coming soon", disabled: true },
  { icon: "🎵", name: "TikTok", handle: "Coming Soon", desc: "Short-form content on the way.", url: null, cta: "Coming Soon", disabled: true },
  { icon: "👥", name: "Facebook", handle: "KIDZ THESE DAYS", desc: "Event updates, show announcements, community.", url: null, cta: "Link coming soon", disabled: true },
];

export function Social() {
  return (
    <section id="social" className="bg-black py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>Stay Connected</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Follow the Story
            <br />
            <span className="text-amber">Everywhere.</span>
          </h2>
        </Reveal>

        {/* Platform cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p, i) => (
            <Reveal key={p.name} delay={i * 50}>
              <div className={`flex h-full flex-col gap-3 rounded-2xl border p-6 transition-colors ${p.disabled ? "border-[var(--border)] opacity-40" : "border-[var(--border)] hover:border-amber/30"} bg-[var(--navy-soft)]`}>
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-white">{p.name}</p>
                  <p className="font-mono text-[10px] text-amber/70">{p.handle}</p>
                </div>
                <p className="font-serif text-sm text-gray">{p.desc}</p>
                {p.disabled || !p.url ? (
                  <span
                    className="mt-auto inline-block rounded-full border border-[var(--border)] px-4 py-2 font-sans text-xs text-gray-dim"
                  >
                    {p.cta}
                  </span>
                ) : (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-block rounded-full border border-amber px-4 py-2 font-sans text-xs text-amber transition-all hover:bg-amber hover:text-black"
                  >
                    {p.cta}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Newsletter block */}
        <Reveal delay={200}>
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--navy-soft)] p-10 md:p-14">
            {/* Amber corner glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber/10 blur-[80px]" />
            <div className="relative max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-widest text-amber/60">
                Inner Circle
              </p>
              <h3 className="mt-3 font-display text-4xl tracking-wide text-white">
                Be the First to Know.
              </h3>
              <p className="mt-3 font-serif text-sm leading-relaxed text-gray">
                New music. Merch drops. Show dates. No algorithm in the way —
                straight to your inbox.
              </p>
              {/* Mailchimp placeholder — replace action URL with real Mailchimp embed URL */}
              <form
                action={process.env.NEXT_PUBLIC_MAILCHIMP_URL ?? "#"}
                method="post"
                target="_blank"
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  name="EMAIL"
                  required
                  placeholder="your@email.com"
                  className="flex-1 rounded-full border border-[var(--border)] bg-[var(--navy-mid)] px-5 py-3 font-sans text-sm text-white placeholder-gray-dim outline-none focus:border-amber/50"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-amber px-6 py-3 font-sans text-sm font-medium text-black transition-colors hover:bg-amber-glow"
                >
                  Join the Inner Circle
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
