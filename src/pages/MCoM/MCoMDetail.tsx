import { useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useMCoMDetailQuery } from "@/hooks/queries/mcom/useMCoMDetailQuery";

export default function MCoMDetail() {
  const navigate = useNavigate();
  const { feedId } = useParams();

  // 현재 보고 있는 사진 인덱스
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // 사진 슬라이더 DOM 참조
  const sliderRef = useRef<HTMLDivElement>(null);

  const postId = Number(feedId);
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  const { data: feed, isPending, isError } = useMCoMDetailQuery(isValidPostId ? postId : 0);

  // 사진을 넘길 때 현재 사진 번호 계산
  const handlePhotoScroll = () => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const slideWidth = slider.clientWidth;

    if (slideWidth === 0) {
      return;
    }

    const nextIndex = Math.round(slider.scrollLeft / slideWidth);

    setCurrentPhotoIndex(nextIndex);
  };

  // 하단 점 클릭 시 해당 사진으로 이동
  const handleIndicatorClick = (index: number) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollTo({
      left: slider.clientWidth * index,
      behavior: "smooth",
    });

    setCurrentPhotoIndex(index);
  };

  if (!isValidPostId) {
    return <div>잘못된 게시물입니다.</div>;
  }

  if (isPending) {
    return <div>게시물을 불러오는 중입니다.</div>;
  }

  if (isError || !feed) {
    return <div>피드 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="mx-auto min-h-screen w-full max-w-97.5 bg-[#FEFEFE]">
        {/* 헤더 */}
        <header className="bg-[#FEFEFE] pb-1 pt-11">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate(-1)}
              className="absolute left-5 text-[#A0A0A0]"
            >
              <ChevronLeft size={36} strokeWidth={2.5} />
            </button>

            <div className="text-center text-black">
              <h1 className="mt-1 text-[25px] font-bold">{feed.nationKRName}</h1>

              <p className="mt-1 text-[15px] font-bold">{feed.journeyType}</p>
            </div>

            <img
              src={feed.nationFlagURL}
              alt={`${feed.nationKRName} 국기`}
              className="absolute right-5 w-10"
            />
          </div>
        </header>

        {/* 날짜 */}
        <p className="pb-3 text-center text-[15px] font-semibold text-[#A0A0A0]">{feed.date}</p>

        {/* 사진 슬라이더 */}
        {feed.photoList.length > 0 && (
          <div className="relative w-full">
            <div
              ref={sliderRef}
              onScroll={handlePhotoScroll}
              className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {feed.photoList.map((photo, index) => (
                <div key={photo.photoId} className="min-w-full snap-center">
                  <img
                    src={photo.imgURL}
                    alt={`${feed.nationKRName} 여행 사진 ${index + 1}`}
                    className="h-107 w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* 사진 인디케이터 */}
            {feed.photoList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {feed.photoList.map((photo, index) => (
                  <button
                    key={photo.photoId}
                    type="button"
                    aria-label={`${index + 1}번째 사진 보기`}
                    onClick={() => handleIndicatorClick(index)}
                    className={`h-3 w-3 rounded-full transition-colors ${
                      currentPhotoIndex === index ? "bg-white" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 피드 내용 */}
        <div className="px-5 py-6">
          <p className="whitespace-pre-line text-[15px] leading-6 text-black">{feed.comment}</p>
        </div>
      </div>
    </div>
  );
}
