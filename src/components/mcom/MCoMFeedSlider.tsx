import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MCoMFeedCard from "@/components/mcom/MCoMFeedCard";

import type { MCoMFeed } from "@/components/mcom/mcom";

type MCoMFeedSliderProps = {
  feed: MCoMFeed;
  previousFeed: MCoMFeed | null;
  nextFeed: MCoMFeed | null;
};

const CARD_STEP = 310;
const SWIPE_THRESHOLD = 60;
const ANIMATION_DURATION = 300;

export default function MCoMFeedSlider({ feed, previousFeed, nextFeed }: MCoMFeedSliderProps) {
  const navigate = useNavigate();

  const dragStartX = useRef<number | null>(null);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    dragStartX.current = event.clientX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) return;

    const distance = event.clientX - dragStartX.current;

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

    if (dragOffset < -SWIPE_THRESHOLD && nextFeed) {
      setIsAnimating(true);
      setDragOffset(-CARD_STEP);

      setTimeout(() => {
        navigate(`/mcom/view/${nextFeed.feedId}`);
        setDragOffset(0);
        setIsAnimating(false);
      }, ANIMATION_DURATION);

      return;
    }

    if (dragOffset > SWIPE_THRESHOLD && previousFeed) {
      setIsAnimating(true);
      setDragOffset(CARD_STEP);

      setTimeout(() => {
        navigate(`/mcom/view/${previousFeed.feedId}`);
        setDragOffset(0);
        setIsAnimating(false);
      }, ANIMATION_DURATION);

      return;
    }

    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <div
      className="relative flex flex-1 select-none items-center justify-center overflow-hidden touch-pan-y"
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
  );
}
