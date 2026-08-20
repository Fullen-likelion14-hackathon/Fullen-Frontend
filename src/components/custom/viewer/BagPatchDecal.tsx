import * as THREE from "three";

import { useEffect, useMemo } from "react";

import { Decal, Html, useTexture } from "@react-three/drei";

import PlacedPatchControls from "@/components/custom/patch/PlacedPatchControls";
import PatchSelectionFrame from "@/components/custom/viewer/PatchSelectionFrame";

import { useBagCustomStore, type PlacedPatch } from "@/stores/bagCustomStore";

interface BagPatchDecalProps {
  patch: PlacedPatch;

  editable: boolean;

  onDragStart: (patchId: string) => void;
}

const MIN_PATCH_SCALE = 0.25;

const MAX_PATCH_SCALE = 1.2;

const PATCH_SCALE_STEP = 0.08;

// 패치 크기와 독립적인 Decal 투영 깊이
const PATCH_DECAL_DEPTH = 0.5;

// layer별 표면 우선순위
const getPolygonOffsetFactor = (layer: number) => -10 - layer * 2;

const BagPatchDecal = ({ patch, editable, onDragStart }: BagPatchDecalProps) => {
  const sourceTexture = useTexture(patch.image);

  const selectedPlacedPatchId = useBagCustomStore((state) => state.selectedPlacedPatchId);

  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  const resizeDraftPatch = useBagCustomStore((state) => state.resizeDraftPatch);

  const flipDraftPatch = useBagCustomStore((state) => state.flipDraftPatch);

  const removeDraftPatch = useBagCustomStore((state) => state.removeDraftPatch);

  const isSelected = selectedPlacedPatchId === patch.id;

  const texture = useMemo(() => {
    const clonedTexture = sourceTexture.clone();

    clonedTexture.wrapS = THREE.RepeatWrapping;

    clonedTexture.needsUpdate = true;

    return clonedTexture;
  }, [sourceTexture]);

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

  // 복제 Texture 정리
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  const decalRotation = useMemo(() => {
    const normal = new THREE.Vector3(...patch.normal).normalize();

    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal,
    );

    const rotation = new THREE.Euler().setFromQuaternion(quaternion);

    // 저장 회전값 적용
    rotation.z += patch.rotation;

    return rotation;
  }, [patch.normal, patch.rotation]);

  if (!patch.position) {
    return null;
  }

  const handleDecreaseSize = () => {
    resizeDraftPatch(patch.id, Math.max(MIN_PATCH_SCALE, patch.scale - PATCH_SCALE_STEP));
  };

  const handleIncreaseSize = () => {
    resizeDraftPatch(patch.id, Math.min(MAX_PATCH_SCALE, patch.scale + PATCH_SCALE_STEP));
  };

  return (
    <>
      <Decal
        position={patch.position}
        rotation={decalRotation}
        scale={[
          patch.scale,
          patch.scale,

          // XY 크기와 독립된 투영 깊이
          PATCH_DECAL_DEPTH,
        ]}
        onPointerDown={(event) => {
          if (!editable) {
            return;
          }

          event.stopPropagation();

          selectPlacedPatch(patch.id);

          onDragStart(patch.id);
        }}
      >
        <meshStandardMaterial
          map={texture}
          transparent
          polygonOffset
          polygonOffsetFactor={getPolygonOffsetFactor(patch.layer)}
          depthTest
          depthWrite={false}
          toneMapped={false}
        />
      </Decal>

      {editable && isSelected && <PatchSelectionFrame patch={patch} rotation={decalRotation} />}

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
