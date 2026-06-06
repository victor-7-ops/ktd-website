"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Particles } from "./Particles";
import { FloatingGeo } from "./FloatingGeo";

/** Lerps the camera gently toward the cursor for a parallax feel. */
function RigCamera() {
  const { pointer, camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    // max ~6deg offset
    target.current.set(pointer.x * 1.2, pointer.y * 0.8, 8);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface HeroSceneProps {
  particleCount?: number;
}

export default function HeroScene({ particleCount = 1200 }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <fog attach="fog" args={["#0D1117", 6, 20]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#F5C96A" />
      <pointLight position={[-5, -3, 2]} intensity={15} color="#E8A838" />

      <Suspense fallback={null}>
        <Particles count={particleCount} />
        <FloatingGeo />
      </Suspense>

      <RigCamera />

      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
