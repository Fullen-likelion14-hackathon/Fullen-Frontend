import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import WarningModal from "@/components/common/modal/WarningModal";

import { useRetryAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";

type AnalysisEditLocationState = {
  analysisText?: string;
};

export default function AIAnalysisEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as AnalysisEditLocationState | null;

  const [analysisText, setAnalysisText] = useState(locationState?.analysisText ?? "");

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const { mutateAsync: retryAnalysis, isPending } = useRetryAIAnalysis();

  const isValid = analysisText.trim().length > 0;

  const handleAnalyze = async () => {
    if (!isValid || isPending) return;

    try {
      const response = await retryAnalysis({
        request: analysisText.trim(),
      });

      navigate("/custom/ai-patch", {
        replace: true,
        state: {
          editedAnalysis: response.data,
        },
      });
    } catch (error) {
      console.error("AI 여행 분석 재분석 실패", error);
    }
  };

  const handleExit = () => {
    setIsExitModalOpen(false);
    navigate("/custom/ai-patch");
  };

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-97.5 overflow-hidden bg-[#EDE6DF] text-[#192C44]">
      <PageHeader title="여행 스타일 분석 수정하기" onBackClick={() => setIsExitModalOpen(true)} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-120 z-0 h-160 w-240 -translate-x-1/2 rounded-[90%] bg-[#F9F4F0]"
      />

      <section className="relative z-10 px-7 pb-32 pt-28">
        <div className="relative h-95 w-full">
          <textarea
            value={analysisText}
            onChange={(event) => setAnalysisText(event.target.value)}
            disabled={isPending}
            className="
              h-full
              w-full
              resize-none
              rounded-[10px]
              border-2
              border-[#D4C8BE]
              bg-white
              p-6
              text-[16px]
              font-semibold
              leading-7
              text-[#465264]
              outline-none
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          {!analysisText && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[16px] font-semibold text-[#B59780]">
              원하는 분석 내용을 작성해주세요
            </p>
          )}
        </div>
      </section>

      <div className="fixed bottom-20 left-1/2 z-20 w-full max-w-97.5 -translate-x-1/2 bg-[#F9F4F0] px-7 pb-7 pt-3">
        <button
          type="button"
          disabled={!isValid || isPending}
          onClick={handleAnalyze}
          className={`
            h-16
            w-full
            rounded-[12px]
            text-[20px]
            font-bold
            text-white
            shadow-md
            transition
            ${
              isValid && !isPending
                ? "cursor-pointer bg-[#192C44]"
                : "cursor-not-allowed bg-[#D2D2D2]"
            }
          `}
        >
          {isPending ? "분석 중..." : "분석하기"}
        </button>
      </div>

      <WarningModal
        isOpen={isExitModalOpen}
        title="수정을 중단하시겠습니까?"
        description={"지금까지 수정한 내용은\n저장되지 않습니다."}
        primaryButtonText="수정 중단하기"
        secondaryButtonText="계속 수정하기"
        onPrimaryClick={handleExit}
        onSecondaryClick={() => setIsExitModalOpen(false)}
        onClose={() => setIsExitModalOpen(false)}
      />
    </main>
  );
}
