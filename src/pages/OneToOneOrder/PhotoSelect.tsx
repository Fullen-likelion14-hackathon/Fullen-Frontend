import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import { usePhotos } from "@/hooks/queries/photo/usePhotos";

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

export default function PhotoSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as PhotoSelectLocationState | null;

  // 유저 전체 사진 조회
  const { data: photos = [], isPending: isPhotosPending, isError: isPhotosError } = usePhotos();

  // 현재 선택한 사진 id
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(
    locationState?.selectedPhotoId ?? null,
  );

  // 사진 선택 / 선택 취소
  const handlePhotoSelect = (photoId: number) => {
    setSelectedPhotoId((prev) => (prev === photoId ? null : photoId));
  };

  // 사진 선택 완료
  const handleSelectComplete = () => {
    if (selectedPhotoId === null) return;

    // API로 조회한 사진 목록에서 선택한 사진 찾기
    const selectedPhoto = photos.find((photo) => photo.photoId === selectedPhotoId);

    if (!selectedPhoto) return;

    navigate(locationState?.returnTo ?? "/onetooneorder/request", {
      state: {
        // 실제 API에서 받은 사진 id
        selectedPhotoId: selectedPhoto.photoId,

        // 실제 API에서 받은 사진 URL
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
      <section className="h-[calc(100dvh-12.875rem)] overflow-y-auto pb-4">
        {/* 로딩 */}
        {isPhotosPending && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#727272]">사진을 불러오는 중입니다.</p>
          </div>
        )}

        {/* 조회 실패 */}
        {isPhotosError && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#727272]">사진을 불러오지 못했습니다.</p>
          </div>
        )}

        {/* 사진이 없는 경우 */}
        {!isPhotosPending && !isPhotosError && photos.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#727272]">등록된 사진이 없습니다.</p>
          </div>
        )}

        {/* 사진 목록 */}
        {!isPhotosPending && !isPhotosError && photos.length > 0 && (
          <div className="grid grid-cols-4 gap-0.5">
            {photos.map((photo) => {
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
        )}
      </section>

      {/* 하단 선택 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F9F4F0] px-7 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          disabled={selectedPhotoId === null || isPhotosPending}
          onClick={handleSelectComplete}
          className={`h-16 w-full rounded-[1.125rem] text-[1.25rem] font-bold text-white shadow-md transition ${
            selectedPhotoId === null || isPhotosPending
              ? "cursor-not-allowed bg-[#D2D2D2]"
              : "bg-[#192C44]"
          }`}
        >
          사진 선택하기
        </button>
      </div>
    </main>
  );
}
