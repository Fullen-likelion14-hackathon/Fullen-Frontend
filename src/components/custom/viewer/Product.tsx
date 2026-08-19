import * as THREE from "three";

import { useEffect, useState } from "react";

import { createPortal, type ThreeEvent } from "@react-three/fiber";

import { useGLTF } from "@react-three/drei";

import bagUrl from "@/assets/models/OttomarBag.glb";

import BagPatchDecal from "@/components/custom/viewer/BagPatchDecal";

import { useBagCustomStore } from "@/stores/bagCustomStore";

interface ProductProps {
  // 편집 상태 또는 적용 상태 구분값임
  mode: "draft" | "applied";
}

export function Product({ mode }: ProductProps) {
  // GLB 전체 scene임
  const { scene } = useGLTF(bagUrl);

  // 실제 패치를 붙일 가방 Mesh임
  const [bagMesh, setBagMesh] = useState<THREE.Mesh | null>(null);

  // 현재 위치 이동 중인 패치 id임
  const [draggingPatchId, setDraggingPatchId] = useState<string | null>(null);

  // 현재 편집 중인 패치 목록임
  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  // 실제 적용 완료 패치 목록임
  const appliedPatches = useBagCustomStore((state) => state.appliedPatches);

  // 패치 위치 변경 함수임
  const moveDraftPatch = useBagCustomStore((state) => state.moveDraftPatch);

  // 패치 선택 함수임
  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  // 패치 편집 여부 변경 함수임
  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  // 현재 화면에 렌더링할 패치 목록임
  const visiblePatches = mode === "draft" ? draftPatches : appliedPatches;

  // 실제 가방 Mesh 찾음
  useEffect(() => {
    const targetMesh = scene.getObjectByName("mesh_0");

    if (!(targetMesh instanceof THREE.Mesh)) {
      console.warn("가방 mesh_0을 찾지 못함");

      return;
    }

    setBagMesh(targetMesh);
  }, [scene]);

  // GLB 재질 설정함
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

  // 새로 가방에 올라온 패치 최초 위치 설정함
  useEffect(() => {
    // 편집 화면에서만 처리함
    if (mode !== "draft") {
      return;
    }

    if (!bagMesh) return;

    const geometry = bagMesh.geometry;

    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    const box = geometry.boundingBox;

    if (!box) return;

    // 가방 로컬 영역 중심임
    const center = new THREE.Vector3();

    box.getCenter(center);

    // 최초 가방 정면 중앙 위치임
    const initialPosition: [number, number, number] = [center.x, center.y, box.max.z];

    // 최초 정면 normal임
    const initialNormal: [number, number, number] = [0, 0, 1];

    draftPatches.forEach((patch) => {
      // 이미 위치가 있는 패치는 변경하지 않음
      if (patch.position !== null) {
        return;
      }

      moveDraftPatch(patch.id, initialPosition, initialNormal);
    });
  }, [bagMesh, draftPatches, mode, moveDraftPatch]);

  // 패치 위치 이동 시작함
  const handleDragStart = (patchId: string) => {
    if (mode !== "draft") {
      return;
    }

    setDraggingPatchId(patchId);

    setIsEditingPatch(true);

    selectPlacedPatch(patchId);
  };

  // 포인터 이동에 따라 가방 표면 패치 이동함
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "draft") {
      return;
    }

    if (!draggingPatchId || !bagMesh) {
      return;
    }

    // 현재 가방 Mesh와 만나는 raycast 결과 찾음
    const intersection = event.intersections.find((item) => item.object === bagMesh);

    if (!intersection || !intersection.face) {
      return;
    }

    // world 위치 복사함
    const localPoint = intersection.point.clone();

    // 가방 Mesh 로컬 좌표로 변환함
    bagMesh.worldToLocal(localPoint);

    // 현재 표면 normal임
    const localNormal = intersection.face.normal.clone().normalize();

    moveDraftPatch(
      draggingPatchId,
      [localPoint.x, localPoint.y, localPoint.z],
      [localNormal.x, localNormal.y, localNormal.z],
    );
  };

  // 패치 위치 이동 종료함
  const handlePointerUp = () => {
    if (!draggingPatchId) {
      return;
    }

    setDraggingPatchId(null);

    setIsEditingPatch(false);
  };

  return (
    <>
      {/* 실제 GLB 가방임 */}
      <primitive
        object={scene}
        position={[0, 1.9, 0]}
        scale={1.1}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMissed={() => {
          // 적용 화면에서는 편집하지 않음
          if (mode !== "draft") {
            return;
          }

          // 이동 중에는 선택 해제하지 않음
          if (draggingPatchId) {
            return;
          }

          selectPlacedPatch(null);
        }}
      />

      {/* 실제 가방 Mesh 안에 패치 Decal 생성함 */}
      {bagMesh &&
        createPortal(
          <>
            {visiblePatches.map((patch) => (
              <BagPatchDecal
                key={patch.id}
                patch={patch}
                editable={mode === "draft"}
                onDragStart={handleDragStart}
              />
            ))}
          </>,
          bagMesh,
        )}
    </>
  );
}

useGLTF.preload(bagUrl);
