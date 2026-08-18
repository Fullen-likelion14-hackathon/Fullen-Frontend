import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStep from "@/components/custom/common/step/CustomStep";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { recommendedArtists, otherArtists } from "@/components/oneToOneOrder/ArtistData";

// 이전 페이지에서 전달받는 state 타입
type AIPatchOptionLocationState = {
  // 일반 선택 화면에서 사용할 현재 단계
  currentStep?: number;

  // 수정 화면 여부
  mode?: "edit";

  // 수정할 단계
  editStep?: 1 | 2 | 3;

  // 기존 선택값
  selectedImage?: string;
  selectedArtistId?: number;
  selectedFrame?: FrameType;
};

const AIPatchOptionSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이전 페이지에서 전달받은 state
  const locationState = location.state as AIPatchOptionLocationState | null;

  // 수정 모드 여부
  const isEditMode = locationState?.mode === "edit";

  // 수정 대상 단계
  const editStep = locationState?.editStep;

  // 일반 선택 모드에서 사용하는 현재 단계
  const [currentStep, setCurrentStep] = useState(locationState?.currentStep ?? 1);

  // 선택한 사진
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    locationState?.selectedImage,
  );

  // 선택한 작가 id
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
    locationState?.selectedArtistId ?? null,
  );

  // 선택한 프레임
  const [selectedFrame, setSelectedFrame] = useState<FrameType | null>(
    locationState?.selectedFrame ?? null,
  );

  // AI 패치 전체 단계 수
  const totalSteps = 3;

  // TODO: 로그인 사용자 정보 및 AI 분석 결과 연결 예정
  const nickname = "멋사";
  const travelStyle = "Urban Minimalist";

  // 전체 작가 데이터
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 선택한 작가 정보
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 숨겨둔 파일 input 실행
  const handleOpenPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  // 사진 선택 처리
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  // 선택한 사진 삭제
  const handleRemovePhoto = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 사진 선택 완료 후 2단계 이동
  const handlePhotoNext = () => {
    if (!selectedImage) return;

    setCurrentStep(2);
  };

  // 작가 선택 페이지 이동
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        source: "ai-patch",
        returnTo: "/custom/ai-patch/options",

        // 기존 선택값 유지
        selectedImage,
        selectedFrame,

        // 수정 모드 유지
        mode: isEditMode ? "edit" : undefined,
        editStep: isEditMode ? 2 : undefined,
      },
    });
  };

  // 선택한 작가 해제
  const handleArtistRemove = () => {
    setSelectedArtistId(null);
  };

  // 작가 선택 완료 후 3단계 이동
  const handleArtistNext = () => {
    if (!selectedArtist) return;

    setCurrentStep(3);
  };

  // 프레임 선택
  const handleFrameSelect = (frame: FrameType) => {
    setSelectedFrame(frame);
  };

  // 이전 단계 이동
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 일반 선택 완료 후 최종 확인 페이지 이동
  const handleComplete = () => {
    if (!selectedImage || !selectedArtist || !selectedFrame) return;

    navigate("/custom/ai-patch/final-check", {
      state: {
        selectedImage,
        selectedArtistId: selectedArtist.id,
        selectedFrame,
      },
    });
  };

  // 수정 완료 후 최종 확인 페이지 복귀
  const handleEditComplete = () => {
    // 수정 대상 값이 비어있으면 이동하지 않음
    if (editStep === 1 && !selectedImage) return;
    if (editStep === 2 && !selectedArtist) return;
    if (editStep === 3 && !selectedFrame) return;

    navigate("/custom/ai-patch/final-check", {
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
      <PageHeader title="1:1 커스텀 주문" backTo="/custom" />

      {/* 본문 영역 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto px-8 pb-12 pt-8">
        {/* 일반 선택 모드에서만 여행 스타일 표시 */}
        {!isEditMode && (
          <div className="mb-8 flex items-center justify-between">
            <div className="border-l-4 border-[#B89B84] pl-2">
              <p className="text-lg font-bold leading-tight">{nickname}님의 여행 스타일</p>

              <p className="mt-1 text-2xl font-bold leading-none text-[#A3642B]">{travelStyle}</p>
            </div>

            {/* 여행 스타일 정보 */}
            <button
              type="button"
              aria-label="여행 스타일 정보"
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#D8CCC1] text-xl font-bold text-[#D8CCC1]"
            >
              i
            </button>
          </div>
        )}

        {/* 실제 사진 선택 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <div className="flex-1">
          {/* 수정 모드 */}
          {isEditMode && (
            <>
              {/* 사진 수정 */}
              {editStep === 1 && (
                <CustomStep
                  step={1}
                  totalSteps={totalSteps}
                  title="사진 선택"
                  description="나의 여행 중 커스텀할 사진 한장을 고르세요"
                  status="active"
                >
                  <PhotoSelectBox
                    imageUrl={selectedImage}
                    onSelect={handleOpenPhotoPicker}
                    onRemove={handleRemovePhoto}
                  />
                </CustomStep>
              )}

              {/* 작가 수정 */}
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

              {/* 프레임 수정 */}
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

          {/* 일반 선택 모드 */}
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
                  <PhotoSelectBox
                    imageUrl={selectedImage}
                    onSelect={handleOpenPhotoPicker}
                    onRemove={handleRemovePhoto}
                  />
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

        {/* 수정 모드 버튼 */}
        {isEditMode && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleEditComplete}
              nextLabel="수정 완료하기"
              disabled={
                (editStep === 1 && !selectedImage) ||
                (editStep === 2 && !selectedArtist) ||
                (editStep === 3 && !selectedFrame)
              }
            />
          </div>
        )}

        {/* 일반 모드 1단계 버튼 */}
        {!isEditMode && currentStep === 1 && (
          <div className="mt-8">
            <CustomStepButton onNext={handlePhotoNext} disabled={!selectedImage} />
          </div>
        )}

        {/* 일반 모드 2단계 버튼 */}
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

        {/* 일반 모드 3단계 버튼 */}
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
