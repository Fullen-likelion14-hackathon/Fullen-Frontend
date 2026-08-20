import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeletePost } from "@/hooks/queries/useDeletePost";

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import editIcon from "@/assets/icons/edit2.png";
import deleteIcon from "@/assets/icons/delete2.png";
import publicIcon from "@/assets/icons/public2.png";
import privateIcon from "@/assets/icons/private.png";
import { usePost } from "@/hooks/queries/usePost";

export default function FeedDetail() {
  const navigate = useNavigate();
  const { categoryId, feedId } = useParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const { data: feed, isLoading } = usePost(Number(feedId));

  // 마우스 드래그 스크롤용 상태/ref
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const didDragRef = useRef(false);

  if (isLoading || !feed) {
    return <div>불러오는 중...</div>;
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;

    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = e.pageX - slider.offsetLeft;
    dragStartScrollLeftRef.current = slider.scrollLeft;
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider || !isDraggingRef.current) return;

    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = x - dragStartXRef.current;

    // 살짝만 움직인 건 클릭으로 취급하기 위한 임계값
    if (Math.abs(walk) > 5) {
      didDragRef.current = true;
    }

    slider.scrollLeft = dragStartScrollLeftRef.current - walk;
  };

  // 드래그 종료 (스냅 위치로 정렬)
  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const slider = sliderRef.current;
    if (!slider) return;

    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    slider.scrollTo({
      left: index * slider.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleDeleteFeed = async () => {
    if (!feedId || isDeleting) return;

    try {
      await deletePost(Number(feedId));
      setIsDeleteOpen(false);
      navigate(`/passport/${categoryId}`, { replace: true });
    } catch (error) {
      console.error(error);
      // TODO: 실패 시 사용자 안내(토스트 등) 추가 필요
    }
  };

  return (
    <div className="min-h-dvh bg-gray-200">
      <div className="relative mx-auto min-h-dvh w-full max-w-97.5 overflow-hidden bg-white">
        {/* 헤더 */}
        <header className="relative h-31.25 w-97.5 bg-[#F9F4F0] pb-6 pt-9">
          <div className="mt-[1.3125rem]">
            <div className="flex items-center justify-between px-5 pt-1">
              <button
                type="button"
                aria-label="뒤로 가기"
                onClick={() => navigate(-1)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <span className="block h-4.5 w-4.5 rotate-45 border-b-[3px] border-l-[3px] border-[#CFCDCE]" />
              </button>

              <div className="flex items-center gap-[1.25rem]">
                <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img
                    src={feed.isPublic ? publicIcon : privateIcon}
                    alt={feed.isPublic ? "공개" : "비공개"}
                    className="size-8 object-contain"
                  />
                </div>

                <p
                  className="text-xl font-semibold tracking-tight text-slate-800"
                  style={{ fontFamily: "Paperlogy" }}
                >
                  {feed.date}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="게시물 수정"
                  onClick={() =>
                    navigate(`/passport/${categoryId}/${feedId}/edit`, {
                      state: {
                        images: feed.photoList.map((photo) => photo.imgURL),
                        comment: feed.comment,
                        isPublic: feed.isPublic,
                      },
                    })
                  }
                  className="flex size-9 items-center justify-center rounded-md bg-white"
                >
                  <img src={editIcon} alt="" className="size-9 object-contain" />
                </button>
                <button
                  type="button"
                  aria-label="게시물 삭제"
                  onClick={() => setIsDeleteOpen(true)}
                  className="flex size-9 items-center justify-center rounded-md bg-white"
                >
                  <img src={deleteIcon} alt="" className="size-9 object-contain" />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[0.5rem] bg-[#A3642B]" />
        </header>

        {/* 사진 슬라이드 */}
        <div className="relative h-[27.1875rem] w-97.5 bg-stone-300">
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            className="flex h-full w-full cursor-grab snap-x snap-mandatory overflow-x-auto scroll-smooth select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          >
            {feed.photoList.map((photo) => (
              <img
                key={photo.photoId}
                src={photo.imgURL}
                alt=""
                draggable={false}
                onClick={(e) => {
                  // 드래그 직후 발생하는 클릭(예: 이미지 링크 등)은 무시
                  if (didDragRef.current) e.preventDefault();
                }}
                className="h-full w-full flex-shrink-0 snap-center object-cover"
              />
            ))}
          </div>

          {feed.photoList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5">
              {feed.photoList.map((_, index) => (
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
          {feed.comment}
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
