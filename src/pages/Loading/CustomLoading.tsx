import { Suspense, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";

import BGDetail from "@/assets/images/BG_detail.png";
import bagUrl from "@/assets/models/OttomarBag.glb";

import loading1 from "@/assets/icons/Loading/loading1.png";
import loading2 from "@/assets/icons/Loading/loading2.png";
import loading3 from "@/assets/icons/Loading/loading3.png";
import loading4 from "@/assets/icons/Loading/loading4.png";
import loading5 from "@/assets/icons/Loading/loading5.png";
import loading6 from "@/assets/icons/Loading/loading6.png";

const MODEL_URL = bagUrl;

// 최소 로딩 표시 시간
const MIN_LOADING_DURATION = 2000;

// 로딩 이미지 프레임
const loadingFrames = [loading1, loading2, loading3, loading4, loading5, loading6];

interface ModelPreloaderProps {
  onLoaded: () => void;
}

interface CustomLoadingProps {
  // true이면 전체 로딩 화면만 보여주고
  // preload / navigate는 실행하지 않음
  overlayOnly?: boolean;
}

interface LoadingAnimationProps {
  // true이면 loading6 이미지에 고정함
  fixedLastFrame?: boolean;
}

interface ThreeLoadingOverlayProps {
  // Three.js 렌더링 완료 여부
  isReady: boolean;

  // 최소 로딩 표시 시간
  minDuration?: number;

  // Three.js 준비 + 최소 로딩 시간 완료 후 실행
  onComplete?: () => void;
}

// GLB 모델을 미리 불러오는 컴포넌트
function ModelPreloader({ onLoaded }: ModelPreloaderProps) {
  useGLTF(MODEL_URL);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return null;
}

// 로고 애니메이션만 따로 사용할 수 있는 컴포넌트
export function LoadingAnimation({ fixedLastFrame = false }: LoadingAnimationProps) {
  const [frameIndex, setFrameIndex] = useState(fixedLastFrame ? loadingFrames.length - 1 : 0);

  useEffect(() => {
    // 마지막 프레임 고정 모드
    if (fixedLastFrame) {
      setFrameIndex(loadingFrames.length - 1);

      return;
    }

    // 일반 로딩 애니메이션은 첫 번째 이미지부터 시작
    setFrameIndex(0);

    const interval = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % loadingFrames.length);
    }, 150);

    return () => {
      window.clearInterval(interval);
    };
  }, [fixedLastFrame]);

  return (
    <div className="relative h-28 w-36">
      {loadingFrames.map((frame, index) => (
        <img
          key={frame}
          src={frame}
          alt=""
          aria-hidden={index !== frameIndex}
          className={`
            absolute left-1/2 top-1/2
            h-24 w-28
            -translate-x-1/2 -translate-y-1/2
            object-contain
            ${index === frameIndex ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}
    </div>
  );
}

// Three.js 영역에서 사용하는 로딩 애니메이션
export function ThreeLoadingOverlay({
  isReady,
  minDuration = MIN_LOADING_DURATION,
  onComplete,
}: ThreeLoadingOverlayProps) {
  // 최소 로딩 시간 완료 여부
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);

  // 최종 로딩 완료 여부
  const [isComplete, setIsComplete] = useState(false);

  // 최소 로딩 시간
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsMinTimePassed(true);
    }, minDuration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [minDuration]);

  // Three.js 준비 + 최소 시간 완료
  useEffect(() => {
    if (!isReady || !isMinTimePassed || isComplete) {
      return;
    }

    // 부모에게 가방을 보여줘도 된다고 전달
    onComplete?.();

    // 로딩 애니메이션 제거
    setIsComplete(true);
  }, [isReady, isMinTimePassed, isComplete, onComplete]);

  // 최종 완료되면 로딩 애니메이션 제거
  if (isComplete) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        flex
        items-center
        justify-center
      "
    >
      <LoadingAnimation />
    </div>
  );
}

export default function CustomLoading({ overlayOnly = false }: CustomLoadingProps) {
  const navigate = useNavigate();
  const { search } = useLocation();

  // 모델 로딩 완료 여부
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // 최소 로딩 화면 표시 시간 완료 여부
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);

  const handleModelLoaded = useCallback(() => {
    setIsModelLoaded(true);
  }, []);

  // 최소 로딩 시간
  useEffect(() => {
    // CustomMain에서 overlay로 사용하는 경우 실행하지 않음
    if (overlayOnly) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsMinTimePassed(true);
    }, MIN_LOADING_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [overlayOnly]);

  // 모델 로딩 완료 후 실제 페이지로 이동
  useEffect(() => {
    // CustomMain에서 overlay로 사용하는 경우 이동하지 않음
    if (overlayOnly) {
      return;
    }

    if (!isModelLoaded || !isMinTimePassed) {
      return;
    }

    const searchParams = new URLSearchParams(search);

    const target = searchParams.get("to");

    const targetPath = target === "/custom" || target === "/onetooneorder" ? target : "/custom";

    navigate(targetPath, {
      replace: true,
    });
  }, [overlayOnly, isModelLoaded, isMinTimePassed, navigate, search]);

  return (
    <>
      {/* 실제 로딩 페이지일 때만 GLB preload 실행 */}
      {!overlayOnly && (
        <Suspense fallback={null}>
          <ModelPreloader onLoaded={handleModelLoaded} />
        </Suspense>
      )}

      {/* 전체 로딩 화면 */}
      <div
        className="
          relative mx-auto flex h-dvh w-full max-w-97.5
          flex-col items-center justify-center
          overflow-hidden bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: `url(${BGDetail})`,
        }}
      >
        <div className="flex -translate-y-12 flex-col items-center">
          <p className="mb-5 text-sm font-semibold text-[#192C44]">잠시만 기다려주세요</p>

          {/* overlay일 때는 loading6에 고정 */}
          <LoadingAnimation fixedLastFrame={overlayOnly} />
        </div>
      </div>
    </>
  );
}
