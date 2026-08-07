import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { mcomFeedMockData } from "@/components/mcom/mcomFeedData";

export default function MCoMView() {
  const { feedId } = useParams();
  const navigate = useNavigate();

  const feed = mcomFeedMockData.find((item) => item.feedId === Number(feedId));

  if (!feed) {
    return <div>피드를 찾을 수 없습니다.</div>;
  }

  const currentIndex = mcomFeedMockData.findIndex((item) => item.feedId === Number(feedId));

  const previousFeed = currentIndex > 0 ? mcomFeedMockData[currentIndex - 1] : null;

  const nextFeed =
    currentIndex < mcomFeedMockData.length - 1 ? mcomFeedMockData[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col bg-[#242D41] text-white">
        {/* 헤더 */}
        <header className="border-b-[7px] border-[#AB6A37] bg-[#242D41] px-5 pb-6.25 pt-9.5">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate(-1)}
              className="absolute left-5"
            >
              <ChevronLeft size={36} strokeWidth={2.5} />
            </button>

            <h1 className="text-center text-xl font-semibold text-[#F7F7F7]">현재 위치한 나라</h1>
          </div>
        </header>
        {/* 카드가 들어가는 영역 */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden">
          {/* 이전 카드 */}
          {previousFeed && (
            <div className="absolute -left-63 z-0 h-125 w-73 scale-90 rounded-2xl bg-white opacity-60">
              <div className="pt-14 text-center text-black">
                <h2 className="text-[30px] font-bold">{previousFeed.countryName}</h2>

                <p>{previousFeed.title}</p>

                <div className="mx-auto mt-4 h-64 w-73 overflow-hidden">
                  <img
                    src={previousFeed.thumbnail}
                    alt={previousFeed.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 현재 피드 카드 */}
          <div className="relative z-10 h-125 w-73 rounded-2xl bg-white pt-13 text-black">
            {/* 국기 원 */}
            <div className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
              <img
                src={feed.flagImage}
                alt={`${feed.countryName} 국기`}
                className="h-auto w-10 border-2"
              />
            </div>

            {/* 피드 기본 정보 */}
            <div className="text-center">
              <h2 className="text-[30px] font-bold">{feed.countryName}</h2>

              <p className="mt-2 text-base font-medium">{feed.title}</p>

              <p className="mt-1 text-[14px] text-gray-400">{feed.date}</p>

              <div className="m-auto mt-1 h-64 w-73 overflow-hidden">
                <img src={feed.thumbnail} alt="대표사진" className="h-full w-full object-cover" />
              </div>

              <p className="mt-1 text-[10px] text-gray-400">
                {feed.imageCount}장, {feed.textCount}자
              </p>

              <button type="button" className="mt-1 rounded-2xl bg-gray-200 px-20 py-2">
                <span className="font-bold text-[#757575]">자세히 보기</span>
              </button>
            </div>
          </div>

          {/* 다음 카드 */}
          {nextFeed && (
            <div className="absolute -right-63 z-0 h-125 w-73 scale-90 rounded-2xl bg-white opacity-60">
              <div className="pt-14 text-center text-black">
                <h2 className="text-[30px] font-bold">{nextFeed.countryName}</h2>

                <p>{nextFeed.title}</p>

                <div className="mx-auto mt-4 h-64 w-73 overflow-hidden">
                  <img
                    src={nextFeed.thumbnail}
                    alt={nextFeed.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
