import { useEffect, useRef, useState } from "react";

import ArtistFrame from "@/components/oneToOneOrder/ArtistFrame";

import type { Artist } from "@/types/artist";

type ArtistSliderProps = {
  artists: Artist[];
  selectedArtistId: number | null;
  onSelectArtist: (artistId: number | null) => void;

  // 상세보기
  onDetailArtist: (artist: Artist) => void;
};

const CARD_STEP = 240;
const SWIPE_THRESHOLD = 60;
const ANIMATION_DURATION = 300;

export default function ArtistSlider({
  artists,
  selectedArtistId,
  onSelectArtist,
  onDetailArtist,
}: ArtistSliderProps) {
  // 드래그 시작 위치
  const dragStartX = useRef<number | null>(null);

  // 실제로 드래그가 발생했는지 확인
  const hasDragged = useRef(false);

  // 슬라이드 애니메이션 타이머
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // setTimeout 내부에서도 최신 작가 수를 사용할 수 있도록 저장
  const artistsLengthRef = useRef(artists.length);
  artistsLengthRef.current = artists.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 컴포넌트가 사라질 때 남아있는 애니메이션 타이머 제거
  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  // API 연결 후 데이터가 아직 없을 때 오류 방지
  if (artists.length === 0) {
    return null;
  }

  // API 응답으로 작가 수가 변경되어도 안전한 인덱스 사용
  const safeCurrentIndex = currentIndex % artists.length;

  const previousPreviousIndex = (safeCurrentIndex - 2 + artists.length) % artists.length;

  const previousIndex = (safeCurrentIndex - 1 + artists.length) % artists.length;

  const nextIndex = (safeCurrentIndex + 1) % artists.length;

  const nextNextIndex = (safeCurrentIndex + 2) % artists.length;

  const previousPreviousArtist = artists[previousPreviousIndex];
  const previousArtist = artists[previousIndex];
  const currentArtist = artists[safeCurrentIndex];
  const nextArtist = artists[nextIndex];
  const nextNextArtist = artists[nextNextIndex];

  // 기존 애니메이션 타이머 제거
  const clearAnimationTimer = () => {
    if (animationTimerRef.current !== null) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  };

  // 애니메이션 타이머 실행
  const startAnimationTimer = (callback: () => void) => {
    clearAnimationTimer();

    animationTimerRef.current = setTimeout(() => {
      callback();
      animationTimerRef.current = null;
    }, ANIMATION_DURATION);
  };

  // 드래그 시작
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    dragStartX.current = event.clientX;
    hasDragged.current = false;

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  // 드래그 중
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) {
      return;
    }

    const distance = event.clientX - dragStartX.current;

    // 일정 거리 이상 움직이면 클릭이 아닌 드래그로 판단
    if (Math.abs(distance) > 5) {
      hasDragged.current = true;
    }

    setDragOffset(distance);
  };

  // 드래그 종료
  const handlePointerUp = () => {
    if (dragStartX.current === null || isAnimating) {
      return;
    }

    dragStartX.current = null;
    setIsDragging(false);

    // 왼쪽으로 넘김 → 다음 작가
    if (dragOffset < -SWIPE_THRESHOLD) {
      setIsAnimating(true);
      setDragOffset(-CARD_STEP);

      startAnimationTimer(() => {
        setCurrentIndex((prev) => {
          const length = artistsLengthRef.current;

          if (length === 0) return 0;

          const safeIndex = prev % length;

          return (safeIndex + 1) % length;
        });

        setDragOffset(0);
        setIsAnimating(false);
      });

      return;
    }

    // 오른쪽으로 넘김 → 이전 작가
    if (dragOffset > SWIPE_THRESHOLD) {
      setIsAnimating(true);
      setDragOffset(CARD_STEP);

      startAnimationTimer(() => {
        setCurrentIndex((prev) => {
          const length = artistsLengthRef.current;

          if (length === 0) return 0;

          const safeIndex = prev % length;

          return (safeIndex - 1 + length) % length;
        });

        setDragOffset(0);
        setIsAnimating(false);
      });

      return;
    }

    // 스와이프 기준을 넘지 못하면 원래 위치로 복귀
    setIsAnimating(true);
    setDragOffset(0);

    startAnimationTimer(() => {
      setIsAnimating(false);
    });
  };

  // 포인터 이벤트가 중간에 취소된 경우 초기화
  const handlePointerCancel = () => {
    dragStartX.current = null;
    hasDragged.current = false;

    clearAnimationTimer();

    setDragOffset(0);
    setIsDragging(false);
    setIsAnimating(false);
  };

  // 현재 가운데 작가 선택
  const handleArtistClick = () => {
    // 스와이프한 경우 클릭으로 처리하지 않음
    if (hasDragged.current) return;

    onSelectArtist(currentArtist.artistId);
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
          <ArtistFrame
            image={previousPreviousArtist.imgUrl}
            name={previousPreviousArtist.artistName}
          />
        </div>

        {/* 이전 작가 */}
        <div
          className={`absolute left-1/2 ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% - ${CARD_STEP}px + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame image={previousArtist.imgUrl} name={previousArtist.artistName} />
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
            image={currentArtist.imgUrl}
            name={currentArtist.artistName}
            isSelected={selectedArtistId === currentArtist.artistId}
            onDetail={() => onDetailArtist(currentArtist)}
          />
        </div>

        {/* 다음 작가 */}
        <div
          className={`absolute left-1/2 ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% + ${CARD_STEP}px + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame image={nextArtist.imgUrl} name={nextArtist.artistName} />
        </div>

        {/* 다음 다음 작가 */}
        <div
          className={`absolute left-1/2 ${transitionClass}`}
          style={{
            transform: `translateX(calc(-50% + ${CARD_STEP * 2}px + ${dragOffset}px))`,
          }}
        >
          <ArtistFrame image={nextNextArtist.imgUrl} name={nextNextArtist.artistName} />
        </div>
      </div>

      {/* 현재 작가 위치 표시 */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {artists.map((artist, index) => (
          <span
            key={artist.artistId}
            className={`h-2.5 w-2.5 rounded-full ${
              index === safeCurrentIndex ? "bg-[#A86A34]" : "bg-[#D0D0D0]"
            }`}
          />
        ))}
      </div>

      {/* 현재 작가 이름 */}
      <p className="mt-4 text-center text-[1.5rem] font-extrabold text-[#192A40]">
        {currentArtist.artistName}
      </p>

      {/* AI 추천 고정 설명 */}
      <p className="mt-3 text-center text-[max(12px,0.875rem)] font-medium leading-5 text-[#AC917C]">
        멋쟁이사자처럼님의 여행 스타일과 어울리는
        <br />
        <span className="font-extrabold text-[#A3642B]">성주재단 파트너 아티스트 3명</span>을
        추천합니다.
      </p>
    </div>
  );
}
