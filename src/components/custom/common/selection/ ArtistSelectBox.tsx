interface SelectedArtist {
  id: number;
  name: string;
  description: string;
  image: string;
  flagImage: string;
}

interface ArtistSelectBoxProps {
  selectedArtist: SelectedArtist | null;
  onSelect: () => void;
  onRemove: () => void;
}

const ArtistSelectBox = ({ selectedArtist, onSelect, onRemove }: ArtistSelectBoxProps) => {
  // 아직 작가를 선택하지 않은 상태임
  if (!selectedArtist) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="flex h-29 w-full items-center justify-center rounded-xl border-2 border-[#D8CCC1] bg-white"
      >
        <span className="text-base font-semibold text-[#B89B84]">작가를 선택해주세요</span>
      </button>
    );
  }

  // 작가 선택 완료 후 선택한 작가 정보를 보여줌
  return (
    <div className="relative flex h-29 w-full overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
      <img
        src={selectedArtist.image}
        alt={selectedArtist.name}
        className="h-full w-29 shrink-0 object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3">
        <img
          src={selectedArtist.flagImage}
          alt=""
          aria-hidden="true"
          className="mb-1 h-4 w-6 object-cover"
        />

        <p className="text-base font-bold text-[#192C44]">{selectedArtist.name}</p>

        <p className="mt-1 line-clamp-2 text-xs leading-snug text-[#192C44]">
          {selectedArtist.description}
        </p>
      </div>

      {/* 선택한 작가를 다시 해제할 수 있게 해줌 */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="선택한 작가 삭제"
        className="absolute right-2 top-1 text-2xl font-light text-[#8C949E]"
      >
        ×
      </button>
    </div>
  );
};

export type { SelectedArtist };

export default ArtistSelectBox;
