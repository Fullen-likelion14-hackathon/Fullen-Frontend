import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import ArtistSelectBox from "@/components/custom/common/selection/ ArtistSelectBox";
import type { SelectedArtist } from "@/components/custom/common/selection/ ArtistSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStep from "@/components/custom/common/step/CustomStep";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

const AIPatchOptionSelect = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 현재 AI 패치 제작 단계임
  const [currentStep, setCurrentStep] = useState(1);

  // 선택한 사진 미리보기 URL임
  const [selectedImage, setSelectedImage] = useState<string>();

  // 작가 선택 페이지에서 받아올 선택 작가 정보임
  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(null);

  // AI 패치는 총 3단계임
  const totalSteps = 3;

  // TODO: 실제 AI 사용자 분석 결과와 연결할 예정임
  const nickname = "멋사";
  const travelStyle = "Urban Minimalist";

  // 페이지를 벗어날 때 생성한 이미지 URL 정리해줌
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // 이전 페이지로 이동함
  const handleBack = () => {
    navigate(-1);
  };

  // 숨겨둔 사진 선택 input을 실행함
  const handleOpenPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  // 사용자가 사진을 선택하면 미리보기 URL 만들어줌
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  // 선택한 사진 삭제함
  const handleRemovePhoto = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 1단계 사진 선택 완료 후 작가 선택 단계로 이동함
  const handlePhotoNext = () => {
    if (!selectedImage) return;

    setCurrentStep(2);
  };

  // 기존 1:1 커스텀 작가 선택 페이지로 이동함
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        returnTo: "/custom/ai-patch/options",
        source: "ai-patch",
      },
    });
  };

  // 선택한 작가 삭제함
  const handleArtistRemove = () => {
    setSelectedArtist(null);
  };

  // 2단계 작가 선택 완료 후 프레임 선택 단계로 이동함
  const handleArtistNext = () => {
    if (!selectedArtist) return;

    setCurrentStep(3);
  };

  // 이전 단계로 이동함
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 상단 헤더 영역임 */}
      <header className="relative flex h-31.5 shrink-0 items-end justify-center border-b-[7px] border-[#A3642B] bg-[#192C44] px-8 pb-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="absolute bottom-7 left-8 flex h-10 w-10 items-center justify-center"
        >
          <span className="block h-5 w-5 rotate-45 border-b-[3px] border-l-[3px] border-white" />
        </button>

        <h1 className="text-2xl font-bold text-white">AI 패치 생성</h1>
      </header>

      {/* 본문 영역임 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto px-8 pb-12 pt-8">
        {/* 사용자 여행 스타일 영역임 */}
        <div className="mb-8 flex items-center justify-between">
          <div className="border-l-4 border-[#B89B84] pl-2">
            <p className="text-lg font-bold leading-tight">{nickname}님의 여행 스타일</p>

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

        {/* 사진 선택 input은 화면에 보이지 않게 숨겨둠 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />

        <div className="flex-1">
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
              <CustomStep step={1} totalSteps={totalSteps} title="사진 선택" status="completed" />

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

          {/* TODO: 3단계 프레임 선택 화면 구현 예정임 */}
          {currentStep === 3 && (
            <div>
              <CustomStep step={1} totalSteps={totalSteps} title="사진 선택" status="completed" />

              <CustomStep step={2} totalSteps={totalSteps} title="작가 선택" status="completed" />

              <CustomStep
                step={3}
                totalSteps={totalSteps}
                title="프레임 선택"
                description="원하는 스타일의 패치 프레임을 선택하세요!"
                status="active"
              />
            </div>
          )}
        </div>

        {/* 1단계 버튼 */}
        {currentStep === 1 && (
          <div className="mt-8">
            <CustomStepButton onNext={handlePhotoNext} disabled={!selectedImage} />
          </div>
        )}

        {/* 2단계 버튼 */}
        {currentStep === 2 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleArtistNext}
              onPrevious={handlePrevious}
              disabled={!selectedArtist}
              showPrevious
            />
          </div>
        )}

        {/* 3단계 버튼은 프레임 선택 구현하면서 연결할 예정임 */}
        {currentStep === 3 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={() => console.log("입력 완료")}
              onPrevious={handlePrevious}
              nextLabel="입력 완료하기"
              disabled
              showPrevious
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default AIPatchOptionSelect;
