import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type FloatingShadowProps = {
  isCustomizing: boolean;
};

export function FloatingShadow({ isCustomizing }: FloatingShadowProps) {
  const shadowRef = useRef<THREE.Mesh>(null);

  const shadowTexture = useMemo(() => {
    const size = 512;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);

    // 중앙만 살짝 진하고
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.4)");

    // 빠르게 부드러워지게
    gradient.addColorStop(0.25, "rgba(0, 0, 0, 0.2)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.1)");
    gradient.addColorStop(0.75, "rgba(0, 0, 0, 0.01)");

    // 가장자리 완전 투명
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }, []);

  useFrame(() => {
    if (!shadowRef.current) return;

    // 기본 그림자 위치 0.7
    // 커스터마이징 시 조금 위로 이동
    const targetY = isCustomizing ? 1.2 : 0.7;

    shadowRef.current.position.y = THREE.MathUtils.lerp(
      shadowRef.current.position.y,
      targetY,
      0.05,
    );
  });

  if (!shadowTexture) return null;

  return (
    <mesh
      ref={shadowRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.7, 0]}
      scale={[3.0, 1.5, 1]}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} opacity={1} />
    </mesh>
  );
}
