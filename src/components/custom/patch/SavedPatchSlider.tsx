import { useEffect, useRef, useState } from "react";

import type { SavedPatch } from "@/stores/aiPatchStore";

interface SavedPatchSliderProps {
  // 현재 선택한 타입에 해당하는 저장 패치 목록임
  patches: SavedPatch[];

  // 현재 선택된 패치 index임
  currentIndex: number;

  // 선택된 패치 index 변경 함수임
  onIndexChange: (index: number) => void;
}

const SavedPatchSlider = ({ patches, currentIndex, onIndexChange }: SavedPatchSliderProps) => {
  // 슬라이더 전체 영역 ref임
  const sliderRef = useRef<HTMLDivElement>(null);

  // 각각의 패치 버튼 DOM 저장용 ref임
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 클릭에 의한 자동 스크롤 여부임
  const isProgrammaticScrollRef = useRef(false);

  // 자동 스크롤 종료 타이머임
  const scrollTimerRef = useRef<number | null>(null);

  // 첫 번째와 마지막 패치도 화면 정중앙까지 이동할 수 있도록
  // 슬라이더 양쪽에 필요한 여백 저장함
  const [sidePadding, setSidePadding] = useState(0);

  // 슬라이더 너비를 기준으로 좌우 여백 계산함
  const updateSidePadding = () => {
    const slider = sliderRef.current;
    const firstItem = itemRefs.current[0];

    if (!slider || !firstItem) return;

    // 화면 중앙에서 패치 절반 크기를 제외한 만큼 좌우 여백 생성함
    const padding = slider.clientWidth / 2 - firstItem.clientWidth / 2;

    setSidePadding(Math.max(0, padding));
  };

  // 선택한 패치를 화면의 세로 중앙선으로 이동함
  const moveToPatch = (index: number) => {
    const slider = sliderRef.current;
    const target = itemRefs.current[index];

    if (!slider || !target) return;

    // 클릭 이동 중에는 onScroll에서 index가 다시 바뀌지 않도록 처리함
    isProgrammaticScrollRef.current = true;

    // 선택한 패치의 중앙과 슬라이더의 중앙을 정확히 맞춤
    const targetCenter = target.offsetLeft + target.clientWidth / 2;

    const sliderCenter = slider.clientWidth / 2;

    const targetLeft = targetCenter - sliderCenter;

    slider.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });

    // 기존 타이머 정리함
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    // smooth scroll 종료 후 직접 스와이프 감지 다시 허용함
    scrollTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 400);
  };

  // 옆 패치를 클릭했을 때 해당 패치를 중앙으로 이동함
  const handlePatchClick = (index: number) => {
    if (index === currentIndex) return;

    onIndexChange(index);
    moveToPatch(index);
  };

  // 직접 스와이프했을 때 화면 중앙에 가장 가까운 패치 찾음
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) return;

    const slider = sliderRef.current;

    if (!slider) return;

    const sliderRect = slider.getBoundingClientRect();

    // 현재 화면의 정확한 중앙 좌표임
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

  // 패치 개수 변경 시 슬라이더 양쪽 여백 다시 계산함
  useEffect(() => {
    updateSidePadding();

    window.addEventListener("resize", updateSidePadding);

    return () => {
      window.removeEventListener("resize", updateSidePadding);
    };
  }, [patches]);

  // currentIndex 변경 시 항상 선택 패치를 중앙으로 이동함
  useEffect(() => {
    if (patches.length === 0) return;

    // DOM 렌더링 완료 후 중앙 이동함
    requestAnimationFrame(() => {
      moveToPatch(currentIndex);
    });
  }, [currentIndex, patches]);

  // 컴포넌트 제거 시 타이머 정리함
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // 선택한 타입에 저장된 패치가 없는 경우임
  if (patches.length === 0) {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <p className="text-sm font-semibold text-[#B89B84]">저장된 패치가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* 저장된 패치 가로 슬라이더임 */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        style={{
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
        }}
        className="
          flex
          snap-x
          snap-mandatory
          items-center
          gap-3
          overflow-x-auto
          scroll-smooth
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
              aria-label={`저장 패치 ${index + 1} 선택`}
              className={`
                flex
                h-19
                w-19
                shrink-0
                snap-center
                items-center
                justify-center
                rounded-lg
                border-3
                transition-all
                duration-300
                ${isSelected ? "border-[#192C44] bg-white" : "border-transparent bg-transparent"}
              `}
            >
              {/* 패치 이미지 크기는 63px로 고정함 */}
              <img
                src={patch.image}
                alt={`저장된 패치 ${index + 1}`}
                draggable={false}
                className="
                  pointer-events-none
                  h-15.75
                  w-15.75
                  select-none
                  object-contain
                "
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPatchSlider;
