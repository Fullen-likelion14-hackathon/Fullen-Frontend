import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import NoticeToast from "@/components/common/NoticeToast";
import AIPatchResultSlider from "@/components/custom/ai/AIPatchResultSlider";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { useGenerateAIPatch } from "@/hooks/mutations/ai/useGenerateAIPatch";
import { useSavePatch } from "@/hooks/mutations/patch/useSavePatch";
import { useAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";

import { useAIPatchStore } from "@/stores/aiPatchStore";

import type { AIPatchApiType } from "@/types/ai";

type ToastState = {
  type: "created" | "applied";
  message: string;
} | null;

const AIPatchResult = () => {
  const navigate = useNavigate();

  // 현재 중앙 패치 index
  const [currentIndex, setCurrentIndex] = useState(0);

  // 저장 결과 Toast 상태
  const [toast, setToast] = useState<ToastState>(null);

  // 현재 생성 결과 패치 저장 여부
  const [hasSavedPatch, setHasSavedPatch] = useState(false);

  // AI 여행 분석 조회 Query
  const { data: analysis } = useAIAnalysis();

  // AI 패치 재생성 Mutation
  const { mutateAsync: generateAIPatch, isPending: isRegenerating } = useGenerateAIPatch();

  // AI 패치 저장 Mutation
  const { mutateAsync: savePatch, isPending: isSaving } = useSavePatch();

  // 선택 피드 사진 id
  const selectedPhotoId = useAIPatchStore((state) => state.selectedPhotoId);

  // 선택 작가 id
  const selectedArtistId = useAIPatchStore((state) => state.selectedArtistId);

  // 선택 프레임
  const selectedFrame = useAIPatchStore((state) => state.selectedFrame);

  // AI 생성 패치 결과 목록
  const generatedPatches = useAIPatchStore((state) => state.generatedPatches);

  // AI 생성 패치 결과 변경 함수
  const setGeneratedPatches = useAIPatchStore((state) => state.setGeneratedPatches);

  // 저장 패치 추가 함수
  const addSavedPatch = useAIPatchStore((state) => state.addSavedPatch);

  // 동일 AI 생성 결과 저장 여부 확인 함수
  const isPatchSaved = useAIPatchStore((state) => state.isPatchSaved);

  // 현재 중앙 패치
  const currentPatch = generatedPatches[currentIndex];

  // 서버 전송용 프레임 타입
  const apiFrameType: AIPatchApiType | null =
    selectedFrame === "ticket"
      ? "TICKET"
      : selectedFrame === "stamp"
        ? "STAMP"
        : selectedFrame === "label"
          ? "LABEL"
          : null;

  // Toast 자동 종료 처리
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // 생성 결과 존재 여부 확인 처리
  useEffect(() => {
    if (generatedPatches.length > 0) {
      return;
    }

    navigate("/custom/ai-patch/final-check", {
      replace: true,
    });
  }, [generatedPatches.length, navigate]);

  // 현재 패치 index 변경 처리
  const handlePatchChange = (index: number) => {
    setCurrentIndex(index);
  };

  // 현재 선택 AI 패치 저장 처리
  const handleSave = async () => {
    if (!currentPatch || !selectedFrame || !apiFrameType || isSaving) {
      return;
    }

    // 동일 생성 결과 저장 여부 확인
    if (isPatchSaved(currentPatch.id, selectedFrame)) {
      setToast({
        type: "created",
        message: "이미 저장한 패치입니다",
      });

      return;
    }

    try {
      // AI 패치 서버 저장 요청
      const response = await savePatch({
        type: apiFrameType,
        imgUrl: currentPatch.image,
      });

      // Zustand 저장 패치 추가 처리
      addSavedPatch({
        // 프론트 저장 패치 고유 id
        id: String(response.data.patchId),

        // 서버 발급 실제 패치 id
        patchId: response.data.patchId,

        // AI 생성 결과 원본 id
        resultId: currentPatch.id,

        // 서버 저장 패치 이미지 URL
        image: response.data.imgUrl,

        // 생성 시 선택 프레임 타입
        frameType: selectedFrame,
      });

      // 현재 생성 결과 저장 완료 상태
      setHasSavedPatch(true);

      // 저장 완료 Toast 상태
      setToast({
        type: "created",
        message: `패치 ${currentIndex + 1}안을 저장했습니다`,
      });
    } catch (error) {
      console.error("AI 패치 저장 실패", error);

      setToast({
        type: "created",
        message: "패치 저장에 실패했습니다",
      });
    }
  };

  // 현재 선택 옵션 기반 AI 패치 재생성 처리
  const handleRegenerate = async () => {
    if (
      selectedPhotoId === null ||
      selectedArtistId === null ||
      !apiFrameType ||
      !analysis?.travelStyle ||
      isRegenerating
    ) {
      return;
    }

    try {
      // AI 패치 재생성 요청
      const response = await generateAIPatch({
        photoId: selectedPhotoId,
        message: `여행 스타일은 ${analysis.travelStyle}`,
        type: apiFrameType,
        artistId: selectedArtistId,
      });

      // 서버 AI 생성 이미지 URL 목록
      const generatedImages = response.data.answer;

      // Zustand AI 생성 결과 갱신 처리
      setGeneratedPatches(
        generatedImages.map((image, index) => ({
          id: index + 1,
          image,
        })),
      );

      // 중앙 패치 index 초기화 처리
      setCurrentIndex(0);

      // 생성 결과 저장 여부 초기화 처리
      setHasSavedPatch(false);

      // 기존 Toast 초기화 처리
      setToast(null);
    } catch (error) {
      console.error("AI 패치 재생성 실패", error);

      setToast({
        type: "created",
        message: "패치 재생성에 실패했습니다",
      });
    }
  };

  // 커스텀 화면 이동 처리
  const handleMoveCustom = () => {
    navigate("/custom/customizing", {
      state: {
        // 실제 저장 패치 존재 여부
        showPatchCreatedToast: hasSavedPatch,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 저장 결과 Toast 영역 */}
      {toast && (
        <NoticeToast type={toast.type} message={toast.message} positionClassName="top-66" />
      )}

      {/* 상단 헤더 영역 */}
      <PageHeader title="AI 패치 저장" />

      {/* AI 패치 생성 결과 본문 영역 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto pb-8">
        {/* 생성 완료 안내 영역 */}
        <div className="px-8 pt-12 text-center">
          <h2 className="text-2xl font-bold text-[#192C44]">패치 생성을 완료했습니다</h2>

          <p className="mt-2 text-lg font-semibold text-[#8C8C8C]">
            마음에 드는 디자인을 저장해주세요
          </p>

          {/* 디자인 재생성 버튼 */}
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="mx-auto mt-5 flex h-10.5 items-center justify-center gap-2 rounded-full border-2 border-[#D8CCC1] px-6 text-base font-semibold text-[#B89B84] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ↻
            </span>

            {isRegenerating ? "디자인 생성 중" : "디자인 다시 생성하기"}
          </button>
        </div>

        {/* AI 생성 패치 슬라이더 영역 */}
        <div className="mt-10">
          <AIPatchResultSlider
            patches={generatedPatches}
            currentIndex={currentIndex}
            onIndexChange={handlePatchChange}
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-auto px-8 pt-10">
          <CustomStepButton
            onNext={handleSave}
            nextLabel={isSaving ? "저장 중" : "저장하기"}
            disabled={!currentPatch || !selectedFrame || isSaving}
          />

          <button
            type="button"
            onClick={handleMoveCustom}
            className="mt-3 h-14.5 w-full rounded-xl border-2 border-[#A3642B] bg-transparent text-base font-bold text-[#A3642B] shadow-sm"
          >
            커스텀 화면으로 이동하기
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIPatchResult;
