import * as THREE from "three";

import { useEffect, useRef } from "react";

import { Line } from "@react-three/drei";

import { type PlacedInitial, useBagCustomStore } from "@/stores/bagCustomStore";

interface InitialSelectionFrameProps {
  // 현재 선택된 가방 위 이니셜임
  initial: PlacedInitial;

  // 가방 표면 기준 이니셜 회전값임
  rotation: THREE.Euler;

  // 현재 이니셜 실제 Decal 너비임
  width: number;

  // 현재 이니셜 실제 Decal 높이임
  height: number;
}

// 이니셜 최소 크기임
const MIN_INITIAL_SCALE = 0.25;

// 이니셜 최대 크기임
const MAX_INITIAL_SCALE = 1.2;

// 리사이즈 포인터 이동 감도임
const RESIZE_SENSITIVITY = 220;

// 선택 프레임 바깥 여백임
const FRAME_PADDING = 0.04;

// 모서리 터치 영역 크기임
const HANDLE_RADIUS = 0.09;

const InitialSelectionFrame = ({
  initial,
  rotation,
  width,
  height,
}: InitialSelectionFrameProps) => {
  // 리사이즈 시작 화면 좌표 및 시작 크기 저장용 ref임
  const resizeStartRef = useRef<{
    x: number;
    y: number;
    scale: number;
    directionX: number;
    directionY: number;
  } | null>(null);

  // 이니셜 크기 변경 함수임
  const resizeDraftInitial = useBagCustomStore((state) => state.resizeDraftInitial);

  // 이니셜 편집 상태 변경 함수임
  const setIsEditingInitial = useBagCustomStore((state) => state.setIsEditingInitial);

  // 흰색 프레임 가로 절반 크기임
  const halfWidth = width / 2 + FRAME_PADDING;

  // 흰색 프레임 세로 절반 크기임
  const halfHeight = height / 2 + FRAME_PADDING;

  // 흰색 프레임 좌표임
  const framePoints: [number, number, number][] = [
    [-halfWidth, halfHeight, 0.03],
    [halfWidth, halfHeight, 0.03],
    [halfWidth, -halfHeight, 0.03],
    [-halfWidth, -halfHeight, 0.03],
    [-halfWidth, halfHeight, 0.03],
  ];

  // 모서리 리사이즈 시작함
  const handleResizeStart = (
    event: {
      stopPropagation: () => void;
      nativeEvent: PointerEvent;
    },
    directionX: number,
    directionY: number,
  ) => {
    // 가방 드래그 이벤트로 전달되지 않도록 처리함
    event.stopPropagation();

    const nativeEvent = event.nativeEvent;

    // 현재 포인터 캡처함
    const target = nativeEvent.target;

    if (target instanceof Element && "setPointerCapture" in target) {
      try {
        (
          target as Element & {
            setPointerCapture: (pointerId: number) => void;
          }
        ).setPointerCapture(nativeEvent.pointerId);
      } catch {
        // 포인터 캡처 실패 시 기본 window 이벤트 사용함
      }
    }

    // 리사이즈 시작 정보 저장함
    resizeStartRef.current = {
      x: nativeEvent.clientX,
      y: nativeEvent.clientY,
      scale: initial.scale,
      directionX,
      directionY,
    };

    // 리사이즈 중 OrbitControls 잠금함
    setIsEditingInitial(true);
  };

  // 화면 포인터 이동 기준 이니셜 크기 변경함
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const start = resizeStartRef.current;

      if (!start) {
        return;
      }

      // 시작점 대비 현재 포인터 X 이동량임
      const deltaX = event.clientX - start.x;

      // 시작점 대비 현재 포인터 Y 이동량임
      const deltaY = event.clientY - start.y;

      // 선택한 모서리 방향에 맞춰 확대 / 축소 방향 계산함
      const horizontalDelta = deltaX * start.directionX;

      const verticalDelta = deltaY * start.directionY;

      // 대각선 드래그량을 하나의 크기 변화량으로 합침
      const delta = (horizontalDelta + verticalDelta) / RESIZE_SENSITIVITY;

      // 이니셜 최소 / 최대 크기 범위 제한함
      const nextScale = THREE.MathUtils.clamp(
        start.scale + delta,
        MIN_INITIAL_SCALE,
        MAX_INITIAL_SCALE,
      );

      // 선택된 이니셜 크기 변경함
      resizeDraftInitial(initial.id, nextScale);
    };

    // 리사이즈 종료함
    const handlePointerUp = () => {
      if (!resizeStartRef.current) {
        return;
      }

      resizeStartRef.current = null;

      // OrbitControls 잠금 해제함
      setIsEditingInitial(false);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);

    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);

      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [initial.id, resizeDraftInitial, setIsEditingInitial]);

  // 이니셜 위치 계산 전에는 프레임 표시하지 않음
  if (!initial.position) {
    return null;
  }

  return (
    <group position={initial.position} rotation={rotation}>
      {/* 현재 선택 중인 이니셜 흰색 외곽선임 */}
      <Line points={framePoints} color="#FFFFFF" lineWidth={2} />

      {/* 왼쪽 위 리사이즈 영역임 */}
      <mesh
        position={[-halfWidth, halfHeight, 0.04]}
        onPointerDown={(event) => handleResizeStart(event, -1, -1)}
      >
        <circleGeometry args={[HANDLE_RADIUS, 16]} />

        {/* 실제 원은 보이지 않고 터치 영역으로만 사용함 */}
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
      </mesh>

      {/* 오른쪽 위 리사이즈 영역임 */}
      <mesh
        position={[halfWidth, halfHeight, 0.04]}
        onPointerDown={(event) => handleResizeStart(event, 1, -1)}
      >
        <circleGeometry args={[HANDLE_RADIUS, 16]} />

        {/* 실제 원은 보이지 않고 터치 영역으로만 사용함 */}
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
      </mesh>

      {/* 왼쪽 아래 리사이즈 영역임 */}
      <mesh
        position={[-halfWidth, -halfHeight, 0.04]}
        onPointerDown={(event) => handleResizeStart(event, -1, 1)}
      >
        <circleGeometry args={[HANDLE_RADIUS, 16]} />

        {/* 실제 원은 보이지 않고 터치 영역으로만 사용함 */}
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
      </mesh>

      {/* 오른쪽 아래 리사이즈 영역임 */}
      <mesh
        position={[halfWidth, -halfHeight, 0.04]}
        onPointerDown={(event) => handleResizeStart(event, 1, 1)}
      >
        <circleGeometry args={[HANDLE_RADIUS, 16]} />

        {/* 실제 원은 보이지 않고 터치 영역으로만 사용함 */}
        <meshBasicMaterial transparent opacity={0.01} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default InitialSelectionFrame;
