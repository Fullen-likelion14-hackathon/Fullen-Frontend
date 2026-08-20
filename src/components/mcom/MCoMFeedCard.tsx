import type { PostPreviewResponse } from "@/types/mcom";
import { useNavigate } from "react-router-dom";

type MCoMFeedCardProps = {
  feed: PostPreviewResponse;
  variant?: "current" | "side";
};

export default function MCoMFeedCard({ feed, variant = "current" }: MCoMFeedCardProps) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/mcom/view/${feed.postId}/detail`);
  };

  // 양옆에 살짝 보이는 카드
  if (variant === "side") {
    return (
      <div className="pointer-events-none h-125 w-73 scale-90 rounded-2xl bg-white opacity-60">
        <div className="pt-14 text-center text-black">
          <h2 className="text-[1.875rem] font-bold">{feed.nationKRName}</h2>

          <p>{feed.journeyType}</p>

          <div className="mx-auto mt-4 h-64 w-73 overflow-hidden">
            <img
              src={feed.thumbnailURL}
              alt={feed.journeyType}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 h-125 w-73 rounded-2xl bg-white pt-13 text-black">
      <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
        <img
          src={feed.nationFlagURL}
          alt={`${feed.nationKRName} 국기`}
          className="h-auto w-10 border-2"
        />
      </div>

      <div className="text-center">
        <h2 className="text-[1.875rem] font-bold">{feed.nationKRName}</h2>

        <p className="mt-2 text-base font-medium">{feed.journeyType}</p>

        <p className="mt-1 text-[max(12px,0.875rem)] text-gray-400">{feed.date}</p>

        <div className="m-auto mt-1 h-64 w-73 overflow-hidden">
          <img src={feed.thumbnailURL} alt="대표사진" className="h-full w-full object-cover" />
        </div>

        <button
          type="button"
          onClick={handleDetailClick}
          className="cursor-pointer relative z-20 mt-5 rounded-2xl bg-gray-200 px-20 py-2"
        >
          <span className="font-bold text-[#757575]">자세히 보기</span>
        </button>
      </div>
    </div>
  );
}
