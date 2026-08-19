import * as THREE from "three";

import { useEffect, useRef } from "react";

import { Line } from "@react-three/drei";

import { useBagCustomStore, type PlacedPatch } from "@/stores/bagCustomStore";

interface PatchSelectionFrameProps {
  // 현재 선택된 가방 위 패치임
  patch: PlacedPatch;

  // 가방 표면 기준 패치 회전값임
  rotation: THREE.Euler;
}

// 패치 최소 크기임
const MIN_PATCH_SCALE = 0.25;

// 패치 최대 크기임
const MAX_PATCH_SCALE = 1.2;

const PatchSelectionFrame = ({ patch, rotation }: PatchSelectionFrameProps) => {
  // 리사이즈 시작 화면 좌표임
  const resizeStartRef = useRef<{
    x: number;
    y: number;
    scale: number;
  } | null>(null);

  // 패치 크기 변경 함수임
  const resizeDraftPatch = useBagCustomStore((state) => state.resizeDraftPatch);

  // 패치 편집 상태 변경 함수임
  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  // 패치 선택 프레임 반지름임
  const half = patch.scale / 2 + 0.05;

  // 흰색 프레임 좌표임
  const framePoints: [number, number, number][] = [
    [-half, half, 0.02],
    [half, half, 0.02],
    [half, -half, 0.02],
    [-half, -half, 0.02],
    [-half, half, 0.02],
  ];

  // 모서리 리사이즈 시작함
  const handleResizeStart = (event: { stopPropagation: () => void; nativeEvent: PointerEvent }) => {
    event.stopPropagation();

    const nativeEvent = event.nativeEvent;

    resizeStartRef.current = {
      x: nativeEvent.clientX,
      y: nativeEvent.clientY,
      scale: patch.scale,
    };

    setIsEditingPatch(true);
  };

  // 화면 pointer 이동 기준으로 패치 크기 변경함
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const start = resizeStartRef.current;

      if (!start) return;

      // 시작점 대비 드래그 거리임
      const deltaX = event.clientX - start.x;

      const deltaY = event.clientY - start.y;

      // 대각선 이동량 기준 크기 변화량임
      const delta = (deltaX - deltaY) / 250;

      const nextScale = THREE.MathUtils.clamp(
        start.scale + delta,
        MIN_PATCH_SCALE,
        MAX_PATCH_SCALE,
      );

      resizeDraftPatch(patch.id, nextScale);
    };

    const handlePointerUp = () => {
      if (!resizeStartRef.current) {
        return;
      }

      resizeStartRef.current = null;

      setIsEditingPatch(false);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [patch.id, resizeDraftPatch, setIsEditingPatch]);

  if (!patch.position) {
    return null;
  }

  return (
    <group position={patch.position} rotation={rotation}>
      {/* 현재 편집 중인 패치 흰색 외곽선임 */}
      <Line points={framePoints} color="#FFFFFF" lineWidth={2} />

      {/* 왼쪽 위 리사이즈 영역임 */}
      <mesh position={[-half, half, 0.03]} onPointerDown={handleResizeStart}>
        <circleGeometry args={[0.08, 16]} />

        <meshBasicMaterial transparent opacity={0.01} />
      </mesh>

      {/* 오른쪽 위 리사이즈 영역임 */}
      <mesh position={[half, half, 0.03]} onPointerDown={handleResizeStart}>
        <circleGeometry args={[0.08, 16]} />

        <meshBasicMaterial transparent opacity={0.01} />
      </mesh>

      {/* 왼쪽 아래 리사이즈 영역임 */}
      <mesh position={[-half, -half, 0.03]} onPointerDown={handleResizeStart}>
        <circleGeometry args={[0.08, 16]} />

        <meshBasicMaterial transparent opacity={0.01} />
      </mesh>

      {/* 오른쪽 아래 리사이즈 영역임 */}
      <mesh position={[half, -half, 0.03]} onPointerDown={handleResizeStart}>
        <circleGeometry args={[0.08, 16]} />

        <meshBasicMaterial transparent opacity={0.01} />
      </mesh>
    </group>
  );
};

export default PatchSelectionFrame;
