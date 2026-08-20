import { useEffect, useRef, useState } from "react";

import { Trash2 } from "lucide-react";

import type { SavedPatch } from "@/stores/aiPatchStore";

interface SavedPatchSliderProps {
  // 현재 패치 종류 저장 목록
  patches: SavedPatch[];

  // 현재 활성 저장 패치 index
  currentIndex: number | null;

  // 활성 저장 패치 index 변경
  onIndexChange: (index: number | null) => void;

  // 저장 패치 가방 추가
  onPatchActivate: (patch: SavedPatch) => void;

  // 저장 패치 영구삭제 요청
  onDeleteRequest: (patch: SavedPatch) => void;
}

interface PendingClick {
  patch: SavedPatch;

  index: number;
}

// 더블클릭 판별 시간
const DOUBLE_CLICK_DELAY = 260;

const SavedPatchSlider = ({
  patches,
  currentIndex,
  onIndexChange,
  onPatchActivate,
  onDeleteRequest,
}: SavedPatchSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 첫 번째 클릭 대기 상태
  const pendingClickRef = useRef<PendingClick | null>(null);

  // 싱글클릭 실행 타이머
  const clickTimerRef = useRef<number | null>(null);

  const isProgrammaticScrollRef = useRef(false);

  const scrollTimerRef = useRef<number | null>(null);

  const [sidePadding, setSidePadding] = useState(0);

  // 영구삭제 UI 표시 패치
  const [deleteModePatchId, setDeleteModePatchId] = useState<string | null>(null);

  // 패치 목록 중앙 정렬 여백
  const updateSidePadding = () => {
    const slider = sliderRef.current;

    const firstItem = itemRefs.current[0];

    if (!slider || !firstItem) {
      return;
    }

    const itemWidth = firstItem.clientWidth;

    const gap = 12;

    const contentWidth = patches.length * itemWidth + Math.max(0, patches.length - 1) * gap;

    if (contentWidth <= slider.clientWidth) {
      setSidePadding(Math.max(0, (slider.clientWidth - contentWidth) / 2));

      return;
    }

    setSidePadding(Math.max(0, slider.clientWidth / 2 - itemWidth / 2));
  };

  // 선택 패치 중앙 이동
  const moveToPatch = (index: number) => {
    const slider = sliderRef.current;

    const target = itemRefs.current[index];

    if (!slider || !target) {
      return;
    }

    isProgrammaticScrollRef.current = true;

    const targetCenter = target.offsetLeft + target.clientWidth / 2;

    const sliderCenter = slider.clientWidth / 2;

    slider.scrollTo({
      left: targetCenter - sliderCenter,

      behavior: "smooth",
    });

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 400);
  };

  // 패치 종류 선택 직후 목록 중앙 이동
  const moveToListCenter = () => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    requestAnimationFrame(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      slider.scrollTo({
        left: maxScroll > 0 ? maxScroll / 2 : 0,

        behavior: "auto",
      });
    });
  };

  // 싱글클릭 실제 실행
  const runSingleClick = (patch: SavedPatch, index: number) => {
    setDeleteModePatchId(null);

    // 이미 활성화된 패치 재클릭
    if (currentIndex === index) {
      onIndexChange(null);

      return;
    }

    // 비활성 패치 활성화
    onIndexChange(index);

    // 새 패치 인스턴스 생성
    onPatchActivate(patch);

    moveToPatch(index);
  };

  // 저장 패치 클릭 판별
  const handlePatchClick = (patch: SavedPatch, index: number) => {
    const pendingClick = pendingClickRef.current;

    // 같은 패치의 두 번째 클릭
    if (pendingClick && pendingClick.patch.id === patch.id) {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);

        clickTimerRef.current = null;
      }

      pendingClickRef.current = null;

      // 더블클릭은 목록 active 해제
      onIndexChange(null);

      // 더블클릭은 패치 생성 없이 영구삭제 모드
      setDeleteModePatchId(patch.id);

      return;
    }

    // 다른 패치의 첫 클릭이 대기 중인 경우 먼저 실행
    if (pendingClick) {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);

        clickTimerRef.current = null;
      }

      runSingleClick(pendingClick.patch, pendingClick.index);

      pendingClickRef.current = null;
    }

    // 현재 클릭을 싱글클릭 후보로 저장
    pendingClickRef.current = {
      patch,

      index,
    };

    clickTimerRef.current = window.setTimeout(() => {
      const currentPendingClick = pendingClickRef.current;

      if (!currentPendingClick) {
        return;
      }

      runSingleClick(currentPendingClick.patch, currentPendingClick.index);

      pendingClickRef.current = null;

      clickTimerRef.current = null;
    }, DOUBLE_CLICK_DELAY);
  };

  // 목록 영구삭제 버튼
  const handleDeleteClick = (patch: SavedPatch) => {
    onDeleteRequest(patch);

    // 부모 WarningModal로 제어 이동
    setDeleteModePatchId(null);

    onIndexChange(null);
  };

  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) {
      return;
    }
  };

  // 목록 변경 시 위치 재계산
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

  // 활성 패치 중앙 이동
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

  // 영구삭제 모드 외부 클릭
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

      // 삭제 대상 카드 내부 클릭
      if (deleteCard?.contains(target)) {
        return;
      }

      // 다른 영역 클릭 시 삭제 UI 및 active 해제
      setDeleteModePatchId(null);

      onIndexChange(null);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [deleteModePatchId, onIndexChange, patches]);

  // 서버 삭제 후 삭제 UI 정리
  useEffect(() => {
    if (!deleteModePatchId) {
      return;
    }

    const exists = patches.some((patch) => patch.id === deleteModePatchId);

    if (!exists) {
      setDeleteModePatchId(null);
    }
  }, [deleteModePatchId, patches]);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
      }

      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

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
    <div className="mb-10 w-full overflow-hidden">
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
            const isSelected = currentIndex === index;

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
                {/* 저장 패치 선택 */}
                <button
                  type="button"
                  onClick={() => {
                    handlePatchClick(patch, index);
                  }}
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
                      isSelected ? "border-[#192C44] bg-white" : "border-transparent bg-transparent"
                    }
                  `}
                >
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

                {/* 영구삭제 모드 */}
                {isDeleteMode && (
                  <button
                    type="button"
                    aria-label={`저장 패치 ${index + 1} 영구삭제`}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();

                      handleDeleteClick(patch);
                    }}
                    className="
                      absolute
                      inset-0
                      z-20
                      flex
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-lg
                      bg-black/55
                    "
                  >
                    <Trash2 size={30} strokeWidth={2.5} className="text-white" />
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
