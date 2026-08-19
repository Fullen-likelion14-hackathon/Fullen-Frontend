import type { Artist } from "@/types/artist";

interface ArtistSelectBoxProps {
  selectedArtist: Artist | null;
  onSelect?: () => void;
  onRemove?: () => void;
  readOnly?: boolean;
}

const ArtistSelectBox = ({
  selectedArtist,
  onSelect,
  onRemove,
  readOnly = false,
}: ArtistSelectBoxProps) => {
  // 아직 작가를 선택하지 않은 상태
  if (!selectedArtist) {
    return (
      <button
        type="button"
        onClick={onSelect}
        disabled={readOnly}
        className="flex h-29 w-full items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white"
      >
        <span className="text-base font-semibold text-[#B89B84]">작가를 선택해주세요</span>
      </button>
    );
  }

  // 작가를 선택한 상태
  return (
    <div className="relative flex h-29 w-full overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
      {/* 작가 이미지 */}
      <img
        src={selectedArtist.imgUrl}
        alt={selectedArtist.artistName}
        className="h-full w-24 shrink-0 object-cover"
      />

      {/* 작가 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
        {/* 국가 이미지 */}
        {selectedArtist.nationImgUrl && (
          <img
            src={selectedArtist.nationImgUrl}
            alt=""
            aria-hidden="true"
            className="mb-1 h-4 w-6 object-cover"
          />
        )}

        {/* 작가 이름 */}
        <p className="text-base font-bold text-[#192A40]">{selectedArtist.artistName}</p>

        {/* 작가 소개 */}
        <p className="mt-1 line-clamp-2 pr-5 text-xs leading-4 text-[#515C6C]">
          {selectedArtist.introSummary}
        </p>
      </div>

      {/* 수정 가능한 화면에서만 작가 선택 해제 버튼 */}
      {!readOnly && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="선택한 작가 삭제"
          className="absolute right-2 top-1 flex h-7 w-7 items-center justify-center text-2xl font-light text-[#8C949E]"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ArtistSelectBox;
