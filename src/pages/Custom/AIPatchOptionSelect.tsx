import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStep from "@/components/custom/common/step/CustomStep";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

import { useAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";
import { usePhotos } from "@/hooks/queries/photo/usePhotos";

import { useAIPatchStore } from "@/stores/aiPatchStore";

import type { Photo } from "@/types/photo";

// 최종 확인 페이지 수정 모드 Location State 타입
type AIPatchOptionLocationState = {
  // 일반 선택 화면 현재 단계
  currentStep?: number;

  // 수정 모드 여부
  mode?: "edit";

  // 수정 대상 단계
  editStep?: 1 | 2 | 3;
};

const AIPatchOptionSelect = () => {
  const navigate = useNavigate();

  const location = useLocation();

  // 이전 페이지 전달 Location State
  const locationState = location.state as AIPatchOptionLocationState | null;

  // 수정 모드 여부
  const isEditMode = locationState?.mode === "edit";

  // 수정 대상 단계
  const editStep = locationState?.editStep;

  // 일반 선택 모드 현재 단계
  const [currentStep, setCurrentStep] = useState(locationState?.currentStep ?? 1);

  // AI 여행 분석 조회 Query
  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
  } = useAIAnalysis();

  // 사용자 피드 사진 목록 조회 Query
  const {
    data: photos,
    isLoading: isPhotosLoading,
    isError: isPhotosError,
    refetch: refetchPhotos,
  } = usePhotos();

  // 선택 피드 사진 id
  const selectedPhotoId = useAIPatchStore((state) => state.selectedPhotoId);

  // 선택 피드 사진 이미지 URL
  const selectedImage = useAIPatchStore((state) => state.selectedImage);

  // 선택 작가 id
  const selectedArtistId = useAIPatchStore((state) => state.selectedArtistId);

  // 선택 프레임
  const selectedFrame = useAIPatchStore((state) => state.selectedFrame);

  // 피드 사진 선택 함수
  const setSelectedPhoto = useAIPatchStore((state) => state.setSelectedPhoto);

  // 피드 사진 선택 초기화 함수
  const clearSelectedPhoto = useAIPatchStore((state) => state.clearSelectedPhoto);

  // 작가 선택값 변경 함수
  const setSelectedArtistId = useAIPatchStore((state) => state.setSelectedArtistId);

  // 프레임 선택값 변경 함수
  const setSelectedFrame = useAIPatchStore((state) => state.setSelectedFrame);

  // AI 패치 전체 단계 수
  const totalSteps = 3;

  // AI 분석 사용자 이름
  const nickname = analysis?.username ?? "";

  // AI 분석 여행 스타일
  const travelStyle = analysis?.travelStyle ?? "";

  // 전체 작가 데이터
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 현재 선택 작가 정보
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 피드 사진 선택 처리
  const handlePhotoSelect = (photo: Photo) => {
    setSelectedPhoto(photo.photoId, photo.imgURL);
  };

  // 선택 피드 사진 해제 처리
  const handleRemovePhoto = () => {
    clearSelectedPhoto();
  };

  // 사진 선택 완료 후 작가 선택 단계 이동 처리
  const handlePhotoNext = () => {
    if (selectedPhotoId === null || !selectedImage) {
      return;
    }

    setCurrentStep(2);
  };

  // 공통 작가 선택 페이지 이동 처리
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        source: "ai-patch",
        returnTo: "/custom/ai-patch/options",

        // 수정 모드 유지 정보
        mode: isEditMode ? "edit" : undefined,

        // 작가 수정 단계 유지 정보
        editStep: isEditMode ? 2 : undefined,
      },
    });
  };

  // 선택 작가 해제 처리
  const handleArtistRemove = () => {
    setSelectedArtistId(null);
  };

  // 작가 선택 완료 후 프레임 선택 단계 이동 처리
  const handleArtistNext = () => {
    if (!selectedArtist) {
      return;
    }

    setCurrentStep(3);
  };

  // 프레임 선택 처리
  const handleFrameSelect = (frame: FrameType) => {
    setSelectedFrame(frame);
  };

  // 이전 단계 이동 처리
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 일반 선택 완료 후 최종 확인 페이지 이동 처리
  const handleComplete = () => {
    if (selectedPhotoId === null || !selectedImage || !selectedArtist || !selectedFrame) {
      return;
    }

    // Zustand 선택값 기반 최종 확인 페이지 이동
    navigate("/custom/ai-patch/final-check");
  };

  // 수정 완료 후 최종 확인 페이지 복귀 처리
  const handleEditComplete = () => {
    if (editStep === 1 && (selectedPhotoId === null || !selectedImage)) {
      return;
    }

    if (editStep === 2 && !selectedArtist) {
      return;
    }

    if (editStep === 3 && !selectedFrame) {
      return;
    }

    navigate("/custom/ai-patch/final-check");
  };

  // 사진 목록 선택 영역
  const renderPhotoList = () => {
    if (isPhotosLoading) {
      return (
        <div className="flex min-h-70 items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white">
          <p className="text-sm font-semibold text-[#B89B84]">여행 사진을 불러오는 중입니다</p>
        </div>
      );
    }

    if (isPhotosError) {
      return (
        <div className="flex min-h-70 flex-col items-center justify-center gap-4 rounded-xl border-2 border-[#D8CCC1] bg-white px-5">
          <p className="text-center text-sm font-semibold text-[#B89B84]">
            여행 사진을 불러오지 못했습니다
          </p>

          <button
            type="button"
            onClick={() => refetchPhotos()}
            className="h-10 rounded-lg border-2 border-[#B89B84] px-5 text-sm font-bold text-[#A3642B]"
          >
            다시 불러오기
          </button>
        </div>
      );
    }

    if (!photos || photos.length === 0) {
      return (
        <div className="flex min-h-70 items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white px-5">
          <p className="text-center text-sm font-semibold leading-relaxed text-[#B89B84]">
            등록된 여행 사진이 없습니다
            <br />
            피드에 여행 사진을 먼저 등록해주세요
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => {
          // 현재 사진 선택 여부
          const isSelected = photo.photoId === selectedPhotoId;

          return (
            <button
              key={photo.photoId}
              type="button"
              onClick={() => handlePhotoSelect(photo)}
              aria-label={`여행 사진 ${photo.photoId} 선택`}
              aria-pressed={isSelected}
              className={`
                relative
                aspect-square
                overflow-hidden
                rounded-xl
                border-2
                bg-white
                transition
                ${isSelected ? "border-[#192C44] shadow-md" : "border-[#D8CCC1]"}
              `}
            >
              <img src={photo.imgURL} alt="" className="h-full w-full object-cover" />

              {/* 현재 선택 사진 표시 영역 */}
              {isSelected && (
                <div className="pointer-events-none absolute inset-0 border-3 border-white/70" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // 사진 선택 단계 본문
  const renderPhotoSelection = () => {
    if (selectedImage && selectedPhotoId !== null) {
      return (
        <div className="flex flex-col gap-4">
          {/* 현재 선택 사진 미리보기 */}
          <PhotoSelectBox imageUrl={selectedImage} onRemove={handleRemovePhoto} />

          {/* 다른 사진 선택 안내 */}
          <p className="text-center text-sm font-semibold text-[#B89B84]">
            다른 사진을 선택하려면 현재 사진을 삭제해주세요
          </p>
        </div>
      );
    }

    return renderPhotoList();
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 상단 헤더 영역 */}
      <PageHeader title="AI 패치 생성" backTo="/custom/customizing" />

      {/* 본문 영역 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto px-8 pb-12 pt-8">
        {/* 일반 선택 모드 여행 스타일 영역 */}
        {!isEditMode && (
          <div className="mb-8 flex items-center justify-between">
            <div className="border-l-4 border-[#B89B84] pl-2">
              {/* AI 분석 로딩 상태 */}
              {isAnalysisLoading && (
                <>
                  <p className="text-lg font-bold leading-tight text-[#8C8C8C]">
                    여행 스타일 분석 정보
                  </p>

                  <p className="mt-1 text-lg font-bold leading-none text-[#B89B84]">불러오는 중</p>
                </>
              )}

              {/* AI 분석 실패 상태 */}
              {isAnalysisError && (
                <>
                  <p className="text-lg font-bold leading-tight text-[#8C8C8C]">
                    여행 스타일 분석 정보
                  </p>

                  <p className="mt-1 text-lg font-bold leading-none text-[#B89B84]">조회 실패</p>
                </>
              )}

              {/* AI 분석 조회 완료 상태 */}
              {!isAnalysisLoading && !isAnalysisError && analysis && (
                <>
                  <p className="text-lg font-bold leading-tight">{nickname}님의 여행 스타일</p>

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
        )}

        <div className="flex-1">
          {/* 수정 모드 영역 */}
          {isEditMode && (
            <>
              {/* 사진 수정 단계 */}
              {editStep === 1 && (
                <CustomStep
                  step={1}
                  totalSteps={totalSteps}
                  title="사진 선택"
                  description="나의 여행 중 커스텀할 사진 한장을 고르세요"
                  status="active"
                >
                  {renderPhotoSelection()}
                </CustomStep>
              )}

              {/* 작가 수정 단계 */}
              {editStep === 2 && (
                <CustomStep
                  step={2}
                  totalSteps={totalSteps}
                  title="작가 선택"
                  description="이 여행을 어떤 작가의 시선으로 담아볼까요?"
                  status="active"
                >
                  <ArtistSelectBox
                    selectedArtist={selectedArtist}
                    onSelect={handleArtistSelect}
                    onRemove={handleArtistRemove}
                  />
                </CustomStep>
              )}

              {/* 프레임 수정 단계 */}
              {editStep === 3 && (
                <CustomStep
                  step={3}
                  totalSteps={totalSteps}
                  title="프레임 선택"
                  description="원하는 스타일의 패치 프레임을 선택하세요!"
                  status="active"
                >
                  <FrameSelectBox selectedFrame={selectedFrame} onSelect={handleFrameSelect} />
                </CustomStep>
              )}
            </>
          )}

          {/* 일반 선택 모드 영역 */}
          {!isEditMode && (
            <>
              {/* 1단계 사진 선택 */}
              {currentStep === 1 && (
                <CustomStep
                  step={1}
                  totalSteps={totalSteps}
                  title="사진 선택"
                  description="나의 여행 중 커스텀할 사진 한장을 고르세요"
                  status="active"
                >
                  {renderPhotoSelection()}
                </CustomStep>
              )}

              {/* 2단계 작가 선택 */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-4">
                  <CustomStep
                    step={1}
                    totalSteps={totalSteps}
                    title="사진 선택"
                    status="completed"
                  />

                  <CustomStep
                    step={2}
                    totalSteps={totalSteps}
                    title="작가 선택"
                    description="이 여행을 어떤 작가의 시선으로 담아볼까요?"
                    status="active"
                  >
                    <ArtistSelectBox
                      selectedArtist={selectedArtist}
                      onSelect={handleArtistSelect}
                      onRemove={handleArtistRemove}
                    />
                  </CustomStep>
                </div>
              )}

              {/* 3단계 프레임 선택 */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-4">
                  <CustomStep
                    step={1}
                    totalSteps={totalSteps}
                    title="사진 선택"
                    status="completed"
                  />

                  <CustomStep
                    step={2}
                    totalSteps={totalSteps}
                    title="작가 선택"
                    status="completed"
                  />

                  <CustomStep
                    step={3}
                    totalSteps={totalSteps}
                    title="프레임 선택"
                    description="원하는 스타일의 패치 프레임을 선택하세요!"
                    status="active"
                  >
                    <FrameSelectBox selectedFrame={selectedFrame} onSelect={handleFrameSelect} />
                  </CustomStep>
                </div>
              )}
            </>
          )}
        </div>

        {/* 수정 완료 버튼 영역 */}
        {isEditMode && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleEditComplete}
              nextLabel="수정 완료하기"
              disabled={
                (editStep === 1 && (selectedPhotoId === null || !selectedImage)) ||
                (editStep === 2 && !selectedArtist) ||
                (editStep === 3 && !selectedFrame)
              }
            />
          </div>
        )}

        {/* 일반 모드 1단계 버튼 영역 */}
        {!isEditMode && currentStep === 1 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handlePhotoNext}
              disabled={selectedPhotoId === null || !selectedImage}
            />
          </div>
        )}

        {/* 일반 모드 2단계 버튼 영역 */}
        {!isEditMode && currentStep === 2 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleArtistNext}
              onPrevious={handlePrevious}
              disabled={!selectedArtist}
              showPrevious
            />
          </div>
        )}

        {/* 일반 모드 3단계 버튼 영역 */}
        {!isEditMode && currentStep === 3 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleComplete}
              onPrevious={handlePrevious}
              nextLabel="입력 완료하기"
              disabled={!selectedFrame}
              showPrevious
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default AIPatchOptionSelect;
