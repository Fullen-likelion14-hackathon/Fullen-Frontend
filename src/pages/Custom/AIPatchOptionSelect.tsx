import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStep from "@/components/custom/common/step/CustomStep";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";

import { recommendedArtists, otherArtists } from "@/components/oneToOneOrder/ArtistData";

type AIPatchOptionLocationState = {
  // 작가 선택 페이지에서 전달받은 작가 id임
  selectedArtistId?: number;

  // 작가 선택 페이지 이동 전 선택했던 사진임
  selectedImage?: string;

  // 작가 선택 후 돌아올 현재 단계임
  currentStep?: number;
};

const AIPatchOptionSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 작가 선택 페이지에서 돌아온 state값임
  const locationState = location.state as AIPatchOptionLocationState | null;

  // 현재 AI 패치 제작 단계임
  const [currentStep, setCurrentStep] = useState(locationState?.currentStep ?? 1);

  // 선택한 사진 미리보기 URL임
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    locationState?.selectedImage,
  );

  // 작가 선택 페이지에서 전달받은 작가 id임
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
    locationState?.selectedArtistId ?? null,
  );
  // 사용자가 선택한 패치 프레임임
  const [selectedFrame, setSelectedFrame] = useState<FrameType | null>(null);
  // AI 패치는 총 3단계임
  const totalSteps = 3;

  // TODO: 실제 AI 사용자 분석 결과와 연결할 예정임
  const nickname = "멋사";
  const travelStyle = "Urban Minimalist";

  // 추천 작가와 다른 작가 데이터를 하나의 배열로 합침
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 선택한 id에 해당하는 실제 작가 정보를 찾음
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 이전 페이지로 이동함
  const handleBack = () => {
    navigate(-1);
  };

  // 숨겨둔 파일 input 실행함
  const handleOpenPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  // 사용자가 사진을 선택하면 미리보기 URL 만들어줌
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 이전 이미지 URL이 있으면 제거해줌
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

  // 사진 선택 완료 후 작가 선택 단계로 이동함
  const handlePhotoNext = () => {
    if (!selectedImage) return;

    setCurrentStep(2);
  };

  // 기존 1:1 커스텀 작가 선택 페이지를 재사용함
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        source: "ai-patch",
        returnTo: "/custom/ai-patch/options",

        // 작가 선택 페이지를 갔다 와도 기존 사진 유지해줌
        selectedImage,
      },
    });
  };

  // 선택한 작가 삭제함
  const handleArtistRemove = () => {
    setSelectedArtistId(null);
  };

  // 작가 선택 완료 후 프레임 선택 단계로 이동함
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
  // 패치 프레임을 선택함
  const handleFrameSelect = (frame: FrameType) => {
    setSelectedFrame(frame);
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

        {/* 사진 선택 input은 화면에서 숨겨둠 */}
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

          {/* 3단계 프레임 선택 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              {/* 1단계 완료 상태 */}
              <CustomStep step={1} totalSteps={totalSteps} title="사진 선택" status="completed" />

              {/* 2단계 완료 상태 */}
              <CustomStep step={2} totalSteps={totalSteps} title="작가 선택" status="completed" />

              {/* 현재 진행 중인 3단계 */}
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

        {/* 3단계 버튼 */}
        {currentStep === 3 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={() => console.log("입력 완료", selectedFrame)}
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
