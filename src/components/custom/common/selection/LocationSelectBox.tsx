import type { PatchLocation } from "@/types/patchLocation";

interface LocationSelectBoxProps {
  selectedLocation: PatchLocation | null;
  bagFrontImgUrl?: string;
  bagBackImgUrl?: string;
  onSelect: () => void;
  onRemove: () => void;
}

type PreviewArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

// API에서 받은 2D 가방 이미지 안에서
// 실제 패치를 배치할 "가방 몸통 영역"
const PREVIEW_AREA: Record<"FRONT" | "BACK", PreviewArea> = {
  FRONT: {
    left: 13,
    top: 36,
    width: 75,
    height: 61,
  },

  // 뒷면은 실제 이미지 확인 후 별도로 조정
  BACK: {
    left: 13,
    top: 36,
    width: 75,
    height: 61,
  },
};

export default function LocationSelectBox({
  selectedLocation,
  bagFrontImgUrl,
  bagBackImgUrl,
  onSelect,
  onRemove,
}: LocationSelectBoxProps) {
  // 아직 위치를 선택하지 않은 상태
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

  // 선택한 FRONT / BACK에 따라 상세조회 API 이미지 선택
  const bagImage = selectedLocation.side === "BACK" ? bagBackImgUrl : bagFrontImgUrl;

  // Product.tsx에서 이미 0~1 범위로 변환된 2D 미리보기 좌표
  const previewX = Math.min(Math.max(selectedLocation.previewX, 0), 1);

  const previewY = Math.min(Math.max(selectedLocation.previewY, 0), 1);

  // 선택한 면에 맞는 2D 가방 몸통 영역
  const previewArea = PREVIEW_AREA[selectedLocation.side];

  // previewX / previewY를
  // 이미지 전체가 아닌 "가방 몸통 영역" 안으로 매핑
  const previewLeft = previewArea.left + previewX * previewArea.width;

  const previewTop = previewArea.top + previewY * previewArea.height;

  return (
    <div className="relative flex h-47 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
      {bagImage ? (
        // 가방 이미지와 선택 위치가 같은 좌표계를 사용하도록
        // 하나의 relative 컨테이너 안에 배치
        <div className="relative w-[85%]">
          {/* 상세조회 API에서 받아온 실제 가방 이미지 */}
          <img
            src={bagImage}
            alt={selectedLocation.side === "FRONT" ? "커스텀 가방 앞면" : "커스텀 가방 뒷면"}
            className="block h-auto w-full object-contain"
          />

          {/* 3D에서 선택한 위치를 2D 가방 이미지 위에 표시 */}
          <div
            className="pointer-events-none absolute h-14 w-14 border-2 border-[#192C44] bg-transparent"
            style={{
              left: `${previewLeft}%`,
              top: `${previewTop}%`,
              transform: `translate(-50%, -50%) rotate(${selectedLocation.rotation}deg)`,
            }}
          />
        </div>
      ) : (
        <span className="text-sm text-[#8C949E]">가방 이미지를 불러오는 중입니다.</span>
      )}

      {/* 선택 위치 삭제 */}
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
