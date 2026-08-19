import { Suspense, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";

import BGDetail from "@/assets/images/BG_detail.png";
import bagUrl from "@/assets/models/OttomarBag.glb";

import loading1 from "@/assets/icons/loading/loading1.png";
import loading2 from "@/assets/icons/loading/loading2.png";
import loading3 from "@/assets/icons/loading/loading3.png";
import loading4 from "@/assets/icons/loading/loading4.png";
import loading5 from "@/assets/icons/loading/loading5.png";
import loading6 from "@/assets/icons/loading/loading6.png";

const MODEL_URL = bagUrl;

interface ModelPreloaderProps {
  onLoaded: () => void;
}

interface CustomLoadingProps {
  // true이면 화면만 보여주고 preload / navigate는 실행하지 않음
  overlayOnly?: boolean;
}

function ModelPreloader({ onLoaded }: ModelPreloaderProps) {
  useGLTF(MODEL_URL);

  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return null;
}

export default function CustomLoading({ overlayOnly = false }: CustomLoadingProps) {
  const navigate = useNavigate();
  const { search } = useLocation();

  const loadingFrames = [loading1, loading2, loading3, loading4, loading5, loading6];

  const [frameIndex, setFrameIndex] = useState(0);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);

  const handleModelLoaded = useCallback(() => {
    setIsModelLoaded(true);
  }, []);

  // 로고 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % loadingFrames.length);
    }, 180);

    return () => clearInterval(interval);
  }, [loadingFrames.length]);

  // 최소 로딩 시간
  useEffect(() => {
    // CustomMain에서 overlay로 사용하는 경우 실행하지 않음
    if (overlayOnly) {
      return;
    }

    const timer = setTimeout(() => {
      setIsMinTimePassed(true);
    }, 2000);

    return () => clearTimeout(timer);
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

      <div
        className="relative mx-auto flex h-dvh w-full max-w-97.5 flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BGDetail})` }}
      >
        <div className="flex -translate-y-12 flex-col items-center">
          <p className="mb-5 text-sm font-semibold text-[#192C44]">잠시만 기다려주세요</p>

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
        </div>
      </div>
    </>
  );
}
