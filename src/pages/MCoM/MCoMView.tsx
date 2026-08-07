import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import MCoMFeedCard from "@/components/mcom/MCoMFeedCard";
import { mcomFeedMockData } from "@/components/mcom/mcomFeedData";

export default function MCoMView() {
  const { feedId } = useParams();
  const navigate = useNavigate();

  const dragStartX = useRef<number | null>(null);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const feed = mcomFeedMockData.find((item) => item.feedId === Number(feedId));

  if (!feed) {
    return <div>피드를 찾을 수 없습니다.</div>;
  }

  const currentIndex = mcomFeedMockData.findIndex((item) => item.feedId === Number(feedId));

  const previousFeed = currentIndex > 0 ? mcomFeedMockData[currentIndex - 1] : null;

  const nextFeed =
    currentIndex < mcomFeedMockData.length - 1 ? mcomFeedMockData[currentIndex + 1] : null;

  // 카드 중심과 중심 사이의 거리
  const CARD_STEP = 300;

  // 이 정도 이상 밀면 다음/이전 카드로 이동
  const SWIPE_THRESHOLD = 30;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    dragStartX.current = event.clientX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) return;

    const distance = event.clientX - dragStartX.current;

    // 마지막 피드에서 왼쪽으로 더 당기거나
    // 첫 피드에서 오른쪽으로 더 당길 때 약간의 저항감
    if (!nextFeed && distance < 0) {
      setDragOffset(distance * 0.25);
      return;
    }

    if (!previousFeed && distance > 0) {
      setDragOffset(distance * 0.25);
      return;
    }

    setDragOffset(distance);
  };

  const handlePointerUp = () => {
    if (dragStartX.current === null || isAnimating) {
      return;
    }

    dragStartX.current = null;
    setIsDragging(false);

    // 왼쪽으로 밀었음 → 다음 피드
    if (dragOffset < -SWIPE_THRESHOLD && nextFeed) {
      setIsAnimating(true);

      // 다음 카드가 정확히 중앙까지 이동
      setDragOffset(-CARD_STEP);

      setTimeout(() => {
        navigate(`/mcom/view/${nextFeed.feedId}`);

        // 새 피드가 중앙에서 시작하도록 초기화
        setDragOffset(0);
        setIsAnimating(false);
      }, 300);

      return;
    }

    // 오른쪽으로 밀었음 → 이전 피드
    if (dragOffset > SWIPE_THRESHOLD && previousFeed) {
      setIsAnimating(true);

      // 이전 카드가 정확히 중앙까지 이동
      setDragOffset(CARD_STEP);

      setTimeout(() => {
        navigate(`/mcom/view/${previousFeed.feedId}`);

        setDragOffset(0);
        setIsAnimating(false);
      }, 300);

      return;
    }

    // 조금만 움직였다면 원래 자리로
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col bg-[#242D41] text-white">
        {/* 헤더 */}
        <header className="border-b-[7px] border-[#AB6A37] bg-[#242D41] pb-6.25 pt-9.5">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate("/")}
              className="absolute left-5"
            >
              <ChevronLeft size={36} strokeWidth={2.5} />
            </button>

            <h1 className="text-center text-xl font-semibold text-[#F7F7F7]">현재 위치한 나라</h1>
          </div>
        </header>

        {/* 카드 슬라이더 영역 */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onDragStart={(event) => event.preventDefault()}
        >
          {/* 이전 카드 */}
          {previousFeed && (
            <div
              className={`absolute left-1/2 ${
                isDragging ? "" : "transition-transform duration-300 ease-out"
              }`}
              style={{
                transform: `translateX(calc(-50% - ${CARD_STEP}px + ${dragOffset}px))`,
              }}
            >
              <MCoMFeedCard feed={previousFeed} variant="side" />
            </div>
          )}

          {/* 현재 카드 */}
          <div
            className={`absolute left-1/2 z-10 cursor-grab active:cursor-grabbing ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{
              transform: `translateX(calc(-50% + ${dragOffset}px))`,
            }}
          >
            <MCoMFeedCard feed={feed} />
          </div>

          {/* 다음 카드 */}
          {nextFeed && (
            <div
              className={`absolute left-1/2 ${
                isDragging ? "" : "transition-transform duration-300 ease-out"
              }`}
              style={{
                transform: `translateX(calc(-50% + ${CARD_STEP}px + ${dragOffset}px))`,
              }}
            >
              <MCoMFeedCard feed={nextFeed} variant="side" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
