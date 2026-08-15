import { useRef, useState } from "react";

import ArtistFrame from "@/components/oneToOneOrder/ArtistFrame";

type Artist = {
  id: number;
  image: string;
  name: string;
};

type ArtistSliderProps = {
  artists: Artist[];
  selectedArtistId: number | null;
  onSelectArtist: (artistId: number | null) => void;
};

const CARD_STEP = 240;
const SWIPE_THRESHOLD = 60;
const ANIMATION_DURATION = 300;

export default function ArtistSlider({
  artists,
  selectedArtistId,
  onSelectArtist,
}: ArtistSliderProps) {
  const dragStartX = useRef<number | null>(null);
  const hasDragged = useRef(false);

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
    hasDragged.current = false;

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) return;

    const distance = event.clientX - dragStartX.current;

    if (Math.abs(distance) > 5) {
      hasDragged.current = true;
    }

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
        setCurrentIndex(nextIndex);
        setDragOffset(0);
        setIsAnimating(false);
      }, ANIMATION_DURATION);

      return;
    }

    // 오른쪽으로 넘김 → 이전 작가
    if (dragOffset > SWIPE_THRESHOLD) {
      setIsAnimating(true);
      setDragOffset(CARD_STEP);

      setTimeout(() => {
        setCurrentIndex(previousIndex);
        setDragOffset(0);
        setIsAnimating(false);
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
    hasDragged.current = false;

    setDragOffset(0);
    setIsDragging(false);
    setIsAnimating(false);
  };

  const handleArtistClick = () => {
    // 스와이프한 경우 클릭으로 처리하지 않음
    if (hasDragged.current) return;

    // 이미 선택된 작가를 다시 클릭하면 선택 취소
    if (selectedArtistId === currentArtist.id) {
      onSelectArtist(null);
      return;
    }

    // 선택되지 않은 작가라면 선택
    onSelectArtist(currentArtist.id);
  };

  const transitionClass =
    isAnimating && !isDragging ? "transition-transform duration-300 ease-out" : "";

  return (
    <div className="flex flex-col items-center">
      {/* 작가 이미지 슬라이더 */}
      <div
        className="relative flex h-100 w-full select-none items-center justify-center overflow-hidden touch-pan-y"
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
          <ArtistFrame image={previousPreviousArtist.image} name={previousPreviousArtist.name} />
        </div>

        {/* 이전 작가 */}
        <div
          className={`absolute left-1/2 ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% - ${CARD_STEP}px + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame image={previousArtist.image} name={previousArtist.name} />
        </div>

        {/* 현재 작가 */}
        <div
          onClick={handleArtistClick}
          className={`absolute left-1/2 z-10 cursor-pointer ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame
            image={currentArtist.image}
            name={currentArtist.name}
            isSelected={selectedArtistId === currentArtist.id}
          />
        </div>

        {/* 다음 작가 */}
        <div
          className={`absolute left-1/2 ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% + ${CARD_STEP}px + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame image={nextArtist.image} name={nextArtist.name} />
        </div>

        {/* 다음 다음 작가 */}
        <div
          className={`absolute left-1/2 ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% + ${CARD_STEP * 2}px + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame image={nextNextArtist.image} name={nextNextArtist.name} />
        </div>
      </div>

      {/* 현재 작가 위치 표시 */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {artists.map((artist, index) => (
          <span
            key={artist.id}
            className={`h-2.5 w-2.5 rounded-full ${
              index === currentIndex ? "bg-[#A86A34]" : "bg-[#D0D0D0]"
            }`}
          />
        ))}
      </div>

      {/* 현재 작가 이름 */}
      <p className="mt-4 text-center text-[24px] font-extrabold text-[#192A40]">
        {currentArtist.name}
      </p>

      {/* 고정 설명 */}
      <p className="mt-2 text-center text-[14px] font-medium leading-5 text-[#AC917C]">
        멋쟁이사자처럼님의 여행 스타일과 어울리는
        <br />
        <span className="font-extrabold text-[#A3642B]">성주재단 파트너 아티스트 3명</span>을
        추천합니다.
      </p>
    </div>
  );
}
