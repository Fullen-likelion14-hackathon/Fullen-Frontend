// 제품 3D 렌더링 컴포넌트
import * as THREE from "three";

import { useEffect, useState } from "react";

import { createPortal, type ThreeEvent } from "@react-three/fiber";

import { Html, useGLTF } from "@react-three/drei";

import bagUrl from "@/assets/models/OttomarBag.glb";

import BagPatchDecal from "@/components/custom/viewer/BagPatchDecal";
import BagInitialDecal from "@/components/custom/viewer/BagInitialDecal";

import { useBagCustomStore } from "@/stores/bagCustomStore";

import type { PatchLocation } from "@/types/patchLocation";

// Product 전체 모드 타입
export type ProductMode = "view" | "location-select" | "draft" | "applied";

// 가방 꾸미기 종류 타입
export type ProductCustomMode = "patch" | "initial";

interface ProductProps {
  // 현재 Product 동작 모드
  mode?: ProductMode;

  // 현재 편집 커스텀 종류
  customMode?: ProductCustomMode;

  // 위치 선택 결과 전달 함수
  onLocationChange?: (location: PatchLocation) => void;
}

// FRONT 몸통 X 최소 범위
const FRONT_MIN_X = -0.677;

// FRONT 몸통 X 최대 범위
const FRONT_MAX_X = 0.657;

// FRONT 몸통 Y 최소 범위
const FRONT_MIN_Y = -0.667;

// FRONT 몸통 Y 최대 범위
const FRONT_MAX_Y = 0.129;

// BACK 몸통 X 최소 범위
const BACK_MIN_X = -0.639;

// BACK 몸통 X 최대 범위
const BACK_MAX_X = 0.683;

// BACK 몸통 Y 최소 범위
const BACK_MIN_Y = -0.574;

// BACK 몸통 Y 최대 범위
const BACK_MAX_Y = 0.121;

