import { useNavigate } from "react-router-dom";

import countryImage from "@/assets/images/country.png";
import globalImage from "@/assets/images/global.png";

import { useMCoMArchiveQuery } from "@/hooks/queries/mcom/useMCoMArchiveQuery";
import type { MCoMTab } from "@/types/mcom";

type MCoMGalleryProps = {
  MCoMTab: MCoMTab;
};

export default function MCoMGallery({ MCoMTab }: MCoMGalleryProps) {
  const navigate = useNavigate();

  // MCoM 아카이브 API 조회
  const { data: feeds = [], isPending, isError } = useMCoMArchiveQuery(MCoMTab);

  // 현재 위치 국가
  // 추후 현재 국가 API가 연결되면 해당 데이터로 변경
  const currentCountry = "GERMANY";

  const handleFeedClick = (postId: number) => {
    navigate(`/mcom/view/${postId}`, {
      state: {
        tab: MCoMTab,
      },
    });
  };

  // 받아온 게시물을 왼쪽 / 오른쪽 열로 나누기
  const leftFeeds = feeds.filter((_, index) => index % 2 === 0);
  const rightFeeds = feeds.filter((_, index) => index % 2 !== 0);

  if (isPending) {
    return (
      <section className="px-4 py-4">
        <p className="text-center text-sm text-gray-500">게시물을 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-4 py-4">
        <p className="text-center text-sm text-red-500">게시물을 불러오지 못했습니다.</p>
      </section>
    );
  }

  return (
    <section className="px-4 py-4">
      <div className="flex gap-3">
        {/* 왼쪽 사진 열 */}
        <div className="flex w-1/2 flex-col gap-3">
          {/* 현재 위치한 나라 탭 */}
          {MCoMTab === "country" && (
            <div className="relative aspect-3/2 w-full overflow-hidden rounded-2xl">
              <img
                src={countryImage}
                alt="현재 국가 아카이브"
                className="h-full w-full object-cover brightness-80"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-[16px] font-semibold leading-tight text-white">
                  MCM in...
                  <br />
                  {currentCountry}!
                </p>
              </div>
            </div>
          )}

          {leftFeeds.map((feed) => (
            <button
              key={feed.postId}
              type="button"
              onClick={() => handleFeedClick(feed.postId)}
              className="block w-full p-0"
            >
              <img
                src={feed.thumbnailURL}
                alt={`MCoM 게시물 ${feed.postId}`}
                className="block h-auto w-full rounded-2xl"
              />
            </button>
          ))}
        </div>

        {/* 오른쪽 사진 열 */}
        <div className="flex w-1/2 flex-col gap-3">
          {/* 글로벌 탭 */}
          {MCoMTab === "global" && (
            <div className="relative aspect-3/2 w-full overflow-hidden rounded-2xl">
              <img
                src={globalImage}
                alt="글로벌 아카이브"
                className="h-full w-full object-cover brightness-80"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-center text-[16px] font-semibold text-white">MCM in GLOBAL</p>
              </div>
            </div>
          )}

          {rightFeeds.map((feed) => (
            <button
              key={feed.postId}
              type="button"
              onClick={() => handleFeedClick(feed.postId)}
              className="block w-full p-0"
            >
              <img
                src={feed.thumbnailURL}
                alt={`MCoM 게시물 ${feed.postId}`}
                className="block h-auto w-full rounded-2xl "
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
