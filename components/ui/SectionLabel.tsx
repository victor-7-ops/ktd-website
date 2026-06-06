interface SectionLabelProps {
  children: React.ReactNode;
}

/** Mono eyebrow label with a leading amber rule. */
export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-amber">
      <span className="h-px w-8 bg-amber/60" aria-hidden="true" />
      {children}
    </span>
  );
}
