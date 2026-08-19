import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

import type { SavedPatch } from "@/stores/aiPatchStore";

interface SavedPatchSliderProps {
  // 현재 패치 종류에 해당하는 저장 패치 목록임
  patches: SavedPatch[];

  // 현재 활성화된 저장 패치 index임
  // 아무 패치도 활성화되지 않은 경우 null임
  currentIndex: number | null;

  // 활성 패치 index 변경 함수임
  onIndexChange: (index: number | null) => void;

  // 저장 패치 활성화 함수임
  onPatchActivate: (patch: SavedPatch) => void;

  // 저장 패치 영구 삭제 요청 함수임
  onDeleteRequest: (patch: SavedPatch) => void;
}

const SavedPatchSlider = ({
  patches,
  currentIndex,
  onIndexChange,
  onPatchActivate,
  onDeleteRequest,
}: SavedPatchSliderProps) => {
  // 슬라이더 전체 영역 ref임
  const sliderRef = useRef<HTMLDivElement>(null);

  // 실제 패치 목록 영역 ref임
  const trackRef = useRef<HTMLDivElement>(null);

  // 각 패치 카드 DOM ref임
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 원클릭 / 더블클릭 구분 타이머임
  const clickTimerRef = useRef<number | null>(null);

  // 자동 스크롤 여부임
  const isProgrammaticScrollRef = useRef(false);

  // 자동 스크롤 종료 타이머임
  const scrollTimerRef = useRef<number | null>(null);

  // 슬라이더 양쪽 여백임
  const [sidePadding, setSidePadding] = useState(0);

  // 현재 삭제 모드 패치 id임
  const [deleteModePatchId, setDeleteModePatchId] = useState<string | null>(null);

  // 패치 목록 전체를 중앙 기준으로 정렬하기 위한 여백 계산함
  const updateSidePadding = () => {
    const slider = sliderRef.current;

    const firstItem = itemRefs.current[0];

    if (!slider || !firstItem) return;

    const itemWidth = firstItem.clientWidth;

    const gap = 12;

    const contentWidth = patches.length * itemWidth + Math.max(0, patches.length - 1) * gap;

    // 전체 패치가 화면 안에 들어오는 경우 목록 전체를 가운데 배치함
    if (contentWidth <= slider.clientWidth) {
      setSidePadding(Math.max(0, (slider.clientWidth - contentWidth) / 2));

      return;
    }

    // 패치가 화면보다 많은 경우 첫 패치와 마지막 패치도 중앙 이동 가능하도록 처리함
    setSidePadding(Math.max(0, slider.clientWidth / 2 - itemWidth / 2));
  };

  // 선택한 패치를 화면 중앙으로 이동함
  const moveToPatch = (index: number) => {
    const slider = sliderRef.current;

    const target = itemRefs.current[index];

    if (!slider || !target) return;

    isProgrammaticScrollRef.current = true;

    const targetCenter = target.offsetLeft + target.clientWidth / 2;

    const sliderCenter = slider.clientWidth / 2;

    slider.scrollTo({
      left: targetCenter - sliderCenter,

      behavior: "smooth",
    });

    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 400);
  };

  // 패치 종류 선택 직후 전체 목록을 중앙 기준으로 보여줌
  const moveToListCenter = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    requestAnimationFrame(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollTo({
        left: maxScroll > 0 ? maxScroll / 2 : 0,

        behavior: "auto",
      });
    });
  };

  // 패치 원클릭 처리함
  const handlePatchClick = (patch: SavedPatch, index: number) => {
    // 기존 예약 클릭 제거함
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }

    // 더블클릭 여부 확인 후 원클릭 처리함
    clickTimerRef.current = window.setTimeout(() => {
      // 삭제 모드 해제함
      setDeleteModePatchId(null);

      // 해당 패치 활성화함
      onIndexChange(index);

      // 가방 위 편집 상태에 패치 추가함
      onPatchActivate(patch);

      // 클릭 패치를 화면 중앙으로 이동함
      moveToPatch(index);

      clickTimerRef.current = null;
    }, 220);
  };

  // 패치 더블클릭 처리함
  const handlePatchDoubleClick = (patchId: string) => {
    // 예약된 원클릭 동작 취소함
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);

      clickTimerRef.current = null;
    }

    // 가방 활성화 없이 삭제 모드만 변경함
    setDeleteModePatchId((prev) => (prev === patchId ? null : patchId));
  };

  // 쓰레기통 클릭 처리함
  const handleDeleteClick = (patch: SavedPatch) => {
    onDeleteRequest(patch);

    // WarningModal이 열리므로 슬라이더 쓰레기통은 숨김
    setDeleteModePatchId(null);
  };

  // 직접 스와이프한 경우 중앙에 가장 가까운 패치 계산함
  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) {
      return;
    }

    const slider = sliderRef.current;

    if (!slider) return;

    const sliderRect = slider.getBoundingClientRect();

    const sliderCenter = sliderRect.left + sliderRect.width / 2;

    let closestIndex: number | null = null;

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

    // 스와이프는 패치 활성화가 아니라 화면 중앙 이동만 처리함
    // 기존 활성화 패치 상태는 그대로 유지함
    if (closestIndex !== null && currentIndex !== null && closestIndex !== currentIndex) {
      return;
    }
  };

  // 패치 목록 변경 시 좌우 여백 다시 계산함
  useEffect(() => {
    requestAnimationFrame(() => {
      updateSidePadding();
      moveToListCenter();
    });

    window.addEventListener("resize", updateSidePadding);

    return () => {
      window.removeEventListener("resize", updateSidePadding);
    };
  }, [patches]);

  // 활성 패치가 변경되면 해당 패치를 중앙으로 이동함
  useEffect(() => {
    if (currentIndex === null) {
      return;
    }

    if (!patches[currentIndex]) {
      return;
    }

    requestAnimationFrame(() => {
      moveToPatch(currentIndex);
    });
  }, [currentIndex, patches]);

  // 삭제 모드에서 다른 영역 클릭 감지함
  useEffect(() => {
    if (!deleteModePatchId) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const deleteIndex = patches.findIndex((patch) => patch.id === deleteModePatchId);

      const deleteCard = itemRefs.current[deleteIndex];

      // 현재 삭제 패치 내부 클릭이면 유지함
      if (deleteCard && deleteCard.contains(target)) {
        return;
      }

      // 다른 영역 클릭 시 쓰레기통 숨김
      setDeleteModePatchId(null);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [deleteModePatchId, patches]);

  // 삭제된 패치의 삭제 모드 상태 정리함
  useEffect(() => {
    if (!deleteModePatchId) {
      return;
    }

    const exists = patches.some((patch) => patch.id === deleteModePatchId);

    if (!exists) {
      setDeleteModePatchId(null);
    }
  }, [deleteModePatchId, patches]);

  // 타이머 정리함
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
      }

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // 저장 패치가 없는 경우임
  if (patches.length === 0) {
    return (
      <div
        className="
          flex
          h-20
          w-full
          items-center
          justify-center
        "
      >
        <p className="text-sm font-semibold text-[#B89B84]">저장된 패치가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-10 overflow-hidden">
      {/* 저장 패치 가로 슬라이더임 */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="
          w-full
          overflow-x-auto
          scroll-smooth
          py-2
          scrollbar-none
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* 실제 저장 패치 목록임 */}
        <div
          ref={trackRef}
          style={{
            paddingLeft: sidePadding,

            paddingRight: sidePadding,
          }}
          className="
            flex
            w-max
            items-center
            gap-3
          "
        >
          {patches.map((patch, index) => {
            // 현재 활성화 패치 여부임
            const isSelected = currentIndex === index;

            // 현재 삭제 모드 여부임
            const isDeleteMode = deleteModePatchId === patch.id;

            return (
              <div
                key={patch.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className="
                    relative
                    h-19
                    w-19
                    shrink-0
                  "
              >
                {/* 저장 패치 선택 버튼임 */}
                <button
                  type="button"
                  onClick={() => handlePatchClick(patch, index)}
                  onDoubleClick={() => handlePatchDoubleClick(patch.id)}
                  aria-label={`저장 패치 ${index + 1} 선택`}
                  className={`
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-lg
                      border-3
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "border-[#192C44] bg-white"
                          : "border-transparent bg-transparent"
                      }
                    `}
                >
                  {/* 저장 패치 이미지임 */}
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

                {/* 더블클릭 시 나타나는 저장 패치 삭제 버튼임 */}
                {isDeleteMode && (
                  <button
                    type="button"
                    aria-label={`저장 패치 ${index + 1} 삭제`}
                    onClick={(event) => {
                      event.stopPropagation();

                      handleDeleteClick(patch);
                    }}
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-black/45
                      "
                  >
                    <Trash2 size={28} strokeWidth={2.5} className="text-white" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedPatchSlider;
