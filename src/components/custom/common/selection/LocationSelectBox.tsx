import bagImage from "@/assets/images/testBag.png";

export type PatchLocation = {
  x: number;
  y: number;
};

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

  return (
    <div className="relative flex h-47 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
      <img src={bagImage} alt="커스텀 가방" className="w-[85%] object-contain" />

      <div
        className="absolute h-14 w-14 border-2 border-[#192C44] bg-white"
        style={{
          left: `${selectedLocation.x}%`,
          top: `${selectedLocation.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

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
