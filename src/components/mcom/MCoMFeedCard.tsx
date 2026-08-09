import type { MCoMFeed } from "@/components/mcom/mcom";
import { useNavigate } from "react-router-dom";

type MCoMFeedCardProps = {
  feed: MCoMFeed;
  variant?: "current" | "side";
};

export default function MCoMFeedCard({ feed, variant = "current" }: MCoMFeedCardProps) {
  const navigate = useNavigate();

  const handleDtailClick = (feedId: number) => {
    navigate(`/mcom/view/${feedId}/detail`);
  };

  // 양옆에 살짝 보이는 카드
  if (variant === "side") {
    return (
      <div className="h-125 w-73 scale-90 rounded-2xl bg-white opacity-60">
        <div className="pt-14 text-center text-black">
          <h2 className="text-[30px] font-bold">{feed.countryName}</h2>

          <p>{feed.title}</p>

          <div className="mx-auto mt-4 h-64 w-73 overflow-hidden">
            <img src={feed.thumbnail} alt={feed.title} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  // 현재 중앙에 보이는 카드
  return (
    <div className="relative h-125 w-73 rounded-2xl bg-white pt-13 text-black">
      {/* 국기 */}
      <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
        <img
          src={feed.flagImage}
          alt={`${feed.countryName} 국기`}
          className="h-auto w-10 border-2"
        />
      </div>

      {/* 피드 정보 */}
      <div className="text-center">
        <h2 className="text-[30px] font-bold">{feed.countryName}</h2>

        <p className="mt-2 text-base font-medium">{feed.title}</p>

        <p className="mt-1 text-[14px] text-gray-400">{feed.date}</p>

        {/* 대표 이미지 */}
        <div className="m-auto mt-1 h-64 w-73 overflow-hidden">
          <img src={feed.thumbnail} alt="대표사진" className="h-full w-full object-cover" />
        </div>

        {/* 피드 정보 */}
        <p className="mt-1 text-[10px] text-gray-400">
          {feed.imageCount}장, {feed.textCount}자
        </p>

        {/* 자세히 보기 */}
        <button type="button" className="mt-1 rounded-2xl bg-gray-200 px-20 py-2">
          <span className="font-bold text-[#757575]" onClick={() => handleDtailClick(feed.feedId)}>
            자세히 보기
          </span>
        </button>
      </div>
    </div>
  );
}
