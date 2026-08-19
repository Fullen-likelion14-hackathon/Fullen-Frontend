import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

type AnalysisEditLocationState = {
  // 기존 분석 내용
  analysisText?: string;

  // 분석 완료 후 돌아갈 페이지
  returnTo?: string;
};

export default function AIAnalysisEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as AnalysisEditLocationState | null;

  // 기존 분석 내용
  const initialAnalysis = locationState?.analysisText ?? "";

  // 수정 중인 분석 내용
  const [analysisText, setAnalysisText] = useState(initialAnalysis);

  // 수정 중단 모달 상태
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // 입력값 존재 여부
  const isValid = analysisText.trim().length > 0;

  // 분석하기
  const handleAnalyze = () => {
    if (!isValid) return;

    navigate(locationState?.returnTo ?? "/custom", {
      state: {
        analysisText: analysisText.trim(),
      },
    });
  };

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-97.5 overflow-hidden bg-[#EDE6DF] text-[#192C44]">
      {/* 헤더 */}
      <PageHeader title="여행 스타일 분석 수정하기" backTo="/custom/ai-patch" />

      {/* 큰 반원 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-120 z-0 h-160 w-240 -translate-x-1/2 rounded-[90%] bg-[#F9F4F0]"
      />

      {/* 분석 내용 입력 영역 */}
      <section className="relative z-10 px-7 pb-32 pt-28">
        <div className="relative h-95 w-full">
          <textarea
            value={analysisText}
            onChange={(event) => setAnalysisText(event.target.value)}
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
            "
          />

          {/* 입력값이 없을 때 중앙 안내 문구 */}
          {!analysisText && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[16px] font-semibold text-[#B59780]">
              원하는 분석 내용을 작성해주세요
            </p>
          )}
        </div>
      </section>

      {/* 하단 분석 버튼 */}
      <div className="fixed bottom-20 left-1/2 z-20 w-full max-w-97.5 -translate-x-1/2 bg-[#F9F4F0] px-7 pb-7 pt-3">
        <button
          type="button"
          disabled={!isValid}
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
            ${isValid ? "cursor-pointer bg-[#192C44]" : "cursor-not-allowed bg-[#D2D2D2]"}
          `}
        >
          분석하기
        </button>
      </div>

      {/* 기존 모달 컴포넌트는 여기에서 연결 */}
    </main>
  );
}
