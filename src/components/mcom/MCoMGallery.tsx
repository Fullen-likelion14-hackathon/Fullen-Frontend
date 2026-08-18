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

  const handleFeedClick = (postId: number) => {
    navigate(`/mcom/view/${postId}`);
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
          {/* 현재 위치한 나라 탭일 때 왼쪽 맨 위에 표시 */}
          {MCoMTab === "country" && (
            <img
              src={countryImage}
              alt="현재 국가 아카이브"
              className="block aspect-[3/2] w-full rounded-2xl object-cover"
            />
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
          {/* 글로벌 탭일 때 오른쪽 맨 위에 표시 */}
          {MCoMTab === "global" && (
            <img
              src={globalImage}
              alt="글로벌 아카이브"
              className="block aspect-3/2 w-full rounded-2xl object-cover"
            />
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
                className="block h-auto w-full rounded-2xl"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
