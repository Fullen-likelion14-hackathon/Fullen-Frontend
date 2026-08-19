import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import samplePhoto from "@/assets/images/country.png";

import type { PatchLocation } from "@/types/patchLocation";

type PhotoSelectLocationState = {
  returnTo?: string;

  // 기존에 선택한 값 유지
  selectedPhotoId?: number;
  selectedImage?: string;
  selectedArtistId?: number;
  selectedLocation?: PatchLocation;
  requestText?: string;
};

// API 연결 전 임시 사진 데이터
const mockPhotos = [
  {
    photoId: 1,
    imgURL: samplePhoto,
  },
  {
    photoId: 2,
    imgURL: samplePhoto,
  },
  {
    photoId: 3,
    imgURL: samplePhoto,
  },
  {
    photoId: 4,
    imgURL: samplePhoto,
  },
  {
    photoId: 5,
    imgURL: samplePhoto,
  },
  {
    photoId: 6,
    imgURL: samplePhoto,
  },
  {
    photoId: 7,
    imgURL: samplePhoto,
  },
  {
    photoId: 8,
    imgURL: samplePhoto,
  },
  {
    photoId: 9,
    imgURL: samplePhoto,
  },
  {
    photoId: 10,
    imgURL: samplePhoto,
  },
  {
    photoId: 11,
    imgURL: samplePhoto,
  },
  {
    photoId: 12,
    imgURL: samplePhoto,
  },
];

export default function PhotoSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as PhotoSelectLocationState | null;

  // 현재 선택한 사진 id
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(
    locationState?.selectedPhotoId ?? null,
  );

  // 사진 선택
  const handlePhotoSelect = (photoId: number) => {
    setSelectedPhotoId((prev) => (prev === photoId ? null : photoId));
  };

  // 사진 선택 완료
  const handleSelectComplete = () => {
    if (selectedPhotoId === null) return;

    const selectedPhoto = mockPhotos.find((photo) => photo.photoId === selectedPhotoId);

    if (!selectedPhoto) return;

    navigate(locationState?.returnTo ?? "/onetooneorder/request", {
      state: {
        // 선택한 사진
        selectedPhotoId: selectedPhoto.photoId,
        selectedImage: selectedPhoto.imgURL,

        // 기존 입력값 유지
        selectedArtistId: locationState?.selectedArtistId,
        selectedLocation: locationState?.selectedLocation,
        requestText: locationState?.requestText,

        // 사진 선택 단계로 돌아감
        currentStep: 1,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 헤더 */}
      <PageHeader title="전체 사진" backTo="/onetooneorder/request" />

      {/* 사진 목록 */}
      <section className="h-[calc(100dvh-206px)] overflow-y-auto pb-4">
        <div className="grid grid-cols-4 gap-0.5">
          {mockPhotos.map((photo) => {
            const isSelected = selectedPhotoId === photo.photoId;

            return (
              <button
                key={photo.photoId}
                type="button"
                onClick={() => handlePhotoSelect(photo.photoId)}
                className="relative aspect-square overflow-hidden"
              >
                <img
                  src={photo.imgURL}
                  alt={`사진 ${photo.photoId}`}
                  className="h-full w-full object-cover"
                />

                {/* 선택된 사진 표시 */}
                {isSelected && (
                  <div className="absolute inset-0 border-4 border-[#192C44] bg-[#192C44]/10" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 하단 선택 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F9F4F0] px-7 pb-7 pt-3">
        <button
          type="button"
          disabled={selectedPhotoId === null}
          onClick={handleSelectComplete}
          className={`h-16 w-full rounded-[18px] text-[20px] font-bold text-white shadow-md transition ${
            selectedPhotoId === null ? "cursor-not-allowed bg-[#D2D2D2]" : "bg-[#192C44]"
          }`}
        >
          사진 선택하기
        </button>
      </div>
    </main>
  );
}
