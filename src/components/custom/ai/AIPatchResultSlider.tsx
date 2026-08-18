import { useEffect, useRef } from "react";

import type { AIPatchResultItem } from "@/mocks/aiPatchResult.mock";

interface AIPatchResultSliderProps {
  patches: AIPatchResultItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const AIPatchResultSlider = ({
  patches,
  currentIndex,
  onIndexChange,
}: AIPatchResultSliderProps) => {
  // 슬라이더 전체 영역 ref임
  const sliderRef = useRef<HTMLDivElement>(null);

  // 각각의 패치 카드 DOM 저장용 ref임
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 클릭으로 자동 스크롤 중인지 구분함
  const isProgrammaticScrollRef = useRef(false);

  // 자동 스크롤 종료 타이머임
  const scrollTimerRef = useRef<number | null>(null);

  // 선택한 패치를 슬라이더 가운데로 이동함
  const moveToPatch = (index: number) => {
    const slider = sliderRef.current;
    const target = itemRefs.current[index];

    if (!slider || !target) return;

    // 클릭 이동 중에는 onScroll에서 index 변경하지 않도록 막음
    isProgrammaticScrollRef.current = true;

    // 선택한 카드의 중앙 위치 계산함
    const targetLeft = target.offsetLeft - slider.clientWidth / 2 + target.clientWidth / 2;

    slider.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });

    // 기존 타이머가 있으면 제거함
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    // smooth scroll 종료 후 다시 직접 스와이프 감지 허용함
    scrollTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 400);
  };

  // 옆 패치를 클릭하면 해당 패치를 선택하고 가운데로 이동함
  const handlePatchClick = (index: number) => {
    if (index === currentIndex) return;

    onIndexChange(index);
    moveToPatch(index);
  };

  // 사용자가 직접 스와이프한 경우 가운데에 가까운 패치를 찾음
  const handleScroll = () => {
    // 클릭으로 이동 중이면 스크롤 이벤트 무시함
    if (isProgrammaticScrollRef.current) return;

    const slider = sliderRef.current;

    if (!slider) return;

    const sliderRect = slider.getBoundingClientRect();

    // 현재 슬라이더 화면의 중앙 좌표임
    const sliderCenter = sliderRect.left + sliderRect.width / 2;

    let closestIndex = currentIndex;
    let closestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const itemRect = item.getBoundingClientRect();

      const itemCenter = itemRect.left + itemRect.width / 2;

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

  // dot 등 외부에서 currentIndex가 변경됐을 때 해당 패치로 이동함
  const handleIndicatorClick = (index: number) => {
    onIndexChange(index);
    moveToPatch(index);
  };

  // 컴포넌트 제거 시 타이머 정리함
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* AI 패치 결과 슬라이더임 */}
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
                className="pointer-events-none aspect-square w-full select-none object-contain"
              />
            </button>
          );
        })}
      </div>

      {/* 현재 패치 위치 인디케이터임 */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {patches.map((patch, index) => (
          <button
            key={patch.id}
            type="button"
            onClick={() => handleIndicatorClick(index)}
            aria-label={`패치 ${index + 1}안 보기`}
            className={`h-3 w-3 rounded-full transition ${
              index === currentIndex ? "bg-[#A3642B]" : "bg-[#D8D8D8]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AIPatchResultSlider;
