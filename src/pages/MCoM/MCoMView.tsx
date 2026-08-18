import { useParams } from "react-router-dom";

import MCoMFeedSlider from "@/components/mcom/MCoMFeedSlider";
import { mcomFeedMockData } from "@/mocks/mcomFeedData";
import PageHeader from "@/components/common/PageHeader";

export default function MCoMView() {
  const { feedId } = useParams();

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
        <PageHeader title="현재 위치한 나라" backTo="/mcom" />

        <MCoMFeedSlider feed={feed} previousFeed={previousFeed} nextFeed={nextFeed} />
      </div>
    </div>
  );
}
