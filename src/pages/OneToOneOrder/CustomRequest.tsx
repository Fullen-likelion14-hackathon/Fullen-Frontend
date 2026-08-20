import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import LocationSelectBox from "@/components/custom/common/selection/LocationSelectBox";
import RequestTextBox from "@/components/custom/common/selection/RequestTextBox";

import CustomStep from "@/components/custom/common/step/CustomStep";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { useArtists } from "@/hooks/queries/artist/useArtists";
import { useBag, useBags } from "@/hooks/queries/useBags";

import type { Artist } from "@/types/artist";
import type { PatchLocation } from "@/types/patchLocation";

type CustomRequestLocationState = {
  // 사진 선택 페이지에서 전달받은 사진 id
  selectedPhotoId?: number;

  // 선택한 사진 URL
  selectedImage?: string;

  // 작가 선택 페이지에서 전달받은 작가 id
  selectedArtistId?: number;

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

  const locationState = location.state as CustomRequestLocationState | null;

  // 1:1 커스텀 주문은 총 4단계
  const totalSteps = 4;

  // 현재 단계
  const [currentStep, setCurrentStep] = useState(locationState?.currentStep ?? 1);

  // 선택한 사진 id
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(
    locationState?.selectedPhotoId ?? null,
  );

  // 선택한 사진 URL
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

  // 사용자 소유 가방 목록 조회
  const { data: bags = [] } = useBags();

  // 현재 서비스에서는 소유 가방 한 개를 커스텀 대상으로 사용
  const userBagId = bags[0]?.userBagId;

  // 가방 상세 조회
  // 앞면 / 뒷면 이미지를 위치 선택 미리보기에 사용
  const { data: bagDetail } = useBag(userBagId);

  // 작가 리스트 조회
  // ArtistSelectBox에서 필요한 대표 이미지(imgUrl)도 리스트 API에서 가져옴
  const { data: artists = [], isPending: isArtistsPending, isError: isArtistsError } = useArtists();

  // 리스트에서 현재 선택한 작가 찾기
  const selectedArtist: Artist | null =
    artists.find((artist) => artist.artistId === selectedArtistId) ?? null;

  // 사진 선택 페이지 이동
  const handlePhotoSelect = () => {
    navigate("/onetooneorder/photo", {
      state: {
        returnTo: "/onetooneorder/request",

        // 기존 선택값 유지
        selectedPhotoId,
        selectedImage,
        selectedArtistId,
        selectedLocation,
        requestText,
      },
    });
  };

  // 사진 선택 해제
  const handleRemovePhoto = () => {
    setSelectedPhotoId(null);
    setSelectedImage(undefined);
  };

  // 1단계 → 2단계
  const handlePhotoNext = () => {
    if (selectedPhotoId === null || !selectedImage) {
      return;
    }

    setCurrentStep(2);
  };

  // 작가 선택 페이지 이동
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        source: "onetoone",
        returnTo: "/onetooneorder/request",

        // 사진 정보 유지
        selectedPhotoId,
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
    if (selectedArtistId === null) return;
    if (isArtistsPending || isArtistsError) return;
    if (!selectedArtist) return;

    setCurrentStep(3);
  };

  // 위치 선택 페이지 이동
  const handleLocationSelect = () => {
    navigate("/onetooneorder/location", {
      state: {
        returnTo: "/onetooneorder/request",

        // 사진 정보 유지
        selectedPhotoId,
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

  // 최종 제출 가능 여부
  const isSubmitDisabled =
    !requestText.trim() ||
    selectedPhotoId === null ||
    selectedArtistId === null ||
    !selectedLocation;

  // 최종 입력 완료
  const handleSubmit = () => {
    if (!requestText.trim()) return;
    if (selectedPhotoId === null) return;
    if (selectedArtistId === null) return;
    if (!selectedLocation) return;

    navigate("/onetooneorder/confirm", {
      state: {
        // 최종 주문 API에 필요한 값들
        selectedPhotoId,
        selectedImage,
        selectedArtistId,
        selectedLocation,
        requestText,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 헤더 */}
      <PageHeader title="1:1 커스텀 주문" backTo="/onetooneorder" />

      {/* 본문 */}
      <section className="flex h-[calc(100dvh-7.875rem)] flex-col overflow-y-auto px-8 pb-12 pt-10">
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
                onSelect={handlePhotoSelect}
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
                  bagFrontImgUrl={bagDetail?.bagFrontImgUrl}
                  bagBackImgUrl={bagDetail?.bagBackImgUrl}
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
            <CustomStepButton
              onNext={handlePhotoNext}
              disabled={selectedPhotoId === null || !selectedImage}
            />
          </div>
        )}

        {/* 2단계 버튼 */}
        {currentStep === 2 && (
          <div className="mt-8">
            <CustomStepButton
              onNext={handleArtistNext}
              onPrevious={handlePrevious}
              disabled={
                selectedArtistId === null || isArtistsPending || isArtistsError || !selectedArtist
              }
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
              disabled={isSubmitDisabled}
              showPrevious
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default CustomRequest;
