import * as THREE from "three";

import { useEffect, useMemo, useState } from "react";

import { createPortal, type ThreeEvent } from "@react-three/fiber";

import { Html, useGLTF } from "@react-three/drei";

import bagUrl from "@/assets/models/OttomarBag.glb";

import BagPatchDecal from "@/components/custom/viewer/BagPatchDecal";
import BagInitialDecal from "@/components/custom/viewer/BagInitialDecal";

import { useBagCustomStore, type PlacedInitial, type PlacedPatch } from "@/stores/bagCustomStore";

import type { PatchLocation } from "@/types/patchLocation";
import type { PatchSide } from "@/types/patch";

export type ProductMode = "view" | "location-select" | "draft" | "applied";

export type ProductCustomMode = "patch" | "initial";

interface ProductProps {
  mode?: ProductMode;

  customMode?: ProductCustomMode;

  onLocationChange?: (location: PatchLocation) => void;
}

type CustomRenderItem =
  | {
      type: "patch";
      layer: number;
      patch: PlacedPatch;
    }
  | {
      type: "initial";
      layer: number;
      initial: PlacedInitial;
    };

interface SurfaceGeometry {
  position: [number, number, number];

  normal: [number, number, number];

  side: PatchSide;

  posX: number;

  posY: number;
}

const FRONT_MIN_X = -0.677;

const FRONT_MAX_X = 0.657;

const FRONT_MIN_Y = -0.667;

const FRONT_MAX_Y = 0.129;

const BACK_MIN_X = -0.639;

const BACK_MAX_X = 0.683;

const BACK_MIN_Y = -0.574;

const BACK_MAX_Y = 0.121;

// Decal 표면 이격값
const SURFACE_OFFSET = 0.002;

// 서버 UV 기준 실제 Mesh 위치 계산
const findMeshPointFromUv = (
  mesh: THREE.Mesh,
  targetU: number,
  targetV: number,
  side: PatchSide,
): SurfaceGeometry | null => {
  const geometry = mesh.geometry;

  const uvAttribute = geometry.attributes.uv;

  const positionAttribute = geometry.attributes.position;

  if (!uvAttribute || !positionAttribute) {
    return null;
  }

  const index = geometry.index;

  const triangleCount = index
    ? Math.floor(index.count / 3)
    : Math.floor(positionAttribute.count / 3);

  const targetUv = new THREE.Vector3(targetU, targetV, 0);

  for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
    const firstIndex = index ? index.getX(triangleIndex * 3) : triangleIndex * 3;

    const secondIndex = index ? index.getX(triangleIndex * 3 + 1) : triangleIndex * 3 + 1;

    const thirdIndex = index ? index.getX(triangleIndex * 3 + 2) : triangleIndex * 3 + 2;

    const uvA = new THREE.Vector3(uvAttribute.getX(firstIndex), uvAttribute.getY(firstIndex), 0);

    const uvB = new THREE.Vector3(uvAttribute.getX(secondIndex), uvAttribute.getY(secondIndex), 0);

    const uvC = new THREE.Vector3(uvAttribute.getX(thirdIndex), uvAttribute.getY(thirdIndex), 0);

    const barycentric = THREE.Triangle.getBarycoord(targetUv, uvA, uvB, uvC, new THREE.Vector3());

    if (!barycentric) {
      continue;
    }

    const epsilon = -0.0001;

    if (barycentric.x < epsilon || barycentric.y < epsilon || barycentric.z < epsilon) {
      continue;
    }

    const positionA = new THREE.Vector3().fromBufferAttribute(positionAttribute, firstIndex);

    const positionB = new THREE.Vector3().fromBufferAttribute(positionAttribute, secondIndex);

    const positionC = new THREE.Vector3().fromBufferAttribute(positionAttribute, thirdIndex);

    const centerZ = (positionA.z + positionB.z + positionC.z) / 3;

    const triangleSide: PatchSide = centerZ >= 0 ? "FRONT" : "BACK";

    if (triangleSide !== side) {
      continue;
    }

    const position = new THREE.Vector3()
      .addScaledVector(positionA, barycentric.x)
      .addScaledVector(positionB, barycentric.y)
      .addScaledVector(positionC, barycentric.z);

    const triangle = new THREE.Triangle(positionA, positionB, positionC);

    const normal = triangle.getNormal(new THREE.Vector3()).normalize();

    // 표면 겹침 방지
    position.addScaledVector(normal, SURFACE_OFFSET);

    return {
      position: [position.x, position.y, position.z],

      normal: [normal.x, normal.y, normal.z],

      side,

      posX: targetU,

      posY: targetV,
    };
  }

  return null;
};

