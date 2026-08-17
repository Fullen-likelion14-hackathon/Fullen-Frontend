import { useNavigate } from "react-router-dom";

import { aiPatchAnalysisMock } from "@/mocks/aiPatchAnalysis.mock";
import analysisIcon from "@/assets/icons/analysisIcon.png";

const AIPatchGenerator = () => {
  const navigate = useNavigate();

  const analysis = aiPatchAnalysisMock;

  // TODO: 로그인 사용자 정보 연결되면 실제 닉네임으로 변경할 예정임
  const nickname = "멋쟁이사자처럼";

  // 이전 페이지로 이동함
  const handleBack = () => {
    navigate(-1);
  };

  // 패치 생성 시작 시 사진 선택부터 진행하는 옵션 선택 페이지로 이동함
  const handleStartGenerate = () => {
    navigate("/custom/ai-patch/options");
  };

  const handleReanalyze = () => {
    // TODO: 실제 AI 분석 API 연결 후 재요청 로직 추가할 예정임
    console.log("다시 분석");
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#EDE6DF] text-[#19273C]">
      {/* 상단 헤더 영역임 */}
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

      {/* 큰 반원 배경임 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-140 z-0 h-160 w-240 -translate-x-1/2 rounded-[90%] bg-[#F9F4F0]"
      />

      {/* 화면 높이가 작은 경우 본문 영역만 스크롤되게 해줌 */}
      <section className="relative z-10 h-[calc(100dvh-126px)] overflow-y-auto">
        <div className="mx-auto flex w-full flex-col items-center px-8 pb-14 pt-10">
          {/* 여행 스타일 분석을 나타내는 아이콘임 */}
          <img
            src={analysisIcon}
            alt=""
            aria-hidden="true"
            className="mb-7 h-16 w-16 object-contain"
          />

          {/* 사용자명 + 분석 안내 문구임 */}
          <p className="mb-5 text-center text-xl font-bold leading-relaxed">
            <span className="text-[#A3642B]">{nickname}</span>
            <span>님의 여행 스타일은</span>
          </p>

          {/* AI가 분석한 여행 스타일 이름임 */}
          <h2 className="mb-3 text-center text-4xl font-semibold leading-tight">
            {analysis.travelStyle}
          </h2>

          {/* 여행 스타일 한 줄 설명임 */}
          <p className="mb-5 max-w-82.5 text-center text-lg font-semibold leading-relaxed text-[#4C5561]">
            {analysis.description}
          </p>

          {/* 상세 분석 결과 영역임 */}
          <div className="mb-5 space-y-1 text-center">
            {analysis.analysis.map((text) => (
              <p key={text} className="text-base font-medium leading-relaxed text-[#8C8C8C]">
                {text}
              </p>
            ))}
          </div>

          {/* 사용자가 직접 여행 스타일을 수정하는 기능은 추후 연결 예정임 */}
          <button
            type="button"
            disabled
            className="mb-10 flex cursor-not-allowed items-center gap-2 text-base font-semibold text-[#D0D0D0]"
          >
            직접 수정하기
            <span aria-hidden="true">✎</span>
          </button>

          {/* 분석 기반 패치 추천 안내 영역임 */}
          <p className="mb-7 max-w-85 text-center text-lg font-semibold leading-relaxed text-[#B2967E]">
            분석을 바탕으로 <strong className="text-[#A3642B]">3인의 아티스트 추천</strong> 및
            <br />
            <strong className="text-[#A3642B]">맞춤형 트래블 패치</strong>를 제작해드리겠습니다
          </p>

          {/* AI 분석 결과 키워드 태그임 */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {analysis.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-md border-2 border-[#D3C0AE] px-2 py-1.5 text-sm font-semibold text-[#B2967E]"
              >
                # {keyword}
              </span>
            ))}
          </div>

          {/* 사진 선택부터 시작하는 AI 패치 제작 페이지로 이동함 */}
          <button
            type="button"
            onClick={handleStartGenerate}
            className="mb-3 h-14.5 w-full rounded-xl bg-[#19273C] text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            패치 생성 시작하기
          </button>

          {/* AI 사용자 분석을 다시 요청하는 버튼임 */}
          <button
            type="button"
            onClick={handleReanalyze}
            className="h-14.5 w-full rounded-xl border-2 border-[#B2967E] bg-white text-base font-bold text-[#B2967E] shadow-sm transition-colors hover:bg-[#F8F2ED]"
          >
            다시 분석하기
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIPatchGenerator;
