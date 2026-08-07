import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import MCoMFeedSlider from "@/components/mcom/MCoMFeedSlider";
import { mcomFeedMockData } from "@/components/mcom/mcomFeedData";

export default function MCoMView() {
  const { feedId } = useParams();
  const navigate = useNavigate();

  const feed = mcomFeedMockData.find((item) => item.feedId === Number(feedId));

  if (!feed) {
    return <div>피드 데이터 없음</div>;
  }

  const currentIndex = mcomFeedMockData.findIndex((item) => item.feedId === Number(feedId));

  const previousFeed = currentIndex > 0 ? mcomFeedMockData[currentIndex - 1] : null;

  const nextFeed =
    currentIndex < mcomFeedMockData.length - 1 ? mcomFeedMockData[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col bg-[#242D41] text-white">
        <header className="border-b-[7px] border-[#AB6A37] bg-[#242D41] pb-6.25 pt-11">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate("/mcom")}
              className="absolute left-5"
            >
              <ChevronLeft size={36} strokeWidth={2.5} />
            </button>

            <h1 className="text-center text-xl font-semibold text-[#F7F7F7]">현재 위치한 나라</h1>
          </div>
        </header>

        <MCoMFeedSlider feed={feed} previousFeed={previousFeed} nextFeed={nextFeed} />
      </div>
    </div>
  );
}