// 실제 가방 정면 최초 부착 위치 계산
const findInitialFrontSurface = (mesh: THREE.Mesh): SurfaceGeometry | null => {
  const geometry = mesh.geometry;

  const uvAttribute = geometry.attributes.uv;

  if (!uvAttribute) {
    return null;
  }

  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }

  const boundingBox = geometry.boundingBox;

  if (!boundingBox) {
    return null;
  }

  // 최신 Transform 반영
  mesh.updateWorldMatrix(true, false);

  const localCenter = new THREE.Vector3();

  boundingBox.getCenter(localCenter);

  // 가방 정면 바깥쪽 시작점
  const localRayOrigin = new THREE.Vector3(localCenter.x, localCenter.y, boundingBox.max.z + 2);

  const localRayTarget = new THREE.Vector3(localCenter.x, localCenter.y, boundingBox.min.z - 2);

  const worldRayOrigin = localRayOrigin.clone();

  mesh.localToWorld(worldRayOrigin);

  const worldRayTarget = localRayTarget.clone();

  mesh.localToWorld(worldRayTarget);

  const worldDirection = worldRayTarget.sub(worldRayOrigin).normalize();

  const raycaster = new THREE.Raycaster(worldRayOrigin, worldDirection);

  const intersections = raycaster.intersectObject(mesh, false);

  const intersection = intersections.find((item) => item.uv && item.face);

  if (!intersection || !intersection.uv || !intersection.face) {
    return null;
  }

  // World 좌표 → Mesh local 좌표
  const localPoint = intersection.point.clone();

  mesh.worldToLocal(localPoint);

  const localNormal = intersection.face.normal.clone().normalize();

  // 표면보다 아주 조금 앞으로 배치
  localPoint.addScaledVector(localNormal, SURFACE_OFFSET);

  return {
    position: [localPoint.x, localPoint.y, localPoint.z],

    normal: [localNormal.x, localNormal.y, localNormal.z],

    side: "FRONT",

    posX: intersection.uv.x,

    posY: intersection.uv.y,
  };
};

