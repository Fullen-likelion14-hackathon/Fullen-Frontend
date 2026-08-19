import { useNavigate } from "react-router-dom";

import { useAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";

import analysisIcon from "@/assets/icons/analysisIcon.png";

const AIPatchGenerator = () => {
  const navigate = useNavigate();

  // AI 여행 분석 조회 Query
  const { data: analysis, isLoading, isError, refetch, isFetching } = useAIAnalysis();

  // 이전 페이지 이동 처리
  const handleBack = () => {
    navigate(-1);
  };

  // AI 패치 옵션 선택 페이지 이동 처리
  const handleStartGenerate = () => {
    navigate("/custom/ai-patch/options");
  };

  // AI 여행 분석 재조회 처리
  const handleReanalyze = () => {
    refetch();
  };

  // AI 여행 분석 조회 로딩 화면
  if (isLoading) {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#EDE6DF] text-[#19273C]">
        <p className="text-base font-semibold text-[#8C8C8C]">여행 스타일을 분석하고 있습니다</p>
      </main>
    );
  }

  // AI 여행 분석 조회 실패 화면
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
      {/* 상단 헤더 영역 */}
      <header className="relative z-20 flex h-31.5 shrink-0 items-end justify-center border-b-[7px] border-[#A3642B] bg-[#19273C] px-8 pb-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="absolute bottom-7 left-8 flex h-10 w-10 items-center justify-center"
        >
          <span className="block h-5 w-5 rotate-45 border-b-[3px] border-l-[3px] border-white" />
        </button>

        <h1 className="text-2xl font-bold text-white">AI 사용자 분석</h1>
      </header>

      {/* 큰 반원 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-140 z-0 h-160 w-240 -translate-x-1/2 rounded-[90%] bg-[#F9F4F0]"
      />

      {/* AI 여행 분석 본문 영역 */}
      <section className="relative z-10 h-[calc(100dvh-126px)] overflow-y-auto">
        <div className="mx-auto flex w-full flex-col items-center px-8 pb-14 pt-10">
          {/* 여행 스타일 분석 아이콘 */}
          <img
            src={analysisIcon}
            alt=""
            aria-hidden="true"
            className="mb-7 h-16 w-16 object-contain"
          />

          {/* 사용자 이름 및 분석 안내 영역 */}
          <p className="mb-5 text-center text-xl font-bold leading-relaxed">
            <span className="text-[#A3642B]">{analysis.username}</span>

            <span>님의 여행 스타일은</span>
          </p>

          {/* AI 여행 스타일 이름 */}
          <h2 className="mb-3 text-center text-4xl font-semibold leading-tight">
            {analysis.travelStyle}
          </h2>

          {/* AI 여행 스타일 상세 설명 */}
          <p className="mb-5 max-w-82.5 whitespace-pre-line text-center text-lg font-semibold leading-relaxed text-[#4C5561]">
            {analysis.detail}
          </p>

          {/* 사용자 여행 스타일 수정 버튼 영역 */}
          <button
            type="button"
            disabled
            className="mb-10 flex cursor-not-allowed items-center gap-2 text-base font-semibold text-[#D0D0D0]"
          >
            직접 수정하기
            <span aria-hidden="true">✎</span>
          </button>

          {/* AI 패치 추천 안내 영역 */}
          <p className="mb-7 max-w-85 text-center text-lg font-semibold leading-relaxed text-[#B2967E]">
            분석을 바탕으로 <strong className="text-[#A3642B]">3인의 아티스트 추천</strong> 및
            <br />
            <strong className="text-[#A3642B]">맞춤형 트래블 패치</strong>를 제작해드리겠습니다
          </p>

          {/* AI 여행 분석 해시태그 영역 */}
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

          {/* AI 패치 생성 시작 버튼 */}
          <button
            type="button"
            onClick={handleStartGenerate}
            className="mb-3 h-14.5 w-full rounded-xl bg-[#19273C] text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            패치 생성 시작하기
          </button>

          {/* AI 여행 분석 재조회 버튼 */}
          <button
            type="button"
            onClick={handleReanalyze}
            disabled={isFetching}
            className="h-14.5 w-full rounded-xl border-2 border-[#B2967E] bg-white text-base font-bold text-[#B2967E] shadow-sm transition-colors hover:bg-[#F8F2ED] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetching ? "분석 결과 불러오는 중" : "다시 분석하기"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIPatchGenerator;
