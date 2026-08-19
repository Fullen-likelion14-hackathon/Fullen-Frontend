import { FlipHorizontal2, Minus, Plus, Trash2 } from "lucide-react";

interface PlacedPatchControlsProps {
  // 패치 좌우 반전 함수임
  onFlip: () => void;

  // 패치 크기 축소 함수임
  onDecreaseSize: () => void;

  // 패치 크기 확대 함수임
  onIncreaseSize: () => void;

  // 가방 위 패치 제거 함수임
  onRemove: () => void;
}

const PlacedPatchControls = ({
  onFlip,
  onDecreaseSize,
  onIncreaseSize,
  onRemove,
}: PlacedPatchControlsProps) => {
  return (
    <div
      className="
        flex
        items-center
        overflow-hidden
        rounded-full
        bg-[#D9D9D9]
        px-1
        shadow-md
      "
      // 가방 드래그 이벤트로 전달되지 않도록 처리함
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      {/* 좌우 반전 버튼임 */}
      <button
        type="button"
        onClick={onFlip}
        aria-label="패치 좌우 반전"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          text-[#3C4045]
        "
      >
        <FlipHorizontal2 size={19} strokeWidth={2.5} />
      </button>

      {/* 크기 축소 버튼임 */}
      <button
        type="button"
        onClick={onDecreaseSize}
        aria-label="패치 크기 줄이기"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          text-[#3C4045]
        "
      >
        <Minus size={18} strokeWidth={2.5} />
      </button>

      {/* 크기 확대 버튼임 */}
      <button
        type="button"
        onClick={onIncreaseSize}
        aria-label="패치 크기 키우기"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          text-[#3C4045]
        "
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>

      {/* 현재 가방 위에서만 패치 제거함 */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="가방에서 패치 제거"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          text-[#3C4045]
        "
      >
        <Trash2 size={19} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default PlacedPatchControls;
