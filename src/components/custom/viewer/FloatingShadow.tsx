import * as THREE from "three";
import { useMemo } from "react";

export function FloatingShadow() {
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
    gradient.addColorStop(0.25, "rgba(0, 0, 0, 0.3)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
    gradient.addColorStop(0.75, "rgba(0, 0, 0, 0.05)");

    // 가장자리 완전 투명
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }, []);

  if (!shadowTexture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.8, 0]} scale={[2.3, 3, 1]}>
      <planeGeometry args={[1, 1]} /> rotation={[-Math.PI / 2, 0, 0]}
      <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} opacity={1} />
    </mesh>
  );
}
