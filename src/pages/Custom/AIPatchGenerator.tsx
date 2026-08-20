import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { AI_ANALYSIS_QUERY_KEY, useAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";

import type { AIAnalysis, AIAnalysisResponse } from "@/types/ai";

import analysisIcon from "@/assets/icons/analysisIcon.png";

type AIPatchGeneratorLocationState = {
  editedAnalysis?: AIAnalysis;
};

const AIPatchGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const locationState = location.state as AIPatchGeneratorLocationState | null;

  // 수정 후 아직 확정하지 않은 임시 분석 결과
  const editedAnalysis = locationState?.editedAnalysis;

  // 기존 AI 여행 분석 조회 Query
  const { data: savedAnalysis, isLoading, isError, refetch } = useAIAnalysis();

  // 수정 결과가 있으면 수정 결과 표시,
  // 없으면 기존 조회 결과 표시
  const analysis = editedAnalysis ?? savedAnalysis;

  // 사용자 분석 페이지 완전히 종료
  const handleBack = () => {
    // 다음에 AI 분석 페이지에 다시 들어왔을 때
    // 서버에서 최신 분석 결과를 새로 조회하도록 캐시 제거
    queryClient.removeQueries({
      queryKey: AI_ANALYSIS_QUERY_KEY,
    });

    navigate("/custom/customizing");
  };

  // AI 패치 생성 시작
  const handleStartGenerate = () => {
    if (!analysis) return;

    // 수정해서 새 분석 결과를 받은 경우에만
    // 이 시점에서 분석 결과를 Query 캐시에 확정
    if (editedAnalysis) {
      queryClient.setQueryData<AIAnalysisResponse>(AI_ANALYSIS_QUERY_KEY, (previous) => ({
        success: previous?.success ?? true,
        code: previous?.code ?? 200,
        message: previous?.message ?? "요청이 성공적으로 처리되었습니다.",
        data: editedAnalysis,
      }));
    }

    navigate("/custom/ai-patch/options");
  };

  // AI 여행 분석 수정 페이지 이동
  const handleEditAnalysis = () => {
    if (!analysis) return;

    navigate("/custom/analysis/edit", {
      state: {
        analysisText: analysis.detail,
      },
    });
  };

  if (isLoading && !analysis) {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#EDE6DF] text-[#19273C]">
        <p className="text-base font-semibold text-[#8C8C8C]">여행 스타일을 분석하고 있습니다</p>
      </main>
    );
  }

  if (isError || !analysis) {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-97.5 flex-col items-center justify-center gap-5 bg-[#EDE6DF] px-8 text-[#19273C]">
        <p className="text-center text-base font-semibold text-[#8C8C8C]">
          여행 스타일 분석 결과를 불러오지 못했습니다
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="h-12 w-full rounded-xl bg-[#19273C] text-base font-bold text-white"
        >
          다시 불러오기
        </button>
      </main>
    );
  }

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#EDE6DF] text-[#19273C]">
      {/* 상단 헤더 */}
      <header className="relative z-20 flex h-31.5 shrink-0 items-end justify-center border-b-[0.4375rem] border-[#A3642B] bg-[#19273C] px-8 pb-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="absolute bottom-7 left-8 flex h-10 w-10 items-center justify-center"
        >
          <span className="block h-5 w-5 rotate-45 border-b-[0.1875rem] border-l-[0.1875rem] border-white" />
        </button>

        <h1 className="text-2xl font-bold text-white">AI 사용자 분석</h1>
      </header>

      {/* 큰 반원 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-140 z-0 h-160 w-240 -translate-x-1/2 rounded-[90%] bg-[#F9F4F0]"
      />

      <section className="relative z-10 h-[calc(100dvh-7.875rem)] overflow-y-auto">
        <div className="mx-auto flex w-full flex-col items-center px-8 pb-14 pt-10">
          <img
            src={analysisIcon}
            alt=""
            aria-hidden="true"
            className="mb-7 h-16 w-16 object-contain"
          />

          <p className="mb-5 text-center text-xl font-bold leading-relaxed">
            <span className="text-[#A3642B]">{analysis.username}</span>
            <span>님의 여행 스타일은</span>
          </p>

          <h2 className="mb-3 text-center text-4xl font-semibold leading-tight">
            {analysis.travelStyle}
          </h2>

          <p className="mb-10 max-w-82.5 whitespace-pre-line text-center text-lg font-semibold leading-relaxed text-[#4C5561]">
            {analysis.detail}
          </p>

          <p className="mb-7 max-w-85 text-center text-lg font-semibold leading-relaxed text-[#B2967E]">
            분석을 바탕으로 <strong className="text-[#A3642B]">3인의 아티스트 추천</strong> 및
            <br />
            <strong className="text-[#A3642B]">맞춤형 트래블 패치</strong>를 제작해드리겠습니다
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {analysis.hashtagList.map((keyword) => (
              <span
                key={keyword}
                className="rounded-md border-2 border-[#D3C0AE] px-2 py-1.5 text-sm font-semibold text-[#B2967E]"
              >
                # {keyword}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleStartGenerate}
            className="mb-3 h-14.5 w-full rounded-xl bg-[#19273C] text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            패치 생성 시작하기
          </button>

          <button
            type="button"
            onClick={handleEditAnalysis}
            className="h-14.5 w-full rounded-xl border-2 border-[#B2967E] bg-white text-base font-bold text-[#B2967E] shadow-sm transition-colors hover:bg-[#F8F2ED]"
          >
            직접 수정하기
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIPatchGenerator;
