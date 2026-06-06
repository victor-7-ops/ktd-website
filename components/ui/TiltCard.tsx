"use client";

import { useRef, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * CSS 3D tilt on pointer move — no WebGL context needed.
 * Max ±12° rotation, amber glow deepens with tilt, snaps back on leave.
 */
export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 24}deg) rotateX(${-y * 16}deg) scale(1.02)`;
    el.style.boxShadow = `${-x * 18}px ${y * 12}px 40px rgba(232,168,56,${0.08 + Math.abs(x) * 0.12})`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "none";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`transition-[transform,box-shadow] duration-100 ease-out will-change-transform hover:duration-75 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
