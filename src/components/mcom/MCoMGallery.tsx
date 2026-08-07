import { useNavigate } from "react-router-dom";

import testImage1 from "@/assets/images/McoMTest.png";
import testImage2 from "@/assets/images/McoMTest2.png";
import countryImage from "@/assets/images/country.png";
import globalImage from "@/assets/images/global.png";

import type { MCoMTab } from "@/components/mcom/mcom";

type MCoMGalleryProps = {
  MCoMTab: MCoMTab;
};
type MCoMFeedImage = {
  feedId: number;
  image: string;
  alt: string;
};
const leftFeedImages: MCoMFeedImage[] = [
  {
    feedId: 1,
    image: testImage1,
    alt: "1번 MCM 피드",
  },
  {
    feedId: 2,
    image: testImage2,
    alt: "2번 MCM 피드",
  },
  {
    feedId: 3,
    image: testImage2,
    alt: "3번 MCM 피드",
  },
  {
    feedId: 4,
    image: testImage1,
    alt: "4번 MCM 피드",
  },
];

const rightFeedImages: MCoMFeedImage[] = [
  {
    feedId: 5,
    image: testImage2,
    alt: "5번 MCM 피드",
  },
  {
    feedId: 6,
    image: testImage2,
    alt: "6번 MCM 피드",
  },
  {
    feedId: 7,
    image: testImage2,
    alt: "7번 MCM 피드",
  },
];

export default function MCoMGallery({ MCoMTab }: MCoMGalleryProps) {
  const navigate = useNavigate();

  const handleFeedClick = (feedId: number) => {
    navigate(`/mcom/view/${feedId}`);
  };

  return (
    <section className="px-4">
      <div className="mt-4 flex gap-3">
        {/* 왼쪽 사진 열 */}
        <div className="flex w-1/2 flex-col gap-3">
          {leftFeedImages.map((feed) => (
            <button
              key={feed.feedId}
              type="button"
              onClick={() => handleFeedClick(feed.feedId)}
              className="block w-full p-0"
            >
              <img src={feed.image} alt={feed.alt} className="block h-auto w-full rounded-2xl" />
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

          {rightFeedImages.map((feed) => (
            <button
              key={feed.feedId}
              type="button"
              onClick={() => handleFeedClick(feed.feedId)}
              className="block w-full p-0"
            >
              <img src={feed.image} alt={feed.alt} className="block h-auto w-full rounded-2xl" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
