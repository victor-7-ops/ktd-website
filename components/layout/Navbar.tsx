"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "Story", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "Achievements", href: "#achievements" },
  { label: "Merch", href: "#merch" },
  { label: "Shows", href: "#shows" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[rgba(10,10,15,0.85)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-3xl leading-none tracking-wide text-amber"
        >
          KTD
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-sans text-sm font-light text-white/80 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-amber transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-full bg-amber px-5 py-2 font-sans text-sm font-medium text-black transition-colors hover:bg-amber-glow"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-white transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-white transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-white transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 top-[64px] z-40 flex flex-col items-center gap-6 bg-[rgba(10,10,15,0.97)] pt-16 backdrop-blur-xl md:hidden">
          {[...LINKS, { label: "Contact", href: "#contact" }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl tracking-wide text-white/90 hover:text-amber"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
