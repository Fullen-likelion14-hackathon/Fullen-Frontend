import bagImage from "@/assets/images/testBag.png";

import ConfirmStep from "@/components/custom/common/step/ConfirmStep";

import type { Artist } from "@/components/oneToOneOrder/ArtistData";
import type { PatchLocation } from "@/components/custom/common/selection/LocationSelectBox";

interface OrderDetailContentProps {
  selectedImage?: string;
  selectedArtist: Artist | null;
  selectedLocation?: PatchLocation;
  requestText: string;

  // 주문 확인 페이지에서만 수정하기 사용
  onEdit?: (step: number) => void;
}

export default function OrderDetailContent({
  selectedImage,
  selectedArtist,
  selectedLocation,
  requestText,
  onEdit,
}: OrderDetailContentProps) {
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
        {selectedArtist && (
          <div className="flex h-24 overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
            <img
              src={selectedArtist.image}
              alt={selectedArtist.name}
              className="w-24 object-cover"
            />

            <div className="flex flex-1 flex-col justify-center px-3">
              <img src={selectedArtist.flagImage} alt="" className="mb-1 h-4 w-6 object-cover" />

              <p className="font-bold">{selectedArtist.name}</p>

              <p className="mt-1 line-clamp-2 text-xs text-[#515C6C]">
                {selectedArtist.description}
              </p>
            </div>
          </div>
        )}
      </ConfirmStep>

      {/* 3. 위치 선택 */}
      <ConfirmStep step={3} title="위치 선택" onEdit={onEdit ? () => onEdit(3) : undefined}>
        {selectedLocation && (
          <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
            <img src={bagImage} alt="커스텀 가방" className="w-[90%] object-contain" />

            <div
              className="absolute h-14 w-14 border-2 border-[#192C44] bg-white"
              style={{
                left: `${selectedLocation.x}%`,
                top: `${selectedLocation.y}%`,
                transform: "translate(-50%, -50%)",
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