export function Product({ mode = "view", customMode = "patch", onLocationChange }: ProductProps) {
  // GLB 전체 Scene
  const { scene } = useGLTF(bagUrl);

  // 패치 및 이니셜 적용 가방 Mesh
  const [bagMesh, setBagMesh] = useState<THREE.Mesh | null>(null);

  // 위치 선택 프레임 위치
  const [markerPosition, setMarkerPosition] = useState<[number, number, number] | null>(null);

  // 이동 중 패치 id
  const [draggingPatchId, setDraggingPatchId] = useState<string | null>(null);

  // 이동 중 이니셜 id
  const [draggingInitialId, setDraggingInitialId] = useState<string | null>(null);

  // 현재 편집 패치 목록
  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  // 적용 완료 패치 목록
  const appliedPatches = useBagCustomStore((state) => state.appliedPatches);

  // 현재 편집 이니셜 목록
  const draftInitials = useBagCustomStore((state) => state.draftInitials);

  // 적용 완료 이니셜 목록
  const appliedInitials = useBagCustomStore((state) => state.appliedInitials);

  // 패치 위치 변경 함수
  const moveDraftPatch = useBagCustomStore((state) => state.moveDraftPatch);

  // 이니셜 위치 변경 함수
  const moveDraftInitial = useBagCustomStore((state) => state.moveDraftInitial);

  // 패치 선택 함수
  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  // 이니셜 선택 함수
  const selectPlacedInitial = useBagCustomStore((state) => state.selectPlacedInitial);

  // 패치 편집 상태 변경 함수
  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  // 이니셜 편집 상태 변경 함수
  const setIsEditingInitial = useBagCustomStore((state) => state.setIsEditingInitial);

  // 현재 표시 패치 목록
  const visiblePatches = mode === "draft" ? draftPatches : mode === "applied" ? appliedPatches : [];

  // 현재 표시 이니셜 목록
  const visibleInitials =
    mode === "draft" ? draftInitials : mode === "applied" ? appliedInitials : [];

  // 실제 가방 Mesh 탐색
  useEffect(() => {
    const targetMesh = scene.getObjectByName("mesh_0");

    if (!(targetMesh instanceof THREE.Mesh)) {
      console.warn("가방 mesh_0을 찾지 못함");

      return;
    }

    setBagMesh(targetMesh);
  }, [scene]);

  // GLB 전체 재질 설정
  useEffect(() => {
    scene.traverse((object: THREE.Object3D) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      object.castShadow = false;

      object.receiveShadow = false;

      const material = object.material;

      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        material.envMapIntensity = 0.5;

        material.needsUpdate = true;
      }
    });
  }, [scene]);

  // 신규 패치 최초 위치 설정
  useEffect(() => {
    if (mode !== "draft" || customMode !== "patch") {
      return;
    }

    if (!bagMesh) {
      return;
    }

    const geometry = bagMesh.geometry;

    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    const box = geometry.boundingBox;

    if (!box) {
      return;
    }

    const center = new THREE.Vector3();

    box.getCenter(center);

    const initialPosition: [number, number, number] = [center.x, center.y, box.max.z];

    const initialNormal: [number, number, number] = [0, 0, 1];

    draftPatches.forEach((patch) => {
      if (patch.position !== null) {
        return;
      }

      moveDraftPatch(patch.id, initialPosition, initialNormal, "FRONT", 0.5, 0.5);
    });
  }, [bagMesh, customMode, draftPatches, mode, moveDraftPatch]);

  // 신규 이니셜 최초 위치 설정
  useEffect(() => {
    if (mode !== "draft" || customMode !== "initial") {
      return;
    }

    if (!bagMesh) {
      return;
    }

    const geometry = bagMesh.geometry;

    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    const box = geometry.boundingBox;

    if (!box) {
      return;
    }

    const center = new THREE.Vector3();

    box.getCenter(center);

    const initialPosition: [number, number, number] = [center.x, center.y, box.max.z];

    const initialNormal: [number, number, number] = [0, 0, 1];

    draftInitials.forEach((initial) => {
      if (initial.position !== null) {
        return;
      }

      moveDraftInitial(initial.id, initialPosition, initialNormal);
    });
  }, [bagMesh, customMode, draftInitials, mode, moveDraftInitial]);

  // 패치 이동 시작
  const handlePatchDragStart = (patchId: string) => {
    if (mode !== "draft" || customMode !== "patch") {
      return;
    }

    setDraggingPatchId(patchId);

    setDraggingInitialId(null);

    setIsEditingPatch(true);

    selectPlacedPatch(patchId);
  };

  // 이니셜 이동 시작
  const handleInitialDragStart = (initialId: string) => {
    if (mode !== "draft" || customMode !== "initial") {
      return;
    }

    setDraggingInitialId(initialId);

    setDraggingPatchId(null);

    setIsEditingInitial(true);

    selectPlacedInitial(initialId);
  };

  // 가방 빈 영역 클릭
  const handleBagPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (mode === "location-select") {
      handleLocationSelect(event);

      return;
    }

    if (mode !== "draft") {
      return;
    }

    if (customMode === "initial") {
      selectPlacedInitial(null);

      return;
    }

    selectPlacedPatch(null);
  };

  // 포인터 이동 기반 커스텀 위치 변경
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "draft") {
      return;
    }

    if (!bagMesh) {
      return;
    }

    if (!draggingPatchId && !draggingInitialId) {
      return;
    }

    const intersection = event.intersections.find((item) => item.object === bagMesh);

    if (!intersection || !intersection.face) {
      return;
    }

    const localPoint = intersection.point.clone();

    bagMesh.worldToLocal(localPoint);

    const localNormal = intersection.face.normal.clone().normalize();

    const position: [number, number, number] = [localPoint.x, localPoint.y, localPoint.z];

    const normal: [number, number, number] = [localNormal.x, localNormal.y, localNormal.z];

    if (draggingPatchId && customMode === "patch") {
      if (!intersection.uv) {
        return;
      }

      // 서버 패치 적용 면
      const side: "FRONT" | "BACK" = localPoint.z >= 0 ? "FRONT" : "BACK";

      moveDraftPatch(draggingPatchId, position, normal, side, intersection.uv.x, intersection.uv.y);

      return;
    }

    if (draggingInitialId && customMode === "initial") {
      moveDraftInitial(draggingInitialId, position, normal);
    }
  };

  // 위치 이동 종료
  const handlePointerUp = () => {
    if (draggingPatchId) {
      setDraggingPatchId(null);

      setIsEditingPatch(false);
    }

    if (draggingInitialId) {
      setDraggingInitialId(null);

      setIsEditingInitial(false);
    }
  };

  // 상대방 위치 선택
  const handleLocationSelect = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "location-select") {
      return;
    }

    event.stopPropagation();

    if (!event.uv) {
      return;
    }

    const localPoint = scene.worldToLocal(event.point.clone());

    const side = localPoint.z >= 0 ? "FRONT" : "BACK";

    let previewX: number;

    let previewY: number;

    if (side === "FRONT") {
      previewX = (localPoint.x - FRONT_MIN_X) / (FRONT_MAX_X - FRONT_MIN_X);

      previewY = (FRONT_MAX_Y - localPoint.y) / (FRONT_MAX_Y - FRONT_MIN_Y);
    } else {
      previewX = (BACK_MAX_X - localPoint.x) / (BACK_MAX_X - BACK_MIN_X);

      previewY = (BACK_MAX_Y - localPoint.y) / (BACK_MAX_Y - BACK_MIN_Y);
    }

    const normalizedPreviewX = Math.min(Math.max(previewX, 0), 1);

    const normalizedPreviewY = Math.min(Math.max(previewY, 0), 1);

    onLocationChange?.({
      side,

      posX: event.uv.x,

      posY: event.uv.y,

      rotation: 0,

      previewX: normalizedPreviewX,

      previewY: normalizedPreviewY,
    });

    setMarkerPosition([event.point.x, event.point.y, event.point.z]);

    console.log("선택 위치:", {
      side,

      x: localPoint.x,

      y: localPoint.y,

      z: localPoint.z,

      previewX: normalizedPreviewX,

      previewY: normalizedPreviewY,
    });
  };

  return (
    <>
      {/* 실제 GLB 가방 */}
      <primitive
        object={scene}
        position={[0, 1.9, 0]}
        scale={1.1}
        onPointerDown={handleBagPointerDown}
        onPointerMove={mode === "draft" ? handlePointerMove : undefined}
        onPointerUp={mode === "draft" ? handlePointerUp : undefined}
        onPointerLeave={mode === "draft" ? handlePointerUp : undefined}
        onPointerMissed={() => {
          if (mode !== "draft") {
            return;
          }

          if (draggingPatchId || draggingInitialId) {
            return;
          }

          if (customMode === "initial") {
            selectPlacedInitial(null);

            return;
          }

          selectPlacedPatch(null);
        }}
      />

      {/* 가방 위 커스텀 렌더링 */}
      {bagMesh &&
        (mode === "draft" || mode === "applied") &&
        createPortal(
          <>
            {/* 가방 위 패치 목록 */}
            {visiblePatches.map((patch) => (
              <BagPatchDecal
                key={patch.id}
                patch={patch}
                editable={mode === "draft" && customMode === "patch"}
                onDragStart={handlePatchDragStart}
              />
            ))}

            {/* 가방 위 이니셜 목록 */}
            {visibleInitials.map((initial) => (
              <BagInitialDecal
                key={initial.id}
                initial={initial}
                editable={mode === "draft" && customMode === "initial"}
                onDragStart={handleInitialDragStart}
              />
            ))}
          </>,
          bagMesh,
        )}

      {/* 위치 선택 프레임 */}
      {mode === "location-select" && markerPosition && (
        <Html
          position={markerPosition}
          center
          style={{
            pointerEvents: "none",
          }}
        >
          <div
            className="
                h-16
                w-16
                border-3
                border-white
                bg-transparent
                shadow-md
              "
          />
        </Html>
      )}
    </>
  );
}

// GLB 사전 로딩
useGLTF.preload(bagUrl);
