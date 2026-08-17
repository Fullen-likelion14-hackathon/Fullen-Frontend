import uploadBrown from "@/assets/icons/uploadBrown.png";

interface PhotoSelectBoxProps {
  imageUrl?: string;
  onSelect: () => void;
  onRemove?: () => void;
}

const PhotoSelectBox = ({ imageUrl, onSelect, onRemove }: PhotoSelectBoxProps) => {
  // 사진 선택 완료 상태
  if (imageUrl) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border-2 border-[#192C44]">
        <img src={imageUrl} alt="선택한 여행 사진" className="aspect-square w-full object-cover" />

        {/* 선택한 사진 삭제 */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="선택한 사진 삭제"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-3xl font-light text-white"
        >
          ×
        </button>
      </div>
    );
  }

  // 사진 선택 전 상태
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white"
    >
      <img src={uploadBrown} alt="" aria-hidden="true" className="mb-4 h-12 w-12 object-contain" />

      <span className="text-center text-lg font-semibold leading-snug text-[#B89B84]">
        커스텀할 사진 한장을
        <br />
        고르세요
      </span>
    </button>
  );
};

export default PhotoSelectBox;
