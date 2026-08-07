import { useNavigate } from "react-router-dom";

import countryImage from "@/assets/images/country.png";
import globalImage from "@/assets/images/global.png";

import { mcomFeedMockData } from "@/components/mcom/mcomFeedData";
import type { MCoMTab } from "@/components/mcom/mcom";

type MCoMGalleryProps = {
  MCoMTab: MCoMTab;
};

export default function MCoMGallery({ MCoMTab }: MCoMGalleryProps) {
  const navigate = useNavigate();

  const handleFeedClick = (feedId: number) => {
    navigate(`/mcom/view/${feedId}`);
  };

  const leftFeeds = mcomFeedMockData.filter((_, index) => index % 2 === 0);
  const rightFeeds = mcomFeedMockData.filter((_, index) => index % 2 !== 0);

  return (
    <section className="px-4 py-4">
      <div className="flex gap-3">
        {/* 왼쪽 사진 열 */}
        <div className="flex w-1/2 flex-col gap-3">
          {leftFeeds.map((feed) => (
            <button
              key={feed.feedId}
              type="button"
              onClick={() => handleFeedClick(feed.feedId)}
              className="block w-full p-0"
            >
              <img
                src={feed.thumbnail}
                alt={feed.title}
                className="block h-auto w-full rounded-2xl"
              />
            </button>
          ))}
        </div>

        {/* 오른쪽 사진 열 */}
        <div className="flex w-1/2 flex-col gap-3">
          {/* 탭에 따라 변경되는 국가 이미지 */}
          <img
            src={MCoMTab === "country" ? countryImage : globalImage}
            alt={MCoMTab === "country" ? "현재 국가 아카이브" : "글로벌 아카이브"}
            className="mx-auto block h-24 w-35 rounded-2xl"
          />

          {rightFeeds.map((feed) => (
            <button
              key={feed.feedId}
              type="button"
              onClick={() => handleFeedClick(feed.feedId)}
              className="block w-full p-0"
            >
              <img
                src={feed.thumbnail}
                alt={feed.title}
                className="block h-auto w-full rounded-2xl"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
