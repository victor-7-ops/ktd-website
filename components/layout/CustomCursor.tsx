"use client";

import { useEffect, useRef } from "react";

/**
 * Amber dot (12px) + lagging ring (36px, eased follow).
 * Dot scales 2.5x over interactive elements; ring fades out.
 * Disabled on touch / coarse-pointer devices and when reduced motion is set.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      const interactive = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor]"
      );
      dot.dataset.hover = interactive ? "true" : "false";
      ring.dataset.hover = interactive ? "true" : "false";
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1001] h-3 w-3 rounded-full bg-amber transition-[scale,opacity] duration-200 data-[hover=true]:scale-[2.5] mix-blend-screen max-[1px]:hidden"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1001] h-9 w-9 rounded-full border border-amber/60 transition-opacity duration-200 data-[hover=true]:opacity-0"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
