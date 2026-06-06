const footerLinks = ["Story", "Music", "Achievements", "Merch", "Shows", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-amber/20 bg-black px-6 py-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Top row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <p className="font-display text-5xl tracking-wide text-amber md:text-6xl">
              KIDZ THESE DAYS
            </p>
            <p className="mt-2 font-serif text-sm italic text-gray">
              "We aim to flip that script."
            </p>
          </div>

          {/* Footer nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="font-sans text-sm text-gray-dim transition-colors hover:text-amber"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-[var(--border)]" />

        {/* Bottom row */}
        <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-dim md:flex-row md:items-center md:justify-between">
          <p>
            Signed to{" "}
            <span className="text-amber">Unstable Records</span>
            {" · "}Distributed by{" "}
            <span className="text-amber">Viva Records</span>
            {" & "}
            <span className="text-amber">Universal Music PH</span>
          </p>
          <p>Cebu City, Philippines · Est. November 2022</p>
          <p>© 2026 KIDZ THESE DAYS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
