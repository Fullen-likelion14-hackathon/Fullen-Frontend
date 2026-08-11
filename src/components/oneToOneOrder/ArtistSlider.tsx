import { useRef, useState } from "react";

import ArtistFrame from "@/components/oneToOneOrder/ArtistFrame";

type Artist = {
  id: number;
  image: string;
  name: string;
  description: string;
};

type ArtistSliderProps = {
  artists: Artist[];
};

const CARD_STEP = 240;
const SWIPE_THRESHOLD = 60;
const ANIMATION_DURATION = 300;

export default function ArtistSlider({ artists }: ArtistSliderProps) {
  const dragStartX = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const previousPreviousIndex = (currentIndex - 2 + artists.length) % artists.length;

  const previousIndex = (currentIndex - 1 + artists.length) % artists.length;

  const nextIndex = (currentIndex + 1) % artists.length;

  const nextNextIndex = (currentIndex + 2) % artists.length;

  const previousPreviousArtist = artists[previousPreviousIndex];
  const previousArtist = artists[previousIndex];
  const currentArtist = artists[currentIndex];
  const nextArtist = artists[nextIndex];
  const nextNextArtist = artists[nextNextIndex];

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    dragStartX.current = event.clientX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) return;

    const distance = event.clientX - dragStartX.current;

    setDragOffset(distance);
  };

  const handlePointerUp = () => {
    if (dragStartX.current === null || isAnimating) return;

    dragStartX.current = null;
    setIsDragging(false);

    // 왼쪽으로 넘김 → 다음 작가
    if (dragOffset < -SWIPE_THRESHOLD) {
      setIsAnimating(true);
      setDragOffset(-CARD_STEP);

      setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(nextIndex);
        setDragOffset(0);
      }, ANIMATION_DURATION);

      return;
    }

    // 오른쪽으로 넘김 → 이전 작가
    if (dragOffset > SWIPE_THRESHOLD) {
      setIsAnimating(true);
      setDragOffset(CARD_STEP);

      setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(previousIndex);
        setDragOffset(0);
      }, ANIMATION_DURATION);

      return;
    }

    setIsAnimating(true);
    setDragOffset(0);

    setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  const handlePointerCancel = () => {
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
    setIsAnimating(false);
  };

  const transitionClass =
    isAnimating && !isDragging ? "transition-transform duration-300 ease-out" : "";

  return (
    <div
      className="relative flex h-125 w-full select-none items-center justify-center overflow-hidden touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDragStart={(event) => event.preventDefault()}
    >
      {/* 이전 이전 작가 */}
      <div
        className={`absolute left-1/2 ${transitionClass}`}
        style={{
          transform: `translateX(calc(-50% - ${CARD_STEP * 2}px + ${dragOffset}px))`,
        }}
      >
        <ArtistFrame
          image={previousPreviousArtist.image}
          name={previousPreviousArtist.name}
          description={previousPreviousArtist.description}
        />
      </div>

      {/* 이전 작가 */}
      <div
        className={`absolute left-1/2 ${transitionClass}`}
        style={{
          transform: `translateX(calc(-50% - ${CARD_STEP}px + ${dragOffset}px))`,
        }}
      >
        <ArtistFrame
          image={previousArtist.image}
          name={previousArtist.name}
          description={previousArtist.description}
        />
      </div>

      {/* 현재 작가 */}
      <div
        className={`absolute left-1/2 z-10 ${transitionClass}`}
        style={{
          transform: `translateX(calc(-50% + ${dragOffset}px))`,
        }}
      >
        <ArtistFrame
          image={currentArtist.image}
          name={currentArtist.name}
          description={currentArtist.description}
        />
      </div>

      {/* 다음 작가 */}
      <div
        className={`absolute left-1/2 ${transitionClass}`}
        style={{
          transform: `translateX(calc(-50% + ${CARD_STEP}px + ${dragOffset}px))`,
        }}
      >
        <ArtistFrame
          image={nextArtist.image}
          name={nextArtist.name}
          description={nextArtist.description}
        />
      </div>

      {/* 다음 다음 작가 */}
      <div
        className={`absolute left-1/2 ${transitionClass}`}
        style={{
          transform: `translateX(calc(-50% + ${CARD_STEP * 2}px + ${dragOffset}px))`,
        }}
      >
        <ArtistFrame
          image={nextNextArtist.image}
          name={nextNextArtist.name}
          description={nextNextArtist.description}
        />
      </div>
    </div>
  );
}
