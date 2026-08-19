// 제품 3D 렌더링 컴포넌트임
import * as THREE from "three";

import { useEffect, useState } from "react";

import { createPortal, type ThreeEvent } from "@react-three/fiber";

import { Html, useGLTF } from "@react-three/drei";

import bagUrl from "@/assets/models/OttomarBag.glb";

import BagPatchDecal from "@/components/custom/viewer/BagPatchDecal";

import { useBagCustomStore } from "@/stores/bagCustomStore";

import type { PatchLocation } from "@/types/patchLocation";

// Product에서 사용할 전체 모드 타입임
export type ProductMode = "view" | "location-select" | "draft" | "applied";

interface ProductProps {
  // 현재 Product 동작 모드임
  mode?: ProductMode;

  // 위치 선택 모드에서 선택한 위치 전달 함수임
  onLocationChange?: (location: PatchLocation) => void;
}

// FRONT 몸통 X 최소 범위임
const FRONT_MIN_X = -0.677;

// FRONT 몸통 X 최대 범위임
const FRONT_MAX_X = 0.657;

// FRONT 몸통 Y 최소 범위임
const FRONT_MIN_Y = -0.667;

// FRONT 몸통 Y 최대 범위임
const FRONT_MAX_Y = 0.129;

// BACK 몸통 X 최소 범위임
const BACK_MIN_X = -0.639;

// BACK 몸통 X 최대 범위임
const BACK_MAX_X = 0.683;

// BACK 몸통 Y 최소 범위임
const BACK_MIN_Y = -0.574;

// BACK 몸통 Y 최대 범위임
const BACK_MAX_Y = 0.121;

