import artistFrame from "@/assets/images/artistFrame.png";

type ArtistFrameProps = {
  image: string;
  name: string;
  isSelected?: boolean;
  onDetail?: () => void;
};

export default function ArtistFrame({
  image,
  name,
  isSelected = false,
  onDetail,
}: ArtistFrameProps) {
  return (
    <div className="w-60 shrink-0 pb-1">
      {/* 프레임 + 작가 이미지 */}
      <div className="relative w-full">
        {/* 선택됐을 때 프레임 모양 그대로 남색 테두리 */}
        {isSelected && (
          <div
            className="absolute inset-0 scale-[1.035] bg-[#192A40]"
            style={{
              WebkitMaskImage: `url(${artistFrame})`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",

              maskImage: `url(${artistFrame})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
        )}

        {/* 기존 프레임 */}
        <img src={artistFrame} alt="작가 프레임" className="relative z-10 w-full" />

        {/* 작가 이미지 */}
        <div className="absolute left-[19%] top-[35%] z-20 h-[55%] w-[62%] overflow-hidden rounded-xl">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>

        {/* 상세보기 버튼 */}
        {onDetail && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDetail();
            }}
            className="absolute left-1/2 top-[85%] z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-white bg-white/40 px-3 py-1.5 text-[14px] font-medium text-white"
          >
            상세보기
          </button>
        )}
      </div>
    </div>
  );
}
