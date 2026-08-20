import bagImage from "@/assets/images/testBag.png";

import ConfirmStep from "@/components/custom/common/step/ConfirmStep";

import type { Artist } from "@/types/artist";
import type { PatchLocation } from "@/types/patchLocation";

interface OrderDetailContentProps {
  selectedImage?: string;

  // 주문 확인 페이지에서 사용하는 작가 리스트 데이터
  selectedArtist?: Artist | null;

  // 주문 상세 조회 API에서 사용하는 작가 데이터
  artistName?: string;
  artistImage?: string;
  artistIntro?: string;

  // 주문 확인 페이지에서 사용하는 위치 데이터
  selectedLocation?: PatchLocation;

  // 주문 상세 조회 API에서 사용하는 2D 위치 데이터
  previewX?: number;
  previewY?: number;

  requestText: string;

  // 주문 확인 페이지에서만 수정하기 사용
  onEdit?: (step: number) => void;
}

export default function OrderDetailContent({
  selectedImage,
  selectedArtist,
  artistName,
  artistImage,
  artistIntro,
  selectedLocation,
  previewX,
  previewY,
  requestText,
  onEdit,
}: OrderDetailContentProps) {
  // 주문 확인 페이지 / 주문 상세 페이지 모두 대응
  const displayArtistName = selectedArtist?.artistName ?? artistName;

  const displayArtistImage = selectedArtist?.imgUrl ?? artistImage;

  const displayArtistIntro = selectedArtist?.introSummary ?? artistIntro;

  const displayNationImage = selectedArtist?.nationImgUrl;

  // 주문 확인 페이지에서는 selectedLocation 사용
  // 주문 상세 페이지에서는 API의 previewX, previewY 사용
  const displayPreviewX = selectedLocation?.previewX ?? previewX;
  const displayPreviewY = selectedLocation?.previewY ?? previewY;

  // 상세 조회 API에는 rotation이 없으므로 기본값 0
  const displayRotation = selectedLocation?.rotation ?? 0;

  return (
    <>
      {/* 1. 사진 선택 */}
      <ConfirmStep step={1} title="사진 선택" onEdit={onEdit ? () => onEdit(1) : undefined}>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="선택한 사진"
            className="h-72 w-full rounded-xl border-2 border-[#192C44] object-cover"
          />
        )}
      </ConfirmStep>

      {/* 2. 작가 선택 */}
      <ConfirmStep step={2} title="작가 선택" onEdit={onEdit ? () => onEdit(2) : undefined}>
        {displayArtistName && (
          <div className="flex h-24 overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
            {/* 작가 대표 이미지 */}
            {displayArtistImage && (
              <img src={displayArtistImage} alt={displayArtistName} className="w-24 object-cover" />
            )}

            {/* 작가 정보 */}
            <div className="flex flex-1 flex-col justify-center px-3">
              {/* 국가 이미지 */}
              {displayNationImage && (
                <img
                  src={displayNationImage}
                  alt=""
                  aria-hidden="true"
                  className="mb-1 h-4 w-6 object-cover"
                />
              )}

              {/* 작가 이름 */}
              <p className="font-bold">{displayArtistName}</p>

              {/* 작가 소개 */}
              {displayArtistIntro && (
                <p className="mt-1 line-clamp-2 text-xs text-[#515C6C]">{displayArtistIntro}</p>
              )}
            </div>
          </div>
        )}
      </ConfirmStep>

      {/* 3. 위치 선택 */}
      <ConfirmStep step={3} title="위치 선택" onEdit={onEdit ? () => onEdit(3) : undefined}>
        {displayPreviewX !== undefined && displayPreviewY !== undefined && (
          <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
            <img src={bagImage} alt="커스텀 가방" className="w-[90%] object-contain" />

            {/* 선택 위치 */}
            <div
              className="absolute h-14 w-14 border-2 border-[#192C44] bg-[#192C44]/50"
              style={{
                left: `${displayPreviewX * 100}%`,
                top: `${displayPreviewY * 100}%`,
                transform: `translate(-50%, -50%) rotate(${displayRotation}deg)`,
              }}
            />
          </div>
        )}
      </ConfirmStep>

      {/* 4. 요청사항 */}
      <ConfirmStep step={4} title="요청사항 작성" onEdit={onEdit ? () => onEdit(4) : undefined}>
        <div className="min-h-52 whitespace-pre-wrap rounded-xl border-2 border-[#192C44] bg-white p-4 text-sm leading-7">
          {requestText}
        </div>
      </ConfirmStep>
    </>
  );
}
