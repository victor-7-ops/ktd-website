import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { merch } from "@/lib/data/merch";

export function Merch() {
  return (
    <section id="merch" className="bg-navy py-28 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>Merch</SectionLabel>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="mt-4 font-display leading-[0.9] tracking-wide text-white"
            style={{ fontSize: "var(--text-display)" }}
          >
            Wear
            <br />
            <span className="text-amber">the Story.</span>
          </h2>
        </Reveal>
        <Reveal delay={110}>
          <p className="mt-3 font-sans text-sm text-gray-dim">
            Limited drops. Cebu-made. 100% KTD.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {merch.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <TiltCard className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--navy-soft)]">
                  {/* Product image placeholder */}
                  <div className="relative flex h-52 items-center justify-center bg-[var(--navy-mid)]">
                    <span className="font-display text-5xl text-amber/10">KTD</span>
                    {item.limited && (
                      <span className="absolute right-3 top-3 rounded-full bg-amber px-3 py-0.5 font-mono text-[9px] uppercase tracking-widest text-black">
                        Limited
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber/60">
                      {item.type}
                    </span>
                    <h3 className="font-sans text-base font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="font-serif text-sm leading-relaxed text-gray">
                      {item.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-mono text-lg text-amber">{item.price}</span>
                      {/* TODO: swap to Big Cartel product URL or Shopify storefront link when commerce is wired */}
                      <span className="rounded-full border border-[var(--border)] px-4 py-1.5 font-sans text-xs text-gray-dim">
                        Shop opening soon
                      </span>
                    </div>
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
