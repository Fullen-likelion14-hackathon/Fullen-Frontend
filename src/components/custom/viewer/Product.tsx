// 제품 렌더링
import * as THREE from "three";
import { useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";

import bagUrl from "@/assets/models/OttomarBag.glb";

import type { PatchLocation } from "@/types/patchLocation";

export type ProductMode = "view" | "location-select";

type ProductProps = {
  mode?: ProductMode;
  onLocationChange?: (location: PatchLocation) => void;
};

// FRONT 몸통 범위
const FRONT_MIN_X = -0.677;
const FRONT_MAX_X = 0.657;

const FRONT_MIN_Y = -0.667;
const FRONT_MAX_Y = 0.129;

// BACK 몸통 범위
const BACK_MIN_X = -0.639;
const BACK_MAX_X = 0.683;

const BACK_MIN_Y = -0.574;
const BACK_MAX_Y = 0.121;

export function Product({ mode = "view", onLocationChange }: ProductProps) {
  const { scene } = useGLTF(bagUrl);

  // 3D 가방 위 흰색 프레임 위치
  const [markerPosition, setMarkerPosition] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    // traverse - 가방 내부 3D 요소를 전부 순회
    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
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
      }
    });
  }, [scene]);

  // 위치 선택 모드에서 가방 클릭 위치 확인
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (mode !== "location-select") return;

    event.stopPropagation();

    if (!event.uv) return;

    // 클릭한 월드 좌표 → 가방 기준 로컬 좌표
    const localPoint = scene.worldToLocal(event.point.clone());

    // 앞면 / 뒷면 구분
    const side = localPoint.z >= 0 ? "FRONT" : "BACK";

    let previewX: number;
    let previewY: number;

    if (side === "FRONT") {
      // FRONT는 로컬 X 방향과 화면의 좌우 방향이 동일
      previewX = (localPoint.x - FRONT_MIN_X) / (FRONT_MAX_X - FRONT_MIN_X);

      previewY = (FRONT_MAX_Y - localPoint.y) / (FRONT_MAX_Y - FRONT_MIN_Y);
    } else {
      // BACK은 뒤에서 바라보기 때문에 좌우 방향을 반대로 계산
      previewX = (BACK_MAX_X - localPoint.x) / (BACK_MAX_X - BACK_MIN_X);

      previewY = (BACK_MAX_Y - localPoint.y) / (BACK_MAX_Y - BACK_MIN_Y);
    }

    // 0 ~ 1 범위를 벗어나지 않도록 제한
    const normalizedPreviewX = Math.min(Math.max(previewX, 0), 1);

    const normalizedPreviewY = Math.min(Math.max(previewY, 0), 1);

    // 부모 컴포넌트로 선택한 위치 전달
    onLocationChange?.({
      side,

      // API 전송용 UV 좌표
      posX: event.uv.x,
      posY: event.uv.y,
      rotation: 0,

      // 2D 미리보기용 좌표
      previewX: normalizedPreviewX,
      previewY: normalizedPreviewY,
    });

    // 3D 가방 위 흰색 프레임 위치
    setMarkerPosition([event.point.x, event.point.y, event.point.z]);

    // 테스트용
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
      <primitive
        object={scene}
        position={[0, 1.9, 0]}
        scale={1.1}
        onPointerDown={mode === "location-select" ? handlePointerDown : undefined}
      />

      {/* 선택 위치 표시용 흰색 투명 프레임 */}
      {mode === "location-select" && markerPosition && (
        <Html position={markerPosition} center style={{ pointerEvents: "none" }}>
          <div className="h-16 w-16 border-3 border-white bg-transparent shadow-md" />
        </Html>
      )}
    </>
  );
}

useGLTF.preload(bagUrl);
