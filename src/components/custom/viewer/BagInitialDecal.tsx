import * as THREE from "three";

import { useEffect, useMemo } from "react";

import type { ThreeEvent } from "@react-three/fiber";

import { Decal, Html } from "@react-three/drei";

import PlacedInitialControls from "@/components/custom/initials/PlacedInitialControls";
import InitialSelectionFrame from "@/components/custom/initials/InitialSelectionFrame";

import { type PlacedInitial, useBagCustomStore } from "@/stores/bagCustomStore";

interface BagInitialDecalProps {
  // 가방 위에 표시할 이니셜 상태임
  initial: PlacedInitial;

  // 현재 이니셜 편집 가능 여부임
  editable: boolean;

  // 이니셜 위치 이동 시작 함수임
  onDragStart: (initialId: string) => void;
}

// 이니셜 최소 크기임
const MIN_INITIAL_SCALE = 0.25;

// 이니셜 최대 크기임
const MAX_INITIAL_SCALE = 1.2;

// Canvas 텍스처 기본 높이임
const TEXTURE_HEIGHT = 256;

// Canvas 내부 텍스트 크기임
const FONT_SIZE = 160;

// 이니셜 실제 3D 기본 높이임
const INITIAL_BASE_HEIGHT = 0.45;

export default function BagInitialDecal({ initial, editable, onDragStart }: BagInitialDecalProps) {
  // 현재 선택된 가방 위 이니셜 id임
  const selectedPlacedInitialId = useBagCustomStore((state) => state.selectedPlacedInitialId);

  // 가방 위 이니셜 선택 함수임
  const selectPlacedInitial = useBagCustomStore((state) => state.selectPlacedInitial);

  // 이니셜 크기 변경 함수임
  const resizeDraftInitial = useBagCustomStore((state) => state.resizeDraftInitial);

  // 가방 위 이니셜 삭제 함수임
  const removeDraftInitial = useBagCustomStore((state) => state.removeDraftInitial);

  // 현재 이니셜 선택 여부임
  const isSelected = editable && selectedPlacedInitialId === initial.id;

  // 현재 이니셜 문자열 Canvas Texture 생성함
  const textureData = useMemo(() => {
    // 문자열 측정용 Canvas 생성함
    const measureCanvas = document.createElement("canvas");

    const measureContext = measureCanvas.getContext("2d");

    // Canvas Context 생성 실패 대비값임
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

    // 선택된 굵기를 Canvas font에 적용함
    const canvasFontWeight = initial.fontWeight === "bold" ? 700 : 400;

    measureContext.font = `${canvasFontWeight} ${FONT_SIZE}px sans-serif`;

    // 실제 문자열 너비 측정함
    const measuredTextWidth = measureContext.measureText(initial.text).width;

    // 양쪽 여백 포함 Texture 너비 계산함
    const textureWidth = Math.max(TEXTURE_HEIGHT, Math.ceil(measuredTextWidth + 80));

    // 실제 텍스트 Texture Canvas 생성함
    const canvas = document.createElement("canvas");

    canvas.width = textureWidth;

    canvas.height = TEXTURE_HEIGHT;

    const context = canvas.getContext("2d");

    // Canvas Context 생성 실패 대비값임
    if (!context) {
      const fallbackTexture = new THREE.CanvasTexture(canvas);

      fallbackTexture.colorSpace = THREE.SRGBColorSpace;

      fallbackTexture.needsUpdate = true;

      return {
        texture: fallbackTexture,

        aspectRatio: textureWidth / TEXTURE_HEIGHT,
      };
    }

    // 투명 배경 초기화함
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 실제 텍스트 스타일 적용함
    context.font = `${canvasFontWeight} ${FONT_SIZE}px sans-serif`;

    context.fillStyle = initial.color;

    context.textAlign = "center";

    context.textBaseline = "middle";

    // Canvas에 입력 문자열 그대로 그림
    context.fillText(initial.text, canvas.width / 2, canvas.height / 2);

    // Canvas 기반 Texture 생성함
    const texture = new THREE.CanvasTexture(canvas);

    // 실제 선택 색상 유지함
    texture.colorSpace = THREE.SRGBColorSpace;

    // 별도 방향 보정 없이 기본 Texture 상태 유지함
    texture.needsUpdate = true;

    return {
      texture,

      aspectRatio: textureWidth / TEXTURE_HEIGHT,
    };
  }, [initial.color, initial.fontWeight, initial.text]);

  // Texture 메모리 정리함
  useEffect(() => {
    return () => {
      textureData.texture.dispose();
    };
  }, [textureData.texture]);

  // 최초 위치 계산 전에는 렌더링하지 않음
  if (!initial.position) {
    return null;
  }

  // 저장된 위치값을 Vector3로 변환함
  const decalPosition = new THREE.Vector3(
    initial.position[0],
    initial.position[1],
    initial.position[2],
  );

  // 저장된 가방 표면 normal임
  const normal = new THREE.Vector3(
    initial.normal[0],
    initial.normal[1],
    initial.normal[2],
  ).normalize();

  // Decal 투영 방향 계산함
  const quaternion = new THREE.Quaternion();

  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  // 현재 표면 normal 기준 Decal 회전값 계산함
  const decalRotation = new THREE.Euler().setFromQuaternion(quaternion);

  // 긴 문자열 과도한 폭 증가 방지함
  const aspectRatio = Math.min(textureData.aspectRatio, 6);

  // 현재 이니셜 실제 높이 계산함
  const decalHeight = INITIAL_BASE_HEIGHT * initial.scale;

  // 현재 이니셜 실제 너비 계산함
  const decalWidth = decalHeight * aspectRatio;

  // Decal box 깊이임
  const decalDepth = 0.5;

  // HTML 편집 컨트롤 위치임
  const controlPosition: [number, number, number] = [
    initial.position[0],

    initial.position[1] + decalHeight + 0.12,

    initial.position[2],
  ];

  // 이니셜 선택 및 이동 시작함
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    // 이니셜 편집 모드가 아니면 처리하지 않음
    if (!editable) {
      return;
    }

    // 가방 이벤트로 전달되지 않도록 처리함
    event.stopPropagation();

    // 현재 이니셜 선택함
    selectPlacedInitial(initial.id);

    // 현재 이니셜 이동 시작함
    onDragStart(initial.id);
  };

  // 이니셜 크기 축소함
  const handleDecreaseSize = () => {
    const nextScale = Math.max(MIN_INITIAL_SCALE, initial.scale - 0.1);

    resizeDraftInitial(initial.id, nextScale);
  };

  // 이니셜 크기 확대함
  const handleIncreaseSize = () => {
    const nextScale = Math.min(MAX_INITIAL_SCALE, initial.scale + 0.1);

    resizeDraftInitial(initial.id, nextScale);
  };

  // 현재 가방 위 이니셜 제거함
  const handleRemove = () => {
    removeDraftInitial(initial.id);
  };

  return (
    <>
      {/* 실제 가방 표면에 붙는 이니셜 Decal임 */}
      <Decal
        position={[decalPosition.x, decalPosition.y, decalPosition.z]}
        rotation={decalRotation}
        scale={[decalWidth, decalHeight, decalDepth]}
        onPointerDown={handlePointerDown}
      >
        {/* 선택한 색상을 조명 영향 없이 그대로 출력함 */}
        <meshBasicMaterial
          map={textureData.texture}
          transparent
          alphaTest={0.01}
          depthTest
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-10}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </Decal>

      {/* 선택된 이니셜 흰색 외곽선 및 모서리 리사이즈 영역임 */}
      {isSelected && (
        <InitialSelectionFrame
          initial={initial}
          rotation={decalRotation}
          width={decalWidth}
          height={decalHeight}
        />
      )}

      {/* 선택된 이니셜 편집 컨트롤임 */}
      {isSelected && (
        <Html
          position={controlPosition}
          center
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
