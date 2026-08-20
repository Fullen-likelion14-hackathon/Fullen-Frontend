import * as THREE from "three";

import {
  forwardRef,
  Suspense,
  useEffect,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
} from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Environment } from "@react-three/drei";

import { Product } from "@/components/custom/viewer/Product";

// 카메라 기본 거리
const DEFAULT_DISTANCE = 7;

// 주문 이미지 캡처 거리
const CAPTURE_DISTANCE = 2.8;

// 캡처 카메라 중심점
const CAPTURE_TARGET = new THREE.Vector3(0, 1.5, 0);

// 외부 캡처 제어 타입
export interface OrderCaptureViewerHandle {
  captureFront: () => Promise<Blob>;

  captureBack: () => Promise<Blob>;
}

// 캡처 Viewer Props 타입
interface OrderCaptureViewerProps {
  onReady?: () => void;
}

// 내부 캡처 제어 타입
interface CaptureControllerHandle {
  captureFront: () => Promise<Blob>;

  captureBack: () => Promise<Blob>;
}

// 렌더링 프레임 대기
const waitForFrames = (frameCount: number) =>
  new Promise<void>((resolve) => {
    let currentFrame = 0;

    const wait = () => {
      currentFrame += 1;

      if (currentFrame >= frameCount) {
        resolve();

        return;
      }

      requestAnimationFrame(wait);
    };

    requestAnimationFrame(wait);
  });

// Canvas PNG Blob 변환
const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("커스텀 가방 이미지 생성 실패"));

        return;
      }

      resolve(blob);
    }, "image/png");
  });

// Three.js 렌더링 완료 전달
function SceneReadyReporter({ onReady }: { onReady?: () => void }) {
  const hasReportedRef = useRef(false);

  useFrame(() => {
    if (hasReportedRef.current) {
      return;
    }

    hasReportedRef.current = true;

    requestAnimationFrame(() => {
      onReady?.();
    });
  });

  return null;
}

// 앞면 / 뒷면 캡처 제어
function CaptureController({
  controllerRef,
}: {
  controllerRef: MutableRefObject<CaptureControllerHandle | null>;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const captureSide = async (side: "front" | "back") => {
      // 패치 / 이니셜 위치 복원 대기
      await waitForFrames(4);

      // 기존 카메라 상태 보관
      const previousPosition = camera.position.clone();

      const previousQuaternion = camera.quaternion.clone();

      const previousUp = camera.up.clone();

      // 기존 렌더러 상태 보관
      const previousClearColor = gl.getClearColor(new THREE.Color()).clone();

      const previousClearAlpha = gl.getClearAlpha();

      const previousBackground = scene.background;

      try {
        // 투명 배경 설정
        scene.background = null;

        gl.setClearColor(0x000000, 0);

        // 주문 캡처 카메라 위치 설정
        camera.position.set(0, 1.5, side === "front" ? CAPTURE_DISTANCE : -CAPTURE_DISTANCE);

        camera.up.set(0, 1, 0);

        camera.lookAt(CAPTURE_TARGET);

        camera.updateProjectionMatrix();

        camera.updateMatrixWorld(true);

        scene.updateMatrixWorld(true);

        // 주문 이미지 렌더링
        gl.render(scene, camera);

        // PNG Blob 생성
        return await canvasToBlob(gl.domElement);
      } finally {
        // 기존 카메라 상태 복원
        camera.position.copy(previousPosition);

        camera.quaternion.copy(previousQuaternion);

        camera.up.copy(previousUp);

        camera.updateProjectionMatrix();

        camera.updateMatrixWorld(true);

        // 기존 렌더러 상태 복원
        scene.background = previousBackground;

        gl.setClearColor(previousClearColor, previousClearAlpha);

        gl.render(scene, camera);
      }
    };

    controllerRef.current = {
      captureFront: () => captureSide("front"),

      captureBack: () => captureSide("back"),
    };

    return () => {
      controllerRef.current = null;
    };
  }, [camera, controllerRef, gl, scene]);

  return null;
}

export const OrderCaptureViewer = forwardRef<OrderCaptureViewerHandle, OrderCaptureViewerProps>(
  function OrderCaptureViewer({ onReady }, ref) {
    // 내부 캡처 제어
    const captureControllerRef = useRef<CaptureControllerHandle | null>(null);

    // 외부 캡처 함수 제공
    useImperativeHandle(
      ref,
      () => ({
        captureFront: async () => {
          if (!captureControllerRef.current) {
            throw new Error("앞면 캡처 준비 미완료");
          }

          return captureControllerRef.current.captureFront();
        },

        captureBack: async () => {
          if (!captureControllerRef.current) {
            throw new Error("뒷면 캡처 준비 미완료");
          }

          return captureControllerRef.current.captureBack();
        },
      }),
      [],
    );

    return (
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 1.5, DEFAULT_DISTANCE],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          gl={{
            alpha: true,
            preserveDrawingBuffer: true,
          }}
        >
          {/* 가방 조명 */}
          <directionalLight position={[4, 6, 5]} intensity={1.5} />

          {/* 적용 완료 가방 렌더링 */}
          <Suspense fallback={null}>
            <Product mode="applied" />

            <SceneReadyReporter onReady={onReady} />
          </Suspense>

          {/* GLB 환경광 */}
          <Environment preset="studio" environmentIntensity={0.3} />

          {/* 주문 이미지 캡처 제어 */}
          <CaptureController controllerRef={captureControllerRef} />
        </Canvas>
      </div>
    );
  },
);
