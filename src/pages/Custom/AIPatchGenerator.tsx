import { useLocation, useNavigate } from "react-router-dom";

import { aiPatchAnalysisMock } from "@/mocks/aiPatchAnalysis.mock";
import analysisIcon from "@/assets/icons/analysisIcon.png";
import PageHeader from "@/components/common/PageHeader";

const AIPatchGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const analysis = aiPatchAnalysisMock;

  // TODO: 로그인 사용자 정보 연결되면 실제 닉네임으로 변경할 예정임
  const nickname = "멋쟁이사자처럼";

  // 패치 생성 시작 시 사진 선택부터 진행하는 옵션 선택 페이지로 이동함
  const handleStartGenerate = () => {
    navigate("/custom/ai-patch/options");
  };

  // 여행 스타일 분석 수정 페이지로 이동
  const handleEditAnalysis = () => {
    // 기존 분석 내용을 수정 페이지 textarea 초기값으로 전달
    const analysisText = [analysis.description, ...analysis.analysis].join("\n");

    navigate("/custom/analysis/edit", {
      state: {
        analysisText,

        // 수정 완료 후 현재 AI 사용자 분석 페이지로 돌아오기 위함
        returnTo: location.pathname,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#EDE6DF] text-[#19273C]">
      {/* 상단 헤더 영역 */}
      <PageHeader title="AI 사용자 분석" backTo="/custom/customizing" />

      {/* 큰 반원 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-120 z-0 h-160 w-240 -translate-x-1/2 rounded-[90%] bg-[#F9F4F0]"
      />

      {/* 화면 높이가 작은 경우 본문 영역만 스크롤 */}
      <section className="relative z-10 h-[calc(100dvh-126px)] overflow-y-auto">
        <div className="mx-auto flex w-full flex-col items-center px-8 pb-10 pt-5">
          {/* 여행 스타일 분석 아이콘 */}
          <img
            src={analysisIcon}
            alt=""
            aria-hidden="true"
            className="mb-2 h-16 w-16 object-contain"
          />

          {/* 사용자명 + 분석 안내 문구 */}
          <p className="mb-5 text-center text-xl font-bold leading-relaxed">
            <span className="text-[#A3642B]">{nickname}</span>
            <span>님의 여행 스타일은</span>
          </p>

          {/* AI가 분석한 여행 스타일 이름 */}
          <h2 className="mb-3 text-center text-3xl font-extrabold leading-tight">
            {analysis.travelStyle}
          </h2>

          {/* 상세 분석 결과 */}
          <p className="mb-5 max-w-82.5 text-center text-lg font-semibold leading-relaxed text-[#4C5561]">
            {analysis.description}
          </p>

          {/* 여행 스타일 한 줄 설명 */}
          <div className="mb-5 space-y-1 text-center">
            {analysis.analysis.map((text) => (
              <p key={text} className="text-sm font-medium leading-relaxed text-[#8C8C8C]">
                {text}
              </p>
            ))}
          </div>

          {/* AI 분석 결과 키워드 태그 */}
          <div className="mb-15 mx-10 flex flex-wrap justify-center gap-2">
            {analysis.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-md border-2 border-[#D3C0AE] px-2 py-1.5 text-sm font-semibold text-[#B2967E]"
              >
                # {keyword}
              </span>
            ))}
          </div>

          {/* 분석 기반 패치 추천 안내 */}
          <p className="mb-5 max-w-85 text-center text-sm leading-relaxed text-[#B2967E]">
            분석을 바탕으로 <strong className="text-[#A3642B]">3인의 아티스트 추천</strong> 및
            <br />
            <strong className="text-[#A3642B]">맞춤형 트래블 패치</strong>를 제작해드리겠습니다
          </p>

          {/* AI 패치 제작 페이지로 이동 */}
          <button
            type="button"
            onClick={handleStartGenerate}
            className="mb-3 h-14.5 w-full cursor-pointer rounded-xl bg-[#19273C] text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            패치 생성 시작하기
          </button>

          {/* 여행 스타일 분석 수정 페이지로 이동 */}
          <button
            type="button"
            onClick={handleEditAnalysis}
            className="h-14.5 w-full cursor-pointer rounded-xl border-2 border-[#B2967E] bg-white text-base font-bold text-[#B2967E] shadow-sm transition-colors hover:bg-[#F8F2ED]"
          >
            분석 수정하기
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIPatchGenerator;
