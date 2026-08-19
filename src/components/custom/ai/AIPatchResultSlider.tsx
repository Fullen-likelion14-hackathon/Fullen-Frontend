import { useEffect, useRef } from "react";

import type { GeneratedPatch } from "@/stores/aiPatchStore";

interface AIPatchResultSliderProps {
  // AI 생성 패치 결과 목록
  patches: GeneratedPatch[];

  // 현재 중앙 패치 index
  currentIndex: number;

  // 현재 패치 index 변경 함수
  onIndexChange: (index: number) => void;
}

const AIPatchResultSlider = ({
  patches,
  currentIndex,
  onIndexChange,
}: AIPatchResultSliderProps) => {
  // 슬라이더 전체 영역 ref
  const sliderRef = useRef<HTMLDivElement>(null);

  // 패치 카드 DOM 목록 ref
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 자동 스크롤 여부 ref
  const isProgrammaticScrollRef = useRef(false);

  // 자동 스크롤 종료 타이머 ref
  const scrollTimerRef = useRef<number | null>(null);

  // 선택 패치 중앙 이동 처리
  const moveToPatch = (index: number) => {
    const slider = sliderRef.current;

    const target = itemRefs.current[index];

    if (!slider || !target) {
      return;
    }

    // 자동 스크롤 상태
    isProgrammaticScrollRef.current = true;

    // 선택 카드 중앙 위치
    const targetLeft = target.offsetLeft - slider.clientWidth / 2 + target.clientWidth / 2;

    slider.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });

    // 기존 스크롤 타이머 정리
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    // 자동 스크롤 종료 처리
    scrollTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 400);
  };

  // 패치 카드 클릭 처리
  const handlePatchClick = (index: number) => {
    if (index === currentIndex) {
      return;
    }

    onIndexChange(index);

    moveToPatch(index);
  };

  // 직접 스와이프 위치 계산 처리
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const sliderRect = slider.getBoundingClientRect();

    // 슬라이더 화면 중앙 좌표
    const sliderCenter = sliderRect.left + sliderRect.width / 2;

    let closestIndex = currentIndex;

    let closestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const itemRect = item.getBoundingClientRect();

      // 패치 카드 중앙 좌표
      const itemCenter = itemRect.left + itemRect.width / 2;

      // 슬라이더 중앙 기준 패치 카드 거리
      const distance = Math.abs(sliderCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;

        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndex) {
      onIndexChange(closestIndex);
    }
  };

  // 인디케이터 클릭 처리
  const handleIndicatorClick = (index: number) => {
    onIndexChange(index);

    moveToPatch(index);
  };

  // 컴포넌트 제거 시 타이머 정리 처리
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // 패치 목록 변경 시 ref 목록 정리 처리
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, patches.length);
  }, [patches.length]);

  return (
    <div className="w-full overflow-hidden">
      {/* AI 패치 결과 슬라이더 영역 */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="
          flex
          snap-x
          snap-mandatory
          gap-6
          overflow-x-auto
          scroll-smooth
          px-18
          py-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {patches.map((patch, index) => {
          // 현재 패치 선택 여부
          const isSelected = index === currentIndex;

          return (
            <button
              key={patch.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              onClick={() => handlePatchClick(index)}
              aria-label={`패치 ${index + 1}안 선택`}
              aria-pressed={isSelected}
              className={`
                w-61.5
                shrink-0
                snap-center
                cursor-pointer
                transition-all
                duration-300
                ${isSelected ? "scale-100 opacity-100" : "scale-95 opacity-80"}
              `}
            >
              <img
                src={patch.image}
                alt={`AI 패치 ${index + 1}안`}
                draggable={false}
                className="
                  pointer-events-none
                  aspect-square
                  w-full
                  select-none
                  object-contain
                "
              />
            </button>
          );
        })}
      </div>

      {/* 현재 패치 위치 인디케이터 영역 */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {patches.map((patch, index) => (
          <button
            key={patch.id}
            type="button"
            onClick={() => handleIndicatorClick(index)}
            aria-label={`패치 ${index + 1}안 보기`}
            aria-pressed={index === currentIndex}
            className={`
              h-3
              w-3
              rounded-full
              transition
              ${index === currentIndex ? "bg-[#A3642B]" : "bg-[#D8D8D8]"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default AIPatchResultSlider;
