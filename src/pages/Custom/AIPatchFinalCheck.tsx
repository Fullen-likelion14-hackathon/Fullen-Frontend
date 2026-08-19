import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

import { useAIPatchStore } from "@/stores/aiPatchStore";

const AIPatchFinalCheck = () => {
  const navigate = useNavigate();

  // AI 패치 선택값을 Zustand에서 가져옴
  const selectedImage = useAIPatchStore((state) => state.selectedImage);

  const selectedArtistId = useAIPatchStore((state) => state.selectedArtistId);

  const selectedFrame = useAIPatchStore((state) => state.selectedFrame);

  // TODO: 로그인 사용자 정보 및 AI 분석 결과 연결 예정임
  const nickname = "멋사";
  const travelStyle = "Urban Minimalist";

  // 전체 작가 데이터를 합쳐줌
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 선택한 작가 정보 찾음
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 수정할 단계로 이동함
  const handleEdit = (step: 1 | 2 | 3) => {
    navigate("/custom/ai-patch/options", {
      state: {
        mode: "edit",
        editStep: step,
      },
    });
  };

  // AI 패치 생성 결과 페이지로 이동함
  const handleGenerate = () => {
    // TODO: 실제 AI 패치 생성 API 연결 예정임
    navigate("/custom/ai-patch/result");
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 상단 헤더 영역임 */}
      <PageHeader title="AI 패치 생성" backTo="/custom/customizing" />
      {/* 최종 확인 스크롤 영역임 */}
      <section className="h-[calc(100dvh-126px)] overflow-y-auto pb-40">
        <div className="relative px-8 pb-8 pt-10 text-center">
          <h2 className="text-2xl font-bold text-black">이대로 패치를 생성할까요?</h2>

          <p className="mt-2 text-base font-semibold text-[#B89B84]">
            선택한 사진, 작가, 프레임을 확인해주세요.
          </p>
        </div>

        <div className="px-6">
          {/* 여행 스타일 영역임 */}
          <div className="mb-5 flex items-center justify-between px-2">
            <div className="border-l-4 border-[#B89B84] pl-2">
              <p className="text-base font-bold leading-tight">{nickname}님의 여행 스타일</p>

              <p className="mt-1 text-2xl font-bold leading-none text-[#A3642B]">{travelStyle}</p>
            </div>

            <button
              type="button"
              aria-label="여행 스타일 정보"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#D8CCC1] text-xl font-bold text-[#D8CCC1]"
            >
              i
            </button>
          </div>

          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 사진 선택 결과임 */}
          <section className="py-5">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#192C44] text-xl font-semibold text-[#A3642B]">
                  1
                </div>

                <h2 className="text-xl font-bold">사진 선택</h2>
              </div>

              <button
                type="button"
                onClick={() => handleEdit(1)}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44]"
              >
                수정하기
              </button>
            </div>

            <PhotoSelectBox imageUrl={selectedImage} readOnly />
          </section>

          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 작가 선택 결과임 */}
          <section className="py-5">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#192C44] text-xl font-semibold text-[#A3642B]">
                  2
                </div>

                <h2 className="text-xl font-bold">작가 선택</h2>
              </div>

              <button
                type="button"
                onClick={() => handleEdit(2)}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44]"
              >
                수정하기
              </button>
            </div>

            <ArtistSelectBox selectedArtist={selectedArtist} readOnly />
          </section>

          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 프레임 선택 결과임 */}
          <section className="py-5">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#192C44] text-xl font-semibold text-[#A3642B]">
                  3
                </div>

                <h2 className="text-xl font-bold">프레임 선택</h2>
              </div>

              <button
                type="button"
                onClick={() => handleEdit(3)}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44]"
              >
                수정하기
              </button>
            </div>

            <FrameSelectBox selectedFrame={selectedFrame} readOnly />
          </section>
        </div>
      </section>

      {/* 하단 생성 버튼 영역임 */}
      <div className="absolute inset-x-0 bottom-0 z-40 rounded-t-4xl bg-[#F9F4F0] px-6 pb-7 pt-6 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
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
