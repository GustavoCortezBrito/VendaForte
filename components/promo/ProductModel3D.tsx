"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, MathUtils, Vector3, type Group } from "three";
import type { MotionValue } from "framer-motion";

export const DS3_MODEL_URL = "/promo/ds3.glb";

/** Altura do modelo em unidades de cena, depois de normalizado. */
const MODEL_HEIGHT = 3.2;
/** Ângulo de repouso: três quartos, mostrando o timão e a lateral. */
const REST_ANGLE = -Math.PI / 5;

interface ProductModel3DProps {
  /** Progresso do scroll do palco, de 0 a 1. Uma volta completa ao longo dele. */
  progress?: MotionValue<number>;
  onLoaded?: () => void;
  className?: string;
}

function DS3({ progress, onLoaded }: Pick<ProductModel3DProps, "progress" | "onLoaded">) {
  const { scene } = useGLTF(DS3_MODEL_URL);
  const pivot = useRef<Group>(null);

  // O GLB chega com escala e origem arbitrárias. Normaliza pela altura e apoia
  // a base no chão, centrado no eixo de giro.
  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    return {
      scale: MODEL_HEIGHT / size.y,
      offset: new Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [scene]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  useFrame((state, delta) => {
    const group = pivot.current;
    if (!group) return;
    const scroll = progress?.get() ?? 0;
    const sway = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    const target = REST_ANGLE + scroll * Math.PI * 2 + sway;
    group.rotation.y = MathUtils.damp(group.rotation.y, target, 4, delta);
  });

  return (
    <group ref={pivot} position={[0, -MODEL_HEIGHT / 2, 0]}>
      <group scale={scale}>
        <primitive object={scene} position={offset} />
      </group>
    </group>
  );
}

export default function ProductModel3D({ progress, onLoaded, className }: ProductModel3DProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 7.5], fov: 30 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />

      {/* Estúdio montado com painéis de luz locais, sem HDR baixado de CDN */}
      <Environment resolution={256}>
        <Lightformer intensity={2} position={[0, 5, -2]} scale={[10, 5, 1]} />
        <Lightformer
          intensity={3}
          color="#ff6a1a"
          position={[-5, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[6, 3, 1]}
        />
        <Lightformer
          intensity={1.5}
          position={[5, 1, 2]}
          rotation-y={-Math.PI / 2}
          scale={[6, 3, 1]}
        />
      </Environment>

      <Suspense fallback={null}>
        <DS3 progress={progress} onLoaded={onLoaded} />
      </Suspense>

      <ContactShadows
        position={[0, -MODEL_HEIGHT / 2, 0]}
        opacity={0.55}
        scale={6}
        blur={2.4}
        far={2}
        color="#000000"
      />
    </Canvas>
  );
}