export function Product({ mode = "view", customMode = "patch", onLocationChange }: ProductProps) {
  const { scene } = useGLTF(bagUrl);

  const [bagMesh, setBagMesh] = useState<THREE.Mesh | null>(null);

  const [markerPosition, setMarkerPosition] = useState<[number, number, number] | null>(null);

  const [draggingPatchId, setDraggingPatchId] = useState<string | null>(null);

  const [draggingInitialId, setDraggingInitialId] = useState<string | null>(null);

  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  const appliedPatches = useBagCustomStore((state) => state.appliedPatches);

  const draftInitials = useBagCustomStore((state) => state.draftInitials);

  const appliedInitials = useBagCustomStore((state) => state.appliedInitials);

  const moveDraftPatch = useBagCustomStore((state) => state.moveDraftPatch);

  const moveDraftInitial = useBagCustomStore((state) => state.moveDraftInitial);

  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  const selectPlacedInitial = useBagCustomStore((state) => state.selectPlacedInitial);

  const setIsEditingPatch = useBagCustomStore((state) => state.setIsEditingPatch);

  const setIsEditingInitial = useBagCustomStore((state) => state.setIsEditingInitial);

  const restorePatchGeometry = useBagCustomStore((state) => state.restorePatchGeometry);

  const restoreInitialGeometry = useBagCustomStore((state) => state.restoreInitialGeometry);

  const visiblePatches = mode === "draft" ? draftPatches : mode === "applied" ? appliedPatches : [];

  const visibleInitials =
    mode === "draft" ? draftInitials : mode === "applied" ? appliedInitials : [];

  // layer 기반 통합 렌더링 목록
  const customRenderItems = useMemo<CustomRenderItem[]>(() => {
    const items: CustomRenderItem[] = [
      ...visiblePatches.map((patch) => ({
        type: "patch" as const,

        layer: patch.layer,

        patch,
      })),

      ...visibleInitials.map((initial) => ({
        type: "initial" as const,

        layer: initial.layer,

        initial,
      })),
    ];

    return items.sort((first, second) => first.layer - second.layer);
  }, [visibleInitials, visiblePatches]);

  // 가방 Mesh 탐색
  useEffect(() => {
    scene.updateMatrixWorld(true);

    const targetMesh = scene.getObjectByName("mesh_0");

    if (!(targetMesh instanceof THREE.Mesh)) {
      console.warn("가방 mesh_0을 찾지 못함");

      return;
    }

    targetMesh.geometry.computeBoundingBox();

    setBagMesh(targetMesh);
  }, [scene]);

  // GLB 재질 설정
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

  // 저장 패치 위치 복원
  useEffect(() => {
    if (!bagMesh) {
      return;
    }

    visiblePatches.forEach((patch) => {
      if (patch.position !== null) {
        return;
      }

      const restoredGeometry = findMeshPointFromUv(bagMesh, patch.posX, patch.posY, patch.side);

      if (!restoredGeometry) {
        return;
      }

      restorePatchGeometry(patch.id, restoredGeometry.position, restoredGeometry.normal);
    });
  }, [bagMesh, restorePatchGeometry, visiblePatches]);

  // 저장 이니셜 위치 복원
  useEffect(() => {
    if (!bagMesh) {
      return;
    }

    visibleInitials.forEach((initial) => {
      if (initial.position !== null) {
        return;
      }

      const restoredGeometry = findMeshPointFromUv(
        bagMesh,
        initial.posX,
        initial.posY,
        initial.side,
      );

      if (!restoredGeometry) {
        return;
      }

      restoreInitialGeometry(initial.id, restoredGeometry.position, restoredGeometry.normal);
    });
  }, [bagMesh, restoreInitialGeometry, visibleInitials]);

  // 신규 패치 최초 위치
  useEffect(() => {
    if (mode !== "draft" || customMode !== "patch" || !bagMesh) {
      return;
    }

    const initialSurface = findInitialFrontSurface(bagMesh);

    if (!initialSurface) {
      return;
    }

    draftPatches.forEach((patch) => {
      if (patch.position !== null || patch.patchPositionId !== null) {
        return;
      }

      moveDraftPatch(
        patch.id,
        initialSurface.position,
        initialSurface.normal,
        initialSurface.side,
        initialSurface.posX,
        initialSurface.posY,
      );
    });
  }, [bagMesh, customMode, draftPatches, mode, moveDraftPatch]);

  // 신규 이니셜 최초 위치
  useEffect(() => {
    if (mode !== "draft" || customMode !== "initial" || !bagMesh) {
      return;
    }

    const initialSurface = findInitialFrontSurface(bagMesh);

    if (!initialSurface) {
      return;
    }

    draftInitials.forEach((initial) => {
      if (initial.position !== null || initial.initialId !== null) {
        return;
      }

      moveDraftInitial(
        initial.id,
        initialSurface.position,
        initialSurface.normal,
        initialSurface.side,
        initialSurface.posX,
        initialSurface.posY,
      );
    });
  }, [bagMesh, customMode, draftInitials, mode, moveDraftInitial]);

  const handlePatchDragStart = (patchId: string) => {
    if (mode !== "draft" || customMode !== "patch") {
      return;
    }

    setDraggingPatchId(patchId);

    setDraggingInitialId(null);

    setIsEditingPatch(true);

    selectPlacedPatch(patchId);
  };

  const handleInitialDragStart = (initialId: string) => {
    if (mode !== "draft" || customMode !== "initial") {
      return;
    }

    setDraggingInitialId(initialId);

    setDraggingPatchId(null);

    setIsEditingInitial(true);

    selectPlacedInitial(initialId);
  };

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

  // 실제 드래그 위치 갱신
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "draft" || !bagMesh) {
      return;
    }

    if (!draggingPatchId && !draggingInitialId) {
      return;
    }

    const intersection = event.intersections.find((item) => item.object === bagMesh);

    if (!intersection || !intersection.face || !intersection.uv) {
      return;
    }

    const localPoint = intersection.point.clone();

    bagMesh.worldToLocal(localPoint);

    const localNormal = intersection.face.normal.clone().normalize();

    // 표면 겹침 방지
    localPoint.addScaledVector(localNormal, SURFACE_OFFSET);

    const position: [number, number, number] = [localPoint.x, localPoint.y, localPoint.z];

    const normal: [number, number, number] = [localNormal.x, localNormal.y, localNormal.z];

    const side: PatchSide = localPoint.z >= 0 ? "FRONT" : "BACK";

    if (draggingPatchId && customMode === "patch") {
      moveDraftPatch(draggingPatchId, position, normal, side, intersection.uv.x, intersection.uv.y);

      return;
    }

    if (draggingInitialId && customMode === "initial") {
      moveDraftInitial(
        draggingInitialId,
        position,
        normal,
        side,
        intersection.uv.x,
        intersection.uv.y,
      );
    }
  };

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

  const handleLocationSelect = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "location-select") {
      return;
    }

    event.stopPropagation();

    if (!event.uv) {
      return;
    }

    const localPoint = scene.worldToLocal(event.point.clone());

    const side: PatchSide = localPoint.z >= 0 ? "FRONT" : "BACK";

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
  };

  return (
    <>
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

      {/* layer 기반 렌더링 */}
      {bagMesh &&
        (mode === "draft" || mode === "applied") &&
        createPortal(
          <>
            {customRenderItems.map((item) => {
              if (item.type === "patch") {
                return (
                  <BagPatchDecal
                    key={`patch-${item.patch.id}`}
                    patch={item.patch}
                    editable={mode === "draft" && customMode === "patch"}
                    onDragStart={handlePatchDragStart}
                  />
                );
              }

              return (
                <BagInitialDecal
                  key={`initial-${item.initial.id}`}
                  initial={item.initial}
                  editable={mode === "draft" && customMode === "initial"}
                  onDragStart={handleInitialDragStart}
                />
              );
            })}
          </>,
          bagMesh,
        )}

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
               border-[#192C44]
                bg-[#192C44]/50
                shadow-md
              "
          />
        </Html>
      )}
    </>
  );
}

useGLTF.preload(bagUrl);
