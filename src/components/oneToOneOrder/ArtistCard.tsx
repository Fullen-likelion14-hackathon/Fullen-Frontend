import { ChevronRight } from "lucide-react";

import type { Artist } from "@/types/artist";

type ArtistCardProps = {
  artist: Artist;
  isSelected?: boolean;
  onSelect: (artistId: number) => void;
  onDetail: (artistId: number) => void;
};

export default function ArtistCard({
  artist,
  isSelected = false,
  onSelect,
  onDetail,
}: ArtistCardProps) {
  return (
    <div
      className={`flex h-27 w-full overflow-hidden rounded-xl border-3 bg-white ${
        isSelected ? "border-[#192A40]" : "border-[#D6CCC4]"
      }`}
    >
      {/* 작가 선택 영역 */}
      <button
        type="button"
        onClick={() => onSelect(artist.artistId)}
        className="flex min-w-0 flex-1 text-left"
      >
        {/* 작가 이미지 */}
        <img
          src={artist.imgUrl}
          alt={artist.artistName}
          className="h-full w-24 shrink-0 object-cover"
        />

        {/* 작가 정보 */}
        <div className="flex min-w-0 flex-1 items-center px-3 py-2">
          <div className="min-w-0 flex-1">
            {/* 국기 */}
            <img src={artist.nationImgUrl} alt="" className="mb-1 h-4 w-6 object-cover" />

            {/* 이름 */}
            <p className="truncate text-[1rem] font-bold text-[#192A40]">{artist.artistName}</p>

            {/* 작가 소개 */}
            <p className="mt-1 line-clamp-2 text-[max(12px,0.75rem)] leading-4 text-[#515C6C]">
              {artist.introSummary}
            </p>
          </div>
        </div>
      </button>

      {/* 상세보기 */}
      <button
        type="button"
        onClick={() => onDetail(artist.artistId)}
        className="flex w-10 shrink-0 items-center justify-center"
        aria-label={`${artist.artistName} 상세보기`}
      >
        <ChevronRight size={24} className="text-[#D0D0D0]" aria-hidden="true" />
      </button>
    </div>
  );
}
