import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { useGenerateAIPatch } from "@/hooks/mutations/ai/useGenerateAIPatch";
import { useAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";
import { useArtists } from "@/hooks/queries/artist/useArtists";

import { useAIPatchStore } from "@/stores/aiPatchStore";

import type { AIPatchApiType } from "@/types/ai";

const AIPatchFinalCheck = () => {
  const navigate = useNavigate();

  // AI 여행 분석 조회 Query
  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
  } = useAIAnalysis();

  // AI 패치 생성 Mutation
  const { mutateAsync: generateAIPatch, isPending: isGenerating } = useGenerateAIPatch();

  // 선택 피드 사진 id
  const selectedPhotoId = useAIPatchStore((state) => state.selectedPhotoId);

  // 선택 피드 사진 이미지 URL
  const selectedImage = useAIPatchStore((state) => state.selectedImage);

  // 선택 작가 id
  const selectedArtistId = useAIPatchStore((state) => state.selectedArtistId);

  // 선택 프레임
  const selectedFrame = useAIPatchStore((state) => state.selectedFrame);

  // AI 생성 결과 저장 함수
  const setGeneratedPatches = useAIPatchStore((state) => state.setGeneratedPatches);

  // 작가 리스트 API 조회
  const { data: artists = [], isPending: isArtistsPending, isError: isArtistsError } = useArtists();

  // API 작가 리스트 선택 작가 정보
  const selectedArtist = artists.find((artist) => artist.artistId === selectedArtistId) ?? null;

  // AI 분석 사용자 이름
  const nickname = analysis?.username ?? "";

  // AI 분석 여행 스타일
  const travelStyle = analysis?.travelStyle ?? "";

  // 서버 전송용 프레임 타입
  const apiFrameType: AIPatchApiType | null =
    selectedFrame === "ticket"
      ? "TICKET"
      : selectedFrame === "stamp"
        ? "STAMP"
        : selectedFrame === "label"
          ? "LABEL"
          : null;

  // 수정 대상 단계 이동 처리
  const handleEdit = (step: 1 | 2 | 3) => {
    navigate("/custom/ai-patch/options", {
      state: {
        mode: "edit",
        editStep: step,
      },
    });
  };

  // AI 패치 생성 요청 처리
  const handleGenerate = async () => {
    if (
      selectedPhotoId === null ||
      selectedArtistId === null ||
      !apiFrameType ||
      !travelStyle ||
      isGenerating
    ) {
      return;
    }

    try {
      // AI 패치 생성 요청
      const response = await generateAIPatch({
        photoId: selectedPhotoId,
        message: `여행 스타일은 ${travelStyle}`,
        type: apiFrameType,
        artistId: selectedArtistId,
      });

      // 서버 AI 생성 이미지 URL 목록
      const generatedImages = response.data.answer;

      // Zustand AI 생성 결과 저장 처리
      setGeneratedPatches(
        generatedImages.map((image, index) => ({
          id: index + 1,
          image,
        })),
      );

      // AI 패치 결과 페이지 이동 처리
      navigate("/custom/ai-patch/result");
    } catch (error) {
      console.error("AI 패치 생성 실패", error);
    }
  };

  // AI 패치 생성 가능 여부
  const isGenerateDisabled =
    selectedPhotoId === null ||
    !selectedImage ||
    selectedArtistId === null ||
    !selectedArtist ||
    !selectedFrame ||
    !analysis ||
    isAnalysisLoading ||
    isAnalysisError ||
    isArtistsPending ||
    isArtistsError ||
    isGenerating;

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 상단 헤더 영역 */}
      <PageHeader title="AI 패치 생성" />

      {/* 최종 확인 스크롤 영역 */}
      <section className="h-[calc(100dvh-126px)] overflow-y-auto pb-40">
        <div className="relative px-8 pb-8 pt-10 text-center">
          <h2 className="text-2xl font-bold text-black">이대로 패치를 생성할까요?</h2>

          <p className="mt-2 text-base font-semibold text-[#B89B84]">
            선택한 사진, 작가, 프레임을 확인해주세요.
          </p>
        </div>

        <div className="px-6">
          {/* 여행 스타일 영역 */}
          <div className="mb-5 flex items-center justify-between px-2">
            <div className="border-l-4 border-[#B89B84] pl-2">
              {/* AI 분석 로딩 상태 */}
              {isAnalysisLoading && (
                <>
                  <p className="text-base font-bold leading-tight text-[#8C8C8C]">
                    여행 스타일 분석 정보
                  </p>

                  <p className="mt-1 text-xl font-bold leading-none text-[#B89B84]">불러오는 중</p>
                </>
              )}

              {/* AI 분석 실패 상태 */}
              {isAnalysisError && (
                <>
                  <p className="text-base font-bold leading-tight text-[#8C8C8C]">
                    여행 스타일 분석 정보
                  </p>

                  <p className="mt-1 text-xl font-bold leading-none text-[#B89B84]">조회 실패</p>
                </>
              )}

              {/* AI 분석 조회 완료 상태 */}
              {!isAnalysisLoading && !isAnalysisError && analysis && (
                <>
                  <p className="text-base font-bold leading-tight">{nickname}님의 여행 스타일</p>

                  <p className="mt-1 text-2xl font-bold leading-none text-[#A3642B]">
                    {travelStyle}
                  </p>
                </>
              )}
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

          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 사진 선택 결과 영역 */}
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
                disabled={isGenerating}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44] disabled:cursor-not-allowed disabled:opacity-50"
              >
                수정하기
              </button>
            </div>

            <PhotoSelectBox imageUrl={selectedImage} readOnly />
          </section>

          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 작가 선택 결과 영역 */}
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
                disabled={isGenerating}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44] disabled:cursor-not-allowed disabled:opacity-50"
              >
                수정하기
              </button>
            </div>

            {/* 작가 조회 로딩 상태 */}
            {isArtistsPending && (
              <div className="flex h-29 w-full items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white">
                <p className="text-sm font-semibold text-[#B89B84]">
                  작가 정보를 불러오는 중입니다
                </p>
              </div>
            )}

            {/* 작가 조회 실패 상태 */}
            {isArtistsError && (
              <div className="flex h-29 w-full items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white">
                <p className="text-sm font-semibold text-[#B89B84]">
                  작가 정보를 불러오지 못했습니다
                </p>
              </div>
            )}

            {/* 작가 조회 완료 상태 */}
            {!isArtistsPending && !isArtistsError && (
              <ArtistSelectBox selectedArtist={selectedArtist} readOnly />
            )}
          </section>

          <div className="h-0.5 w-full bg-[#DFCAB7]" />

          {/* 프레임 선택 결과 영역 */}
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
                disabled={isGenerating}
                className="rounded-md border-2 border-[#B89B84] px-3 py-1.5 text-sm font-bold text-[#192C44] disabled:cursor-not-allowed disabled:opacity-50"
              >
                수정하기
              </button>
            </div>

            <FrameSelectBox selectedFrame={selectedFrame} readOnly />
          </section>
        </div>
      </section>

      {/* 하단 생성 버튼 영역 */}
      <div className="absolute inset-x-0 bottom-0 z-40 rounded-t-4xl bg-[#F9F4F0] px-6 pb-7 pt-6 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
        <CustomStepButton
          onNext={handleGenerate}
          nextLabel={isGenerating ? "패치 생성 중" : "이대로 생성하기"}
          disabled={isGenerateDisabled}
        />
      </div>
    </main>
  );
};

export default AIPatchFinalCheck;
