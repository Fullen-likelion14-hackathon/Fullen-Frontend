import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import editIcon from "@/assets/icons/edit.png";
import deleteIcon from "@/assets/icons/delete.png";
import publicIcon from "@/assets/icons/public.png";
import privateIcon from "@/assets/icons/private.png";
import { feedDetailMockData } from "./feedDetail.mock";
import { categoryFeedMockData } from "@/pages/CategoryFeed/categoryFeed.mock";

export default function FeedDetail() {
  const navigate = useNavigate();
  const { categoryId, feedId } = useParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const feed = feedDetailMockData.find(
    (item) => item.categoryId === Number(categoryId) && item.feedId === Number(feedId),
  );

  if (!feed) {
    return <div>피드 데이터 없음</div>;
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  const handleDeleteFeed = () => {
    // TODO: 피드 삭제 API 연동 (지금은 목업 배열에서 직접 제거)
    const feedIndex = feedDetailMockData.findIndex(
      (item) => item.categoryId === Number(categoryId) && item.feedId === Number(feedId),
    );
    if (feedIndex !== -1) {
      feedDetailMockData.splice(feedIndex, 1);
    }

    // 목록 페이지 그리드에서도 사라지도록 썸네일도 함께 제거
    const category = categoryFeedMockData.find((item) => item.categoryId === Number(categoryId));
    if (category) {
      const thumbIndex = category.feeds.findIndex((f) => f.feedId === Number(feedId));
      if (thumbIndex !== -1) {
        category.feeds.splice(thumbIndex, 1);
      }
    }

    setIsDeleteOpen(false);
    navigate(`/passport/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="relative mx-auto min-h-screen w-full max-w-97.5 overflow-hidden bg-white">
        {/* 헤더 */}
        <header className="relative bg-stone-100 pb-6 pt-9">
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => navigate(`/passport/${categoryId}`)}
            className="absolute left-5 top-9 flex h-6 w-6 items-center justify-center"
          >
            <span className="block h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 border-[#CFCDCE]" />
          </button>

          <div className="flex items-center justify-center gap-[5px] pt-1">
            {/* 공개/비공개 아이콘 */}
            <div className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-white">
              <img
                src={feed.isPublic ? publicIcon : privateIcon}
                alt={feed.isPublic ? "공개" : "비공개"}
                className="h-3 w-5 object-contain"
              />
            </div>

            <p
              className="text-lg font-bold tracking-tight text-slate-800"
              style={{ fontFamily: "Paperlogy" }}
            >
              {feed.date}
            </p>
          </div>

          {/* 수정 / 삭제 버튼 */}
          <div className="absolute right-5 top-9 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="게시물 수정"
              onClick={() => navigate(`/passport/${categoryId}/${feedId}/edit`)}
              className="flex size-9 items-center justify-center rounded-md bg-white"
            >
              <img src={editIcon} alt="" className="size-8 object-contain" />
            </button>
            <button
              type="button"
              aria-label="게시물 삭제"
              onClick={() => setIsDeleteOpen(true)}
              className="flex size-9 items-center justify-center rounded-md bg-white"
            >
              <img src={deleteIcon} alt="" className="size-8 object-contain" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-yellow-700" />
        </header>

        {/* 사진 슬라이드 */}
        <div className="relative aspect-square w-full bg-stone-300">
          <div
            onScroll={handleScroll}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {feed.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="h-full w-full flex-shrink-0 snap-center object-cover"
              />
            ))}
          </div>

          {feed.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
              {feed.images.map((_, index) => (
                <span
                  key={index}
                  className={`size-2.5 rounded-full border-[1.67px] border-white/80 ${
                    index === activeIndex ? "bg-white/80" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 코멘트 */}
        <p
          className="whitespace-pre-line px-5 py-8 text-sm leading-4 tracking-tight text-zinc-900"
          style={{ fontFamily: "Paperlogy" }}
        >
          {feed.content}
        </p>

        <DeleteConfirmDialog
          open={isDeleteOpen}
          title="해당 여행을 삭제하시겠습니까?"
          description="삭제한 여행은 복구할 수 없습니다."
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteFeed}
        />
      </div>
    </div>
  );
}
