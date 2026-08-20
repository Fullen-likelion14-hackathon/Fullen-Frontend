import * as THREE from "three";

import { useEffect, useMemo } from "react";

import type { ThreeEvent } from "@react-three/fiber";

import { Decal, Html } from "@react-three/drei";

import PlacedInitialControls from "@/components/custom/initials/PlacedInitialControls";
import InitialSelectionFrame from "@/components/custom/initials/InitialSelectionFrame";

import { type PlacedInitial, useBagCustomStore } from "@/stores/bagCustomStore";

interface BagInitialDecalProps {
  initial: PlacedInitial;

  editable: boolean;

  onDragStart: (initialId: string) => void;
}

const MIN_INITIAL_SCALE = 0.25;

const MAX_INITIAL_SCALE = 1.2;

const TEXTURE_HEIGHT = 256;

const FONT_SIZE = 160;

const INITIAL_BASE_HEIGHT = 0.45;

// 이니셜 투영 깊이
const INITIAL_DECAL_DEPTH = 0.5;

export default function BagInitialDecal({ initial, editable, onDragStart }: BagInitialDecalProps) {
  const selectedPlacedInitialId = useBagCustomStore((state) => state.selectedPlacedInitialId);

  const selectPlacedInitial = useBagCustomStore((state) => state.selectPlacedInitial);

  const resizeDraftInitial = useBagCustomStore((state) => state.resizeDraftInitial);

  const removeDraftInitial = useBagCustomStore((state) => state.removeDraftInitial);

  const isSelected = editable && selectedPlacedInitialId === initial.id;

  const textureData = useMemo(() => {
    const measureCanvas = document.createElement("canvas");

    const measureContext = measureCanvas.getContext("2d");

    if (!measureContext) {
      measureCanvas.width = TEXTURE_HEIGHT;

      measureCanvas.height = TEXTURE_HEIGHT;

      const fallbackTexture = new THREE.CanvasTexture(measureCanvas);

      fallbackTexture.colorSpace = THREE.SRGBColorSpace;

      fallbackTexture.needsUpdate = true;

      return {
        texture: fallbackTexture,

        aspectRatio: 1,
      };
    }

    const canvasFontWeight = initial.fontWeight === "bold" ? 700 : 400;

    measureContext.font = `${canvasFontWeight} ${FONT_SIZE}px sans-serif`;

    const measuredTextWidth = measureContext.measureText(initial.text).width;

    const textureWidth = Math.max(TEXTURE_HEIGHT, Math.ceil(measuredTextWidth + 80));

    const canvas = document.createElement("canvas");

    canvas.width = textureWidth;

    canvas.height = TEXTURE_HEIGHT;

    const context = canvas.getContext("2d");

    if (!context) {
      const fallbackTexture = new THREE.CanvasTexture(canvas);

      fallbackTexture.colorSpace = THREE.SRGBColorSpace;

      fallbackTexture.needsUpdate = true;

      return {
        texture: fallbackTexture,

        aspectRatio: textureWidth / TEXTURE_HEIGHT,
      };
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = `${canvasFontWeight} ${FONT_SIZE}px sans-serif`;

    context.fillStyle = initial.color;

    context.textAlign = "center";

    context.textBaseline = "middle";

    context.fillText(initial.text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    texture.needsUpdate = true;

    return {
      texture,

      aspectRatio: textureWidth / TEXTURE_HEIGHT,
    };
  }, [initial.color, initial.fontWeight, initial.text]);

  useEffect(() => {
    return () => {
      textureData.texture.dispose();
    };
  }, [textureData.texture]);

  if (!initial.position) {
    return null;
  }

  const decalPosition = new THREE.Vector3(
    initial.position[0],
    initial.position[1],
    initial.position[2],
  );

  const normal = new THREE.Vector3(
    initial.normal[0],
    initial.normal[1],
    initial.normal[2],
  ).normalize();

  const quaternion = new THREE.Quaternion();

  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  // 가방 표면 방향 및 사용자 회전값
  const decalRotation = new THREE.Euler().setFromQuaternion(quaternion);

  decalRotation.z += THREE.MathUtils.degToRad(initial.rotation);

  const aspectRatio = Math.min(textureData.aspectRatio, 6);

  const decalHeight = INITIAL_BASE_HEIGHT * initial.scale;

  const decalWidth = decalHeight * aspectRatio;

  const controlPosition: [number, number, number] = [
    initial.position[0],

    initial.position[1] + decalHeight + 0.12,

    initial.position[2],
  ];

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!editable) {
      return;
    }

    event.stopPropagation();

    selectPlacedInitial(initial.id);

    onDragStart(initial.id);
  };

  const handleDecreaseSize = () => {
    const nextScale = Math.max(MIN_INITIAL_SCALE, initial.scale - 0.1);

    resizeDraftInitial(initial.id, nextScale);
  };

  const handleIncreaseSize = () => {
    const nextScale = Math.min(MAX_INITIAL_SCALE, initial.scale + 0.1);

    resizeDraftInitial(initial.id, nextScale);
  };

  const handleRemove = () => {
    removeDraftInitial(initial.id);
  };

  // layer 기반 표면 앞뒤 순서
  const polygonOffsetFactor = -1 - initial.layer * 0.1;

  return (
    <>
      {/* 실제 이니셜 Decal */}
      <Decal
        position={[decalPosition.x, decalPosition.y, decalPosition.z]}
        rotation={decalRotation}
        scale={[decalWidth, decalHeight, INITIAL_DECAL_DEPTH]}
        renderOrder={initial.layer}
        onPointerDown={handlePointerDown}
      >
        <meshBasicMaterial
          map={textureData.texture}
          transparent
          alphaTest={0.01}
          depthTest
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={polygonOffsetFactor}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </Decal>

      {/* 선택 이니셜 프레임 */}
      {isSelected && (
        <InitialSelectionFrame
          initial={initial}
          rotation={decalRotation}
          width={decalWidth}
          height={decalHeight}
        />
      )}

      {/* 선택 이니셜 조작 영역 */}
      {isSelected && (
        <Html
          position={controlPosition}
          center
          zIndexRange={[100, 0]}
          style={{
            pointerEvents: "auto",
          }}
        >
          <PlacedInitialControls
            onDecreaseSize={handleDecreaseSize}
            onIncreaseSize={handleIncreaseSize}
            onRemove={handleRemove}
          />
        </Html>
      )}
    </>
  );
}
