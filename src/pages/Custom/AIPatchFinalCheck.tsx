import { useLocation, useNavigate } from "react-router-dom";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

// 옵션 선택 페이지에서 전달받는 최종 선택값 타입임
type AIPatchFinalCheckLocationState = {
  selectedImage?: string;
  selectedArtistId?: number;
  selectedFrame?: FrameType;
};

const AIPatchFinalCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 옵션 선택 페이지에서 전달받은 값임
  const locationState = location.state as AIPatchFinalCheckLocationState | null;

  // 최종 확인할 선택값임
  const selectedImage = locationState?.selectedImage;
  const selectedArtistId = locationState?.selectedArtistId;
  const selectedFrame = locationState?.selectedFrame ?? null;

  // TODO: 로그인 사용자 정보 및 AI 분석 결과 연결 예정임
  const nickname = "멋사";
  const travelStyle = "Urban Minimalist";

  // 추천 작가와 다른 작가 데이터를 하나로 합쳐줌
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 선택한 작가 id와 일치하는 실제 작가 정보 찾음
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 이전 페이지 이동함
  const handleBack = () => {
    navigate(-1);
  };

  // 수정할 단계의 선택값을 유지한 채 옵션 선택 페이지로 이동함
  const handleEdit = (step: 1 | 2 | 3) => {
    navigate("/custom/ai-patch/options", {
      state: {
        mode: "edit",
        editStep: step,

        // 수정하지 않는 다른 선택값도 유지해줌
        selectedImage,
        selectedArtistId,
        selectedFrame,
      },
    });
  };

  // 선택한 옵션을 기반으로 AI 패치 생성 결과 페이지로 이동함
  const handleGenerate = () => {
    // TODO: 실제 AI 패치 생성 API 연결 후 응답 결과로 이동하도록 변경 예정임
    navigate("/custom/ai-patch/result", {
      state: {
        selectedImage,
        selectedArtistId,
        selectedFrame,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 상단 헤더 영역 */}
      <header className="relative z-30 flex h-31.5 shrink-0 items-end justify-center border-b-[7px] border-[#A3642B] bg-[#192C44] px-8 pb-6">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="absolute bottom-7 left-8 flex h-10 w-10 items-center justify-center"
        >
          <span className="block h-5 w-5 rotate-45 border-b-[3px] border-l-[3px] border-white" />
        </button>

        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold text-white">AI 패치 생성</h1>
      </header>

      {/* 최종 확인 내용 스크롤 영역 */}
      <section className="h-[calc(100dvh-126px)] overflow-y-auto pb-40">
        {/* 최종 확인 안내 영역 */}
        <div className="relative px-8 pb-8 pt-10 text-center">
          <h2 className="text-2xl font-bold text-black">이대로 패치를 생성할까요?</h2>

          <p className="mt-2 text-base font-semibold text-[#B89B84]">
            선택한 사진, 작가, 프레임을 확인해주세요.
          </p>
        </div>

        <div className="px-6">
          {/* 사용자 여행 스타일 영역 */}
          <div className="mb-5 flex items-center justify-between px-2">
            <div className="border-l-4 border-[#B89B84] pl-2">
              <p className="text-base font-bold leading-tight">{nickname}님의 여행 스타일</p>

              <p className="mt-1 text-2xl font-bold leading-none text-[#A3642B]">{travelStyle}</p>
            </div>

            {/* 여행 스타일 정보 버튼 */}
            <button
              type="button"
              aria-label="여행 스타일 정보"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#D8CCC1] text-xl font-bold text-[#D8CCC1]"
            >
              i
            </button>
          </div>

          {/* 영역 구분선 */}
          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 사진 선택 결과 */}
          <section className="py-5">
            {/* 사진 선택 제목 + 수정 버튼 */}
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                {/* 단계 번호 */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#192C44] text-xl font-semibold text-[#A3642B]">
                  1
                </div>

                <h2 className="text-xl font-bold">사진 선택</h2>
              </div>

              {/* 사진 수정 화면 이동 버튼 */}
              <button
                type="button"
                onClick={() => handleEdit(1)}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44]"
              >
                수정하기
              </button>
            </div>

            {/* 선택한 사진 확인 영역 */}
            <PhotoSelectBox imageUrl={selectedImage} readOnly />
          </section>

          {/* 영역 구분선 */}
          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 작가 선택 결과 */}
          <section className="py-5">
            {/* 작가 선택 제목 + 수정 버튼 */}
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                {/* 단계 번호 */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#192C44] text-xl font-semibold text-[#A3642B]">
                  2
                </div>

                <h2 className="text-xl font-bold">작가 선택</h2>
              </div>

              {/* 작가 수정 화면 이동 버튼 */}
              <button
                type="button"
                onClick={() => handleEdit(2)}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44]"
              >
                수정하기
              </button>
            </div>

            {/* 선택한 작가 확인 영역 */}
            <ArtistSelectBox selectedArtist={selectedArtist} readOnly />
          </section>

          {/* 영역 구분선 */}
          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 프레임 선택 결과 */}
          <section className="py-5">
            {/* 프레임 선택 제목 + 수정 버튼 */}
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                {/* 단계 번호 */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#192C44] text-xl font-semibold text-[#A3642B]">
                  3
                </div>

                <h2 className="text-xl font-bold">프레임 선택</h2>
              </div>

              {/* 프레임 수정 화면 이동 버튼 */}
              <button
                type="button"
                onClick={() => handleEdit(3)}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44]"
              >
                수정하기
              </button>
            </div>

            {/* 선택한 프레임 확인 영역 */}
            <FrameSelectBox selectedFrame={selectedFrame} readOnly />
          </section>
        </div>
      </section>

      {/* 화면 아래에 고정되는 생성 패널 */}
      <div className="absolute inset-x-0 bottom-0 z-40 rounded-t-4xl bg-[#F9F4F0] px-6 pb-7 pt-6 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
        {/* 기존 공통 단계 버튼 재사용함 */}
        <CustomStepButton
          onNext={handleGenerate}
          nextLabel="이대로 생성하기"
          disabled={!selectedImage || !selectedArtist || !selectedFrame}
        />
      </div>
    </main>
  );
};

export default AIPatchFinalCheck;
