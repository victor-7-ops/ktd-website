"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

type GeoKind = "icosahedron" | "torus" | "octahedron";

interface Shape {
  kind: GeoKind;
  position: [number, number, number];
  scale: number;
  rotSpeed: [number, number];
}

// Minimal, faint: a ring reading as a circle (upper right) and a diamond
// (octahedron) below it. Calm, slow, low-contrast — lots of negative space.
const SHAPES: Shape[] = [
  { kind: "torus", position: [4.2, 1.8, -3], scale: 1.6, rotSpeed: [0.05, 0.06] },
  { kind: "octahedron", position: [3.8, -1.6, -3], scale: 1.1, rotSpeed: [0.06, 0.05] },
];

function GeoMesh({ kind }: { kind: GeoKind }) {
  // Thin, faint amber outline — no solid body. Reads as a clean wireframe
  // circle / diamond against the dark frame.
  return (
    <mesh>
      {kind === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {kind === "torus" && <torusGeometry args={[0.85, 0.02, 8, 64]} />}
      {kind === "octahedron" && <octahedronGeometry args={[1, 0]} />}
      <meshBasicMaterial color="#E8A838" wireframe transparent opacity={0.28} />
    </mesh>
  );
}

function FloatingShape({ shape }: { shape: Shape }) {
  const ref = useRef<Group>(null);
  const seed = useRef(Math.random() * 100);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);
    g.rotation.x += shape.rotSpeed[0] * d;
    g.rotation.y += shape.rotSpeed[1] * d;
    // gentle vertical bob
    g.position.y =
      shape.position[1] + Math.sin(state.clock.elapsedTime * 0.4 + seed.current) * 0.3;
  });

  return (
    <group ref={ref} position={shape.position} scale={shape.scale}>
      <GeoMesh kind={shape.kind} />
    </group>
  );
}

export function FloatingGeo() {
  return (
    <>
      {SHAPES.map((s, i) => (
        <FloatingShape key={i} shape={s} />
      ))}
    </>
  );
}