export function Product({ mode = "view", onLocationChange }: ProductProps) {
  // GLB 전체 scene임
  const { scene } = useGLTF(bagUrl);

  // 패치를 실제로 붙일 가방 Mesh임
  const [bagMesh, setBagMesh] = useState<THREE.Mesh | null>(null);

  // 위치 선택 모드에서 표시할 흰색 프레임 위치임
  const [markerPosition, setMarkerPosition] = useState<[number, number, number] | null>(null);

  // 현재 위치 이동 중인 가방 패치 id임
  const [draggingPatchId, setDraggingPatchId] = useState<string | null>(null);

  // 현재 편집 중인 패치 목록임
  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  // 실제 적용 완료된 패치 목록임
  const appliedPatches = useBagCustomStore((state) => state.appliedPatches);

  // 패치 위치 변경 함수임
  const moveDraftPatch = useBagCustomStore((state) => state.moveDraftPatch);

  // 현재 가방 위 패치 선택 함수임
  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  // 패치 편집 상태 변경 함수임
  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  // 현재 Product 모드에 따라 보여줄 패치 목록임
  const visiblePatches = mode === "draft" ? draftPatches : mode === "applied" ? appliedPatches : [];

  // 실제 가방 Mesh 찾음
  useEffect(() => {
    // 콘솔에서 확인한 실제 가방 Mesh 이름임
    const targetMesh = scene.getObjectByName("mesh_0");

    if (!(targetMesh instanceof THREE.Mesh)) {
      console.warn("가방 mesh_0을 찾지 못함");

      return;
    }

    setBagMesh(targetMesh);
  }, [scene]);

  // GLB 전체 재질 설정함
  useEffect(() => {
    // 가방 내부 3D 요소 전체 순회함
    scene.traverse((object: THREE.Object3D) => {
      // Mesh가 아닌 경우 제외함
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      // 별도 그림자 컴포넌트 사용을 위한 그림자 비활성화임
      object.castShadow = false;

      object.receiveShadow = false;

      // 현재 Mesh 재질임
      const material = object.material;

      // 환경광 반사값 조정함
      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        material.envMapIntensity = 0.5;

        material.needsUpdate = true;
      }
    });
  }, [scene]);

  // 새로 가방에 올라온 패치 최초 위치 설정함
  useEffect(() => {
    // 패치 편집 화면에서만 처리함
    if (mode !== "draft") {
      return;
    }

    if (!bagMesh) return;

    // 실제 가방 geometry임
    const geometry = bagMesh.geometry;

    // bounding box가 없는 경우 계산함
    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    const box = geometry.boundingBox;

    if (!box) return;

    // 가방 로컬 영역 중앙 좌표임
    const center = new THREE.Vector3();

    box.getCenter(center);

    // 최초 패치 위치임
    const initialPosition: [number, number, number] = [center.x, center.y, box.max.z];

    // 최초 패치 표면 방향임
    const initialNormal: [number, number, number] = [0, 0, 1];

    // 아직 위치 없는 신규 패치만 기본 위치 적용함
    draftPatches.forEach((patch) => {
      if (patch.position !== null) {
        return;
      }

      moveDraftPatch(patch.id, initialPosition, initialNormal);
    });
  }, [bagMesh, draftPatches, mode, moveDraftPatch]);

  // 가방 위 패치 위치 이동 시작함
  const handleDragStart = (patchId: string) => {
    // 편집 모드에서만 패치 이동 가능함
    if (mode !== "draft") {
      return;
    }

    // 현재 이동 대상 패치 저장함
    setDraggingPatchId(patchId);

    // OrbitControls 제어용 편집 상태 변경함
    setIsEditingPatch(true);

    // 현재 패치 선택함
    selectPlacedPatch(patchId);
  };

  // 포인터 이동에 따라 패치 위치 변경함
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    // 편집 모드에서만 처리함
    if (mode !== "draft") {
      return;
    }

    // 현재 이동 패치와 가방 Mesh 확인함
    if (!draggingPatchId || !bagMesh) {
      return;
    }

    // 포인터와 실제 가방 Mesh 교차점 찾음
    const intersection = event.intersections.find((item) => item.object === bagMesh);

    if (!intersection || !intersection.face) {
      return;
    }

    // 교차점 world 좌표 복사함
    const localPoint = intersection.point.clone();

    // world 좌표를 가방 Mesh 로컬 좌표로 변경함
    bagMesh.worldToLocal(localPoint);

    // 현재 표면 normal임
    const localNormal = intersection.face.normal.clone().normalize();

    // 현재 가방 표면 좌표로 패치 이동함
    moveDraftPatch(
      draggingPatchId,
      [localPoint.x, localPoint.y, localPoint.z],
      [localNormal.x, localNormal.y, localNormal.z],
    );
  };

  // 가방 위 패치 위치 이동 종료함
  const handlePointerUp = () => {
    if (!draggingPatchId) {
      return;
    }

    // 이동 대상 초기화함
    setDraggingPatchId(null);

    // 패치 편집 상태 종료함
    setIsEditingPatch(false);
  };

  // 상대방 위치 선택 기능임
  const handleLocationSelect = (event: ThreeEvent<PointerEvent>) => {
    // 위치 선택 모드에서만 처리함
    if (mode !== "location-select") {
      return;
    }

    // 다른 3D 이벤트 전파 막음
    event.stopPropagation();

    // UV 좌표 없는 경우 처리하지 않음
    if (!event.uv) return;

    // 클릭한 world 좌표를 가방 기준 로컬 좌표로 변경함
    const localPoint = scene.worldToLocal(event.point.clone());

    // 로컬 Z값 기준 앞면 / 뒷면 구분함
    const side = localPoint.z >= 0 ? "FRONT" : "BACK";

    let previewX: number;
    let previewY: number;

    if (side === "FRONT") {
      // FRONT 화면 좌우 방향 계산함
      previewX = (localPoint.x - FRONT_MIN_X) / (FRONT_MAX_X - FRONT_MIN_X);

      // FRONT 화면 상하 방향 계산함
      previewY = (FRONT_MAX_Y - localPoint.y) / (FRONT_MAX_Y - FRONT_MIN_Y);
    } else {
      // BACK 화면 좌우 방향 반전 계산함
      previewX = (BACK_MAX_X - localPoint.x) / (BACK_MAX_X - BACK_MIN_X);

      // BACK 화면 상하 방향 계산함
      previewY = (BACK_MAX_Y - localPoint.y) / (BACK_MAX_Y - BACK_MIN_Y);
    }

    // 2D 미리보기 X좌표 0~1 범위 제한함
    const normalizedPreviewX = Math.min(Math.max(previewX, 0), 1);

    // 2D 미리보기 Y좌표 0~1 범위 제한함
    const normalizedPreviewY = Math.min(Math.max(previewY, 0), 1);

    // 부모 컴포넌트에 위치 정보 전달함
    onLocationChange?.({
      side,

      // API 전송용 UV X좌표임
      posX: event.uv.x,

      // API 전송용 UV Y좌표임
      posY: event.uv.y,

      // 최초 회전값임
      rotation: 0,

      // 2D 미리보기 X좌표임
      previewX: normalizedPreviewX,

      // 2D 미리보기 Y좌표임
      previewY: normalizedPreviewY,
    });

    // 위치 선택 흰색 프레임 표시 위치 저장함
    setMarkerPosition([event.point.x, event.point.y, event.point.z]);

    // 개발 확인용 위치 로그임
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
      {/* 실제 GLB 가방임 */}
      <primitive
        object={scene}
        position={[0, 1.9, 0]}
        scale={1.1}

        // 위치 선택 모드에서만 클릭 위치 계산함
        onPointerDown={mode === "location-select" ? handleLocationSelect : undefined}

        // 패치 편집 모드에서만 이동 처리함
        onPointerMove={mode === "draft" ? handlePointerMove : undefined}

        // 패치 편집 모드에서만 이동 종료 처리함
        onPointerUp={mode === "draft" ? handlePointerUp : undefined}

        // 패치 편집 모드에서만 이동 종료 처리함
        onPointerLeave={mode === "draft" ? handlePointerUp : undefined}

        // 빈 영역 클릭 시 편집 패치 선택 해제함
        onPointerMissed={() => {
          if (mode !== "draft") {
            return;
          }

          if (draggingPatchId) {
            return;
          }

          selectPlacedPatch(null);
        }}
      />

      {/* draft / applied 모드에서 실제 가방 Mesh 위 패치 렌더링함 */}
      {bagMesh &&
        (mode === "draft" || mode === "applied") &&
        createPortal(
          <>
            {visiblePatches.map((patch) => (
              <BagPatchDecal
                key={patch.id}
                patch={patch}

                // draft 상태에서만 편집 가능함
                editable={mode === "draft"}

                onDragStart={handleDragStart}
              />
            ))}
          </>,
          bagMesh,
        )}

      {/* 상대방 위치 선택 기능의 흰색 선택 프레임임 */}
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

// GLB 사전 로딩함
useGLTF.preload(bagUrl);
