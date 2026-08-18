import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import LocationSelectBox from "@/components/custom/common/selection/LocationSelectBox";
import RequestTextBox from "@/components/custom/common/selection/RequestTextBox";

import CustomStep from "@/components/custom/common/step/CustomStep";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import type { PatchLocation } from "@/components/custom/common/selection/LocationSelectBox";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

type CustomRequestLocationState = {
  // 작가 선택 페이지에서 전달받은 작가 id
  selectedArtistId?: number;

  // 이전 단계에서 선택한 사진
  selectedImage?: string;

  // 현재 진행 단계
  currentStep?: number;

  // 위치 선택 페이지에서 전달받은 위치
  selectedLocation?: PatchLocation;

  // 작성 중이던 요청사항
  requestText?: string;
};

const CustomRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const locationState = location.state as CustomRequestLocationState | null;

  // 1:1 커스텀 주문은 총 4단계
  const totalSteps = 4;

  // 현재 단계
  const [currentStep, setCurrentStep] = useState(locationState?.currentStep ?? 1);

  // 선택한 사진
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    locationState?.selectedImage,
  );

  // 선택한 작가 id
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
    locationState?.selectedArtistId ?? null,
  );

  // 선택한 위치
  const [selectedLocation, setSelectedLocation] = useState<PatchLocation | null>(
    locationState?.selectedLocation ?? null,
  );

  // 요청사항
  const [requestText, setRequestText] = useState(locationState?.requestText ?? "");

  // 추천 작가 + 다른 작가
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 선택된 작가 정보
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 사진 선택창 열기
  const handleOpenPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  // 사진 선택
  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  // 사진 삭제
  const handleRemovePhoto = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 1단계 → 2단계
  const handlePhotoNext = () => {
    if (!selectedImage) return;

    setCurrentStep(2);
  };

  // 작가 선택 페이지 이동
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        source: "onetoone",
        returnTo: "/onetooneorder/request",

        selectedImage,
        selectedArtistId,
        currentStep: 2,
        selectedLocation,
        requestText,
      },
    });
  };

  // 작가 선택 해제
  const handleArtistRemove = () => {
    setSelectedArtistId(null);
  };

  // 2단계 → 3단계
  const handleArtistNext = () => {
    if (!selectedArtist) return;

    setCurrentStep(3);
  };

  // 위치 선택 페이지 이동
  const handleLocationSelect = () => {
    navigate("/onetooneorder/location", {
      state: {
        returnTo: "/onetooneorder/request",

        selectedImage,
        selectedArtistId,
        currentStep: 3,
        selectedLocation,
        requestText,
      },
    });
  };

  // 위치 선택 해제
  const handleLocationRemove = () => {
    setSelectedLocation(null);
  };

  // 3단계 → 4단계
  const handleLocationNext = () => {
    if (!selectedLocation) return;

    setCurrentStep(4);
  };

  // 이전 단계
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 최종 입력 완료
  const handleSubmit = () => {
    if (!requestText.trim()) return;

    navigate("/onetooneorder/confirm", {
      state: {
        selectedImage,
        selectedArtistId,
        selectedLocation,
        requestText,
      },
    });
    //  API 연결 후 완료 페이지로 이동
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 헤더 */}
      <PageHeader title="1:1 커스텀 주문" backTo="/onetooneorder" />

      {/* 사진 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* 본문 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto px-8 pb-12 pt-10">
        <div className="flex-1">
          {/* 1단계 */}
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

          {/* 2단계 */}
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

          {/* 3단계 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <CustomStep step={1} totalSteps={totalSteps} title="사진 선택" status="completed" />

              <CustomStep step={2} totalSteps={totalSteps} title="작가 선택" status="completed" />

              <CustomStep
                step={3}
                totalSteps={totalSteps}
                title="위치 선택"
                description="커스텀 받을 위치를 선택해주세요."
                status="active"
              >
                <LocationSelectBox
                  selectedLocation={selectedLocation}
                  onSelect={handleLocationSelect}
                  onRemove={handleLocationRemove}
                />
              </CustomStep>
            </div>
          )}

          {/* 4단계 */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <CustomStep step={1} totalSteps={totalSteps} title="사진 선택" status="completed" />

              <CustomStep step={2} totalSteps={totalSteps} title="작가 선택" status="completed" />

              <CustomStep step={3} totalSteps={totalSteps} title="위치 선택" status="completed" />

              <CustomStep
                step={4}
                totalSteps={totalSteps}
                title="요청사항 작성"
                description="작가님에게 요청사항을 입력해주세요!"
                status="active"
              >
                <RequestTextBox value={requestText} onChange={setRequestText} />
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
              onNext={handleLocationNext}
              onPrevious={handlePrevious}
              disabled={!selectedLocation}
              showPrevious
            />
          </div>
        )}

        {/* 4단계 버튼 */}
        {currentStep === 4 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleSubmit}
              onPrevious={handlePrevious}
              nextLabel="입력 완료하기"
              disabled={!requestText.trim()}
              showPrevious
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default CustomRequest;
