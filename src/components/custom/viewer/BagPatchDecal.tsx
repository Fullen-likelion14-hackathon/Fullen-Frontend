import * as THREE from "three";

import { useEffect, useMemo } from "react";

import { Decal, Html, useTexture } from "@react-three/drei";

import PlacedPatchControls from "@/components/custom/patch/PlacedPatchControls";
import PatchSelectionFrame from "@/components/custom/viewer/PatchSelectionFrame";

import { useBagCustomStore, type PlacedPatch } from "@/stores/bagCustomStore";

interface BagPatchDecalProps {
  // 가방 위 패치 정보임
  patch: PlacedPatch;

  // 패치 편집 가능 여부임
  editable: boolean;

  // 패치 위치 이동 시작 함수임
  onDragStart: (patchId: string) => void;
}

// 패치 최소 크기임
const MIN_PATCH_SCALE = 0.25;

// 패치 최대 크기임
const MAX_PATCH_SCALE = 1.2;

// 버튼 클릭 단위 크기임
const PATCH_SCALE_STEP = 0.08;

const BagPatchDecal = ({ patch, editable, onDragStart }: BagPatchDecalProps) => {
  // 패치 원본 texture임
  const sourceTexture = useTexture(patch.image);

  // 현재 선택 패치 id임
  const selectedPlacedPatchId = useBagCustomStore((state) => state.selectedPlacedPatchId);

  // 패치 선택 함수임
  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  // 패치 크기 변경 함수임
  const resizeDraftPatch = useBagCustomStore((state) => state.resizeDraftPatch);

  // 패치 좌우 반전 함수임
  const flipDraftPatch = useBagCustomStore((state) => state.flipDraftPatch);

  // 가방 위 패치 제거 함수임
  const removeDraftPatch = useBagCustomStore((state) => state.removeDraftPatch);

  // 현재 패치 선택 여부임
  const isSelected = selectedPlacedPatchId === patch.id;

  // 패치별 texture 복제본임
  const texture = useMemo(() => {
    const clonedTexture = sourceTexture.clone();

    clonedTexture.wrapS = THREE.RepeatWrapping;

    clonedTexture.needsUpdate = true;

    return clonedTexture;
  }, [sourceTexture]);

  // 좌우 반전 상태 적용함
  useEffect(() => {
    if (patch.flipped) {
      texture.repeat.x = -1;
      texture.offset.x = 1;
    } else {
      texture.repeat.x = 1;
      texture.offset.x = 0;
    }

    texture.needsUpdate = true;
  }, [patch.flipped, texture]);

  // 가방 표면 방향에 맞는 회전값 계산함
  const decalRotation = useMemo(() => {
    const normal = new THREE.Vector3(...patch.normal).normalize();

    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal,
    );

    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [patch.normal]);

  // 아직 가방 위치가 계산되지 않은 경우 렌더링하지 않음
  if (!patch.position) {
    return null;
  }

  // 패치 크기 축소함
  const handleDecreaseSize = () => {
    resizeDraftPatch(patch.id, Math.max(MIN_PATCH_SCALE, patch.scale - PATCH_SCALE_STEP));
  };

  // 패치 크기 확대함
  const handleIncreaseSize = () => {
    resizeDraftPatch(patch.id, Math.min(MAX_PATCH_SCALE, patch.scale + PATCH_SCALE_STEP));
  };

  return (
    <>
      {/* 실제 가방 표면에 투영되는 패치임 */}
      <Decal
        position={patch.position}
        rotation={decalRotation}
        scale={[patch.scale, patch.scale, patch.scale]}
        onPointerDown={(event) => {
          // 메인 화면에서는 편집 불가함
          if (!editable) {
            return;
          }

          event.stopPropagation();

          // 현재 패치 선택함
          selectPlacedPatch(patch.id);

          // 가방 표면 위치 이동 시작함
          onDragStart(patch.id);
        }}
      >
        <meshStandardMaterial
          map={texture}
          transparent
          polygonOffset
          polygonOffsetFactor={-4}
          depthWrite={false}
          toneMapped={false}
        />
      </Decal>

      {/* 선택된 패치 흰색 편집 프레임임 */}
      {editable && isSelected && <PatchSelectionFrame patch={patch} rotation={decalRotation} />}

      {/* 선택된 패치 상단 조작 버튼임 */}
      {editable && isSelected && (
        <Html
          position={[patch.position[0], patch.position[1] + patch.scale * 0.8, patch.position[2]]}
          center
          zIndexRange={[100, 0]}
        >
          <PlacedPatchControls
            onFlip={() => {
              flipDraftPatch(patch.id);
            }}
            onDecreaseSize={handleDecreaseSize}
            onIncreaseSize={handleIncreaseSize}
            onRemove={() => {
              removeDraftPatch(patch.id);
            }}
          />
        </Html>
      )}
    </>
  );
};

export default BagPatchDecal;
