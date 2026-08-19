import bagFrontImage from "@/assets/images/testBag.png";
import bagBackImage from "@/assets/images/testBag.png";

import type { PatchLocation } from "@/types/patchLocation";

interface LocationSelectBoxProps {
  selectedLocation: PatchLocation | null;
  onSelect: () => void;
  onRemove: () => void;
}

export default function LocationSelectBox({
  selectedLocation,
  onSelect,
  onRemove,
}: LocationSelectBoxProps) {
  if (!selectedLocation) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="flex h-47 w-full items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white"
      >
        <span className="text-base font-semibold text-[#B89B84]">위치를 선택해주세요</span>
      </button>
    );
  }

  // 선택한 앞/뒷면에 맞는 이미지 표시
  const bagImage = selectedLocation.side === "FRONT" ? bagFrontImage : bagBackImage;

  return (
    <div className="relative flex h-47 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
      {/* 선택한 면의 가방 이미지 */}
      <img
        src={bagImage}
        alt={selectedLocation.side === "FRONT" ? "커스텀 가방 앞면" : "커스텀 가방 뒷면"}
        className="w-[85%] object-contain"
      />

      {/* 선택 위치 */}
      <div
        className="absolute h-14 w-14 border-2 border-[#192C44] bg-transparent"
        style={{
          left: `${selectedLocation.posX * 100}%`,
          top: `${selectedLocation.posY * 100}%`,
          transform: `translate(-50%, -50%) rotate(${selectedLocation.rotation}deg)`,
        }}
      />

      {/* 삭제 */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="선택한 위치 삭제"
        className="absolute right-2 top-1 flex h-7 w-7 items-center justify-center text-2xl text-[#8C949E]"
      >
        ×
      </button>
    </div>
  );
}
