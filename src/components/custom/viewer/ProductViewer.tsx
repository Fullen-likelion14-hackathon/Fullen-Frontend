import { useRef } from "react";

import { Canvas } from "@react-three/fiber";

import { Environment, OrbitControls } from "@react-three/drei";

import { Product } from "./Product";
import { FloatingShadow } from "./FloatingShadow";

import { useBagCustomStore } from "@/stores/bagCustomStore";

// 카메라 기본 거리임
const DEFAULT_DISTANCE = 7;

// 패치 최소 크기임
const MIN_PATCH_SCALE = 0.25;

// 패치 최대 크기임
const MAX_PATCH_SCALE = 1.2;

interface ProductViewerProps {
  // 편집 화면 또는 적용 화면 구분값임
  mode?: "draft" | "applied";
}

// 포인터 좌표 타입임
interface PointerPosition {
  x: number;
  y: number;
}

// 두 포인터 거리 계산 함수임
const getPointerDistance = (first: PointerPosition, second: PointerPosition) => {
  const dx = second.x - first.x;

  const dy = second.y - first.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export function ProductViewer({ mode = "draft" }: ProductViewerProps) {
  // 현재 눌린 포인터 목록임
  const activePointersRef = useRef(new Map<number, PointerPosition>());

  // 이전 pinch 거리임
  const previousPinchDistanceRef = useRef<number | null>(null);

  // 현재 패치 편집 상태임
  const isEditingPatch = useBagCustomStore((state) => state.isEditingPatch);

  // 현재 선택 패치 id임
  const selectedPlacedPatchId = useBagCustomStore((state) => state.selectedPlacedPatchId);

  // 현재 편집 패치 목록임
  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  // 패치 크기 변경 함수임
  const resizeDraftPatch = useBagCustomStore((state) => state.resizeDraftPatch);

  // 패치 편집 여부 변경 함수임
  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  // 포인터 시작 처리함
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "draft") {
      return;
    }

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    // 두 손가락 이상이면 pinch 시작함
    if (activePointersRef.current.size >= 2) {
      const pointers = Array.from(activePointersRef.current.values());

      previousPinchDistanceRef.current = getPointerDistance(pointers[0], pointers[1]);

      setIsEditingPatch(true);
    }
  };

  // 포인터 이동 처리함
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== "draft") {
      return;
    }

    if (!activePointersRef.current.has(event.pointerId)) {
      return;
    }

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    // 선택된 패치 없으면 pinch 처리하지 않음
    if (!selectedPlacedPatchId) {
      return;
    }

    if (activePointersRef.current.size < 2) {
      return;
    }

    const pointers = Array.from(activePointersRef.current.values());

    const currentDistance = getPointerDistance(pointers[0], pointers[1]);

    const previousDistance = previousPinchDistanceRef.current;

    if (!previousDistance) {
      previousPinchDistanceRef.current = currentDistance;

      return;
    }

    const selectedPatch = draftPatches.find((patch) => patch.id === selectedPlacedPatchId);

    if (!selectedPatch) {
      return;
    }

    // 이전 손가락 거리 대비 현재 거리 비율임
    const ratio = currentDistance / previousDistance;

    const nextScale = Math.min(
      MAX_PATCH_SCALE,
      Math.max(MIN_PATCH_SCALE, selectedPatch.scale * ratio),
    );

    resizeDraftPatch(selectedPatch.id, nextScale);

    previousPinchDistanceRef.current = currentDistance;
  };

  // 포인터 종료 처리함
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(event.pointerId);

    if (activePointersRef.current.size < 2) {
      previousPinchDistanceRef.current = null;

      setIsEditingPatch(false);
    }
  };

  return (
    <div
      className="
        absolute
        inset-0
        touch-none
      "
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        camera={{
          position: [0, 1.5, DEFAULT_DISTANCE],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
      >
        {/* 가방 조명임 */}
        <directionalLight position={[4, 6, 5]} intensity={1.5} />

        {/* 실제 가방과 패치임 */}
        <Product mode={mode} />

        {/* 가방 아래 가짜 그림자임 */}
        <FloatingShadow />

        {/* 환경광임 */}
        <Environment preset="studio" environmentIntensity={0.3} />

        {/* 가방 카메라 조작임 */}
        <OrbitControls
          makeDefault
          enablePan={false}

          // 패치 편집 중 카메라 회전 막음
          enableRotate={!isEditingPatch}

          // 패치 편집 중 카메라 확대 막음
          enableZoom={!isEditingPatch}

          target={[0, 1.5, 0]}
          minDistance={4}
          maxDistance={DEFAULT_DISTANCE}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI - 0.15}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
