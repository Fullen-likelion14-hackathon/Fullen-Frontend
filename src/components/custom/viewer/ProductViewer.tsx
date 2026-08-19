import { useRef } from "react";

import { Canvas } from "@react-three/fiber";

import { Environment, OrbitControls } from "@react-three/drei";

import { Product } from "./Product";
import { FloatingShadow } from "./FloatingShadow";

import type { ProductMode } from "./Product";
import type { PatchLocation } from "@/types/patchLocation";

import { useBagCustomStore } from "@/stores/bagCustomStore";

// 카메라 기본 거리임
const DEFAULT_DISTANCE = 7;

// 패치 최소 크기임
const MIN_PATCH_SCALE = 0.25;

// 패치 최대 크기임
const MAX_PATCH_SCALE = 1.2;

// ProductViewer에서 사용할 props 타입임
interface ProductViewerProps {
  // 현재 가방 화면 동작 모드임
  mode?: ProductMode;

  // 위치 선택 모드에서 선택한 위치 전달 함수임
  onLocationChange?: (location: PatchLocation) => void;
}

// 포인터 좌표 타입임
interface PointerPosition {
  // 화면 기준 X좌표임
  x: number;

  // 화면 기준 Y좌표임
  y: number;
}

// 두 포인터 사이 거리 계산 함수임
const getPointerDistance = (first: PointerPosition, second: PointerPosition) => {
  const dx = second.x - first.x;

  const dy = second.y - first.y;

  return Math.sqrt(dx * dx + dy * dy);
};

export function ProductViewer({ mode = "view", onLocationChange }: ProductViewerProps) {
  // 현재 화면을 누르고 있는 포인터 목록임
  const activePointersRef = useRef(new Map<number, PointerPosition>());

  // 이전 두 포인터 사이 거리임
  const previousPinchDistanceRef = useRef<number | null>(null);

  // 현재 패치 편집 중 여부임
  const isEditingPatch = useBagCustomStore((state) => state.isEditingPatch);

  // 현재 선택된 가방 위 패치 id임
  const selectedPlacedPatchId = useBagCustomStore((state) => state.selectedPlacedPatchId);

  // 현재 편집 중인 패치 목록임
  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  // 패치 크기 변경 함수임
  const resizeDraftPatch = useBagCustomStore((state) => state.resizeDraftPatch);

  // 패치 편집 상태 변경 함수임
  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  // 포인터 시작 처리함
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // 패치 편집 모드가 아니면 pinch 기능 사용하지 않음
    if (mode !== "draft") {
      return;
    }

    // 현재 포인터 좌표 저장함
    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    // 두 손가락 이상이면 pinch 시작함
    if (activePointersRef.current.size >= 2) {
      const pointers = Array.from(activePointersRef.current.values());

      previousPinchDistanceRef.current = getPointerDistance(pointers[0], pointers[1]);

      // 카메라 회전 및 확대 잠금용 상태임
      setIsEditingPatch(true);
    }
  };

  // 포인터 이동 처리함
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // 패치 편집 모드에서만 pinch 동작함
    if (mode !== "draft") {
      return;
    }

    // 현재 관리 중인 포인터가 아닌 경우 제외함
    if (!activePointersRef.current.has(event.pointerId)) {
      return;
    }

    // 현재 포인터 위치 갱신함
    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    // 선택된 패치가 없으면 크기 조절하지 않음
    if (!selectedPlacedPatchId) {
      return;
    }

    // 두 손가락 미만이면 pinch 처리하지 않음
    if (activePointersRef.current.size < 2) {
      return;
    }

    const pointers = Array.from(activePointersRef.current.values());

    // 현재 두 손가락 사이 거리임
    const currentDistance = getPointerDistance(pointers[0], pointers[1]);

    const previousDistance = previousPinchDistanceRef.current;

    // 이전 거리 없는 경우 기준값만 저장함
    if (!previousDistance) {
      previousPinchDistanceRef.current = currentDistance;

      return;
    }

    // 현재 선택 패치 찾음
    const selectedPatch = draftPatches.find((patch) => patch.id === selectedPlacedPatchId);

    if (!selectedPatch) {
      return;
    }

    // 이전 거리 대비 현재 거리 비율임
    const ratio = currentDistance / previousDistance;

    // 패치 최대 / 최소 크기 범위 제한함
    const nextScale = Math.min(
      MAX_PATCH_SCALE,
      Math.max(MIN_PATCH_SCALE, selectedPatch.scale * ratio),
    );

    // 선택 패치 크기 변경함
    resizeDraftPatch(selectedPatch.id, nextScale);

    // 다음 이동 계산용 현재 거리 저장함
    previousPinchDistanceRef.current = currentDistance;
  };

  // 포인터 종료 처리함
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    // 관리 중인 포인터 목록에서 제거함
    activePointersRef.current.delete(event.pointerId);

    // 두 손가락 미만이면 pinch 종료함
    if (activePointersRef.current.size < 2) {
      previousPinchDistanceRef.current = null;

      // 패치 편집 상태 종료함
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

      // draft 모드에서 pinch 제어용 포인터 이벤트임
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

        {/* 실제 3D 가방 렌더링임 */}
        {/* view / location-select / draft / applied 전체 모드 지원함 */}
        <Product mode={mode} onLocationChange={onLocationChange} />

        {/* 가방 아래 가짜 그림자임 */}
        <FloatingShadow />

        {/* GLB 환경광임 */}
        <Environment preset="studio" environmentIntensity={0.3} />

        {/* 가방 카메라 조작 영역임 */}
        <OrbitControls
          makeDefault
          enablePan={false}

          // 패치 위치 / 크기 편집 중 카메라 회전 막음
          enableRotate={!isEditingPatch}

          // 패치 위치 / 크기 편집 중 카메라 확대 막음
          enableZoom={!isEditingPatch}

          // 가방 중심점임
          target={[0, 1.5, 0]}

          // 카메라 최소 거리임
          minDistance={4}

          // 카메라 최대 거리임
          maxDistance={DEFAULT_DISTANCE}

          // 위쪽 회전 범위임
          minPolarAngle={0.15}

          // 아래쪽 회전 범위임
          maxPolarAngle={Math.PI - 0.15}

          // 부드러운 카메라 움직임임
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
