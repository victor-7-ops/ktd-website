"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
}

/**
 * Amber dust drifting slowly upward, like motes caught in a spotlight.
 * Recycles particles to the bottom when they rise past the top.
 */
export function Particles({ count = 1200 }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14; // z
      speeds[i] = 0.15 + Math.random() * 0.4;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const d = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * d;
      // gentle horizontal noise drift
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.5 + i) * 0.002;
      if (arr[i * 3 + 1] > 9) {
        arr[i * 3 + 1] = -9;
        arr[i * 3] = (Math.random() - 0.5) * 26;
      }
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#E8A838"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
