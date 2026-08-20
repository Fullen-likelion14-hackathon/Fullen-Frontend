import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import { ProductViewer } from "@/components/custom/viewer/ProductViewer";

import { ThreeLoadingOverlay } from "@/pages/Loading/CustomLoading";

import floorBg from "@/assets/images/Floor.png";

import type { PatchLocation } from "@/types/patchLocation";

type LocationSelectState = {
  // 선택한 사진 id
  selectedPhotoId?: number;

  // 선택한 사진 URL
  selectedImage?: string;

  // 선택한 작가 id
  selectedArtistId?: number;

  // 작성 중인 요청사항
  requestText?: string;

  // 위치 선택 완료 후 돌아갈 경로
  returnTo?: string;

  // 기존에 선택한 위치
  selectedLocation?: PatchLocation;
};

export default function LocationSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationSelectState | null;

  // 현재 선택한 패치 위치
  const [selectedLocation, setSelectedLocation] = useState<PatchLocation | null>(
    locationState?.selectedLocation ?? null,
  );

  // Three.js 첫 렌더링 완료 여부
  const [isThreeReady, setIsThreeReady] = useState(false);

  // 로딩 완료 후 가방 표시 여부
  const [isThreeVisible, setIsThreeVisible] = useState(false);

  // 위치 선택 완료
  const handleLocationSelect = () => {
    if (!selectedLocation) return;

    navigate(locationState?.returnTo ?? "/onetooneorder/request", {
      state: {
        // 기존에 선택한 사진 id 유지
        selectedPhotoId: locationState?.selectedPhotoId,

        // 기존에 선택한 사진 URL 유지
        selectedImage: locationState?.selectedImage,

        // 기존에 선택한 작가 유지
        selectedArtistId: locationState?.selectedArtistId,

        // 기존 요청사항 유지
        requestText: locationState?.requestText,

        // 새로 선택한 위치 전달
        selectedLocation,

        // 위치 선택 단계로 돌아감
        currentStep: 3,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      {/* 헤더 */}
      <div className="relative z-20">
        <PageHeader title="위치 선택" backTo="/onetooneorder/request" />
      </div>

      {/* 배경 */}
      <img
        src={floorBg}
        alt=""
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-0
          h-auto
          w-155
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          opacity-60
        "
      />

      {/* 본문 */}
      <section className="relative z-10 flex h-[calc(100dvh-7.875rem)] flex-col px-6 pt-12">
        {/* 제품 정보 */}
        <div className="relative z-20 text-center">
          <h2 className="text-[1.5rem] font-extrabold text-[#192C44]">Ottomar 비세토스 위켄더</h2>

          <p className="text-[1.125rem] font-bold text-[#9197A0]">50.5 cm (19.9 in)</p>
        </div>

        {/* 3D 가방 영역 */}
        <div className="absolute inset-0">
          {/* Three.js는 뒤에서 미리 렌더링하고 화면에서는 숨김 */}
          <div
            className={`
              absolute inset-0 z-0
              transition-opacity duration-300
              ${
                isThreeVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }
            `}
          >
            <ProductViewer
              mode="location-select"
              onLocationChange={setSelectedLocation}
              onReady={() => setIsThreeReady(true)}
            />
          </div>

          {/* Three.js 준비 중 로딩 애니메이션 */}
          <ThreeLoadingOverlay isReady={isThreeReady} onComplete={() => setIsThreeVisible(true)} />
        </div>

        {/* 안내 문구 */}
        <p className="relative z-20 mt-100 text-center text-[1.25rem] font-bold leading-8 text-[#9197A0]">
          커스텀 받고싶은 위치에
          <br />
          흰색 프레임을 올려놓아주세요
        </p>

        {/* 위치 선택 버튼 */}
        <button
          type="button"
          onClick={handleLocationSelect}
          disabled={!selectedLocation}
          className={`
            absolute
            bottom-8
            left-6
            right-6
            z-20
            h-16
            rounded-xl
            text-[1.25rem]
            font-bold
            text-white
            shadow-md
            ${selectedLocation ? "bg-[#192C44]" : "cursor-not-allowed bg-[#D9D9D9]"}
          `}
        >
          위치 선택하기
        </button>
      </section>
    </main>
  );
}
