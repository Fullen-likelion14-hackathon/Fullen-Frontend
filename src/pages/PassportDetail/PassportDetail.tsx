// src/pages/PassportDetail/PassportDetail.tsx
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import { DetailCard } from "@/components/common/DetailCard";
import { useJourneys } from "@/hooks/queries/useJourneys";
import type { Continent, JourneyItem } from "@/api/journey";
import bgDetail from "@/assets/images/BG_detail.png";
import planeIcon from "@/assets/icons/plane1.png";

const CARD_STEP = 288.5;
const SWIPE_THRESHOLD = 60;
const ANIMATION_DURATION = 300;
const TAP_MOVE_THRESHOLD = 5; // 이 값(px) 이하로 움직였으면 "탭"으로 간주

const CONTINENT_LABELS: Record<Continent, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
  ANTARCTICA: "남극",
};
// URL의 한글 라벨 → 백엔드 enum 키로 역매핑 (예: "아시아" → "ASIA")
const LABEL_TO_CONTINENT = Object.fromEntries(
  Object.entries(CONTINENT_LABELS).map(([key, label]) => [label, key as Continent]),
) as Record<string, Continent>;

export default function PassportDetail() {
  const navigate = useNavigate();
  const { continent } = useParams<{ continent: string }>();
  const { data: continents } = useJourneys();

  const [homeContinent] = useState(() => (continent && continent !== "all" ? continent : null));

  const [mode, setMode] = useState<"continent" | "all">(
    continent && continent !== "all" ? "continent" : "all",
  );

  // "전체": 모든 대륙의 journey를 합쳐서 startDate순 정렬
  // 특정 대륙: 해당 대륙 그룹의 journeys만 그대로 사용
  const filteredCategories: JourneyItem[] = (() => {
    if (!continents) return [];
    if (mode === "continent" && homeContinent) {
      const key = LABEL_TO_CONTINENT[homeContinent];
      return key ? (continents[key]?.journeys ?? []) : [];
    }
    return Object.values(continents)
      .flatMap((group) => group?.journeys ?? [])
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  })();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const hasDraggedRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 비행기(진행바) 전용: 카드 드래그(delta 기반, "미는" 느낌)와 달리
  // 손가락의 절대 위치를 트랙 기준 비율로 환산해 "이동시키는" 느낌으로 동작.
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaneDragging, setIsPlaneDragging] = useState(false);
  const [planeDragProgress, setPlaneDragProgress] = useState<number | null>(null);

  const previousCategory = selectedIndex > 0 ? filteredCategories[selectedIndex - 1] : null;
  const currentCategory = filteredCategories[selectedIndex] ?? null;
  const nextCategory =
    selectedIndex < filteredCategories.length - 1 ? filteredCategories[selectedIndex + 1] : null;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    dragStartX.current = event.clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) return;
    const distance = event.clientX - dragStartX.current;

    if (Math.abs(distance) > TAP_MOVE_THRESHOLD) {
      hasDraggedRef.current = true;
    }

    if (!nextCategory && distance < 0) {
      setDragOffset(distance * 0.25);
      return;
    }
    if (!previousCategory && distance > 0) {
      setDragOffset(distance * 0.25);
      return;
    }
    setDragOffset(distance);
  };

  const handlePointerUp = () => {
    if (dragStartX.current === null || isAnimating) return;
    dragStartX.current = null;
    setIsDragging(false);

    if (dragOffset < -SWIPE_THRESHOLD && nextCategory) {
      setIsAnimating(true);
      setDragOffset(-CARD_STEP);
      setTimeout(() => {
        setSelectedIndex((index) => index + 1);
        setDragOffset(0);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
      return;
    }

    if (dragOffset > SWIPE_THRESHOLD && previousCategory) {
      setIsAnimating(true);
      setDragOffset(CARD_STEP);
      setTimeout(() => {
        setSelectedIndex((index) => index - 1);
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

  // 트랙 내에서 clientX가 몇 %(0~1) 지점인지 계산해 그 자리로 바로 이동.
  const updatePlaneFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track || filteredCategories.length === 0) return;

    const rect = track.getBoundingClientRect();
    const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    setPlaneDragProgress(fraction);

    if (filteredCategories.length > 1) {
      const index = Math.round(fraction * (filteredCategories.length - 1));
      setSelectedIndex(index);
    }
  };

  const handlePlanePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;
    setIsPlaneDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePlaneFromPointer(event.clientX);
  };

  const handlePlanePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaneDragging) return;
    updatePlaneFromPointer(event.clientX);
  };

  const handlePlanePointerUp = () => {
    setIsPlaneDragging(false);
    setPlaneDragProgress(null);
  };

  const handlePlanePointerCancel = () => {
    setIsPlaneDragging(false);
    setPlaneDragProgress(null);
  };

  const planeProgress = (() => {
    if (isPlaneDragging && planeDragProgress !== null) {
      return planeDragProgress;
    }
    if (filteredCategories.length <= 1) return 0;

    if (isDragging) {
      // 카드를 미는 중에는 dragOffset만큼 비행기도 같이 부드럽게 보간.
      const dragIndexDelta = dragOffset / CARD_STEP;
      const virtualIndex = Math.min(
        Math.max(selectedIndex - dragIndexDelta, 0),
        filteredCategories.length - 1,
      );
      return virtualIndex / (filteredCategories.length - 1);
    }

    return selectedIndex / (filteredCategories.length - 1);
  })();

  const handleSelectAll = () => {
    if (mode !== "all") {
      navigate("/passport/detail/all", { replace: true });
      setMode("all");
      setSelectedIndex(0);
    }
  };

  const handleSelectContinent = () => {
    if (mode !== "continent" && homeContinent) {
      navigate(`/passport/detail/${homeContinent}`, { replace: true });
      setMode("continent");
      setSelectedIndex(0);
    }
  };

  const handleOpen = () => {
    const current = filteredCategories[selectedIndex];
    if (current) navigate(`/passport/${current.journeyId}`);
  };

  // 카드를 탭했을 때 열기 버튼과 동일하게 동작.
  // 단, 스와이프(드래그) 중이었다면 무시해서 오작동 방지.
  const handleCardClick = () => {
    if (hasDraggedRef.current) return;
    handleOpen();
  };

  return (
    <div
      className="relative mx-auto min-h-dvh w-full max-w-97.5 overflow-y-auto bg-stone-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgDetail})` }}
    >
      <PageHeader title="나의 여정" />

      {homeContinent && (
        <div className="mx-auto mt-9.5 flex h-[42px] w-[300px] items-center gap-0.5 rounded-[10px] bg-stone-300 p-0.5">
          <button
            onClick={handleSelectAll}
            className={`h-9 flex-1 rounded-lg font-['Paperlogy'] text-base font-semibold tracking-tight transition-colors ${
              mode === "all" ? "bg-white text-slate-800" : "bg-stone-300 text-stone-100"
            }`}
          >
            전체
          </button>
          <button
            onClick={handleSelectContinent}
            className={`h-9 flex-1 rounded-lg font-['Paperlogy'] text-base font-semibold tracking-tight transition-colors ${
              mode === "continent" ? "bg-white text-slate-800" : "bg-stone-300 text-stone-100"
            }`}
          >
            {homeContinent}
          </button>
        </div>
      )}

      <div
        className="relative mt-7 flex h-105.25 select-none items-center justify-center overflow-hidden touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(event) => event.preventDefault()}
      >
        {previousCategory && (
          <div
            className={`absolute left-1/2 ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{ transform: `translateX(calc(-50% - ${CARD_STEP}px + ${dragOffset}px))` }}
          >
            <DetailCard category={previousCategory} isActive={false} />
          </div>
        )}

        {currentCategory && (
          <div
            onClick={handleCardClick}
            className={`absolute left-1/2 z-10 cursor-grab active:cursor-grabbing ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{ transform: `translateX(calc(-50% + ${dragOffset}px))` }}
          >
            <DetailCard category={currentCategory} isActive />
          </div>
        )}

        {nextCategory && (
          <div
            className={`absolute left-1/2 ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{ transform: `translateX(calc(-50% + ${CARD_STEP}px + ${dragOffset}px))` }}
          >
            <DetailCard category={nextCategory} isActive={false} />
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <div ref={trackRef} className="relative h-2 w-72">
          <div className="h-full w-full overflow-hidden rounded-full bg-stone-300" />
          <div
            onPointerDown={handlePlanePointerDown}
            onPointerMove={handlePlanePointerMove}
            onPointerUp={handlePlanePointerUp}
            onPointerCancel={handlePlanePointerCancel}
            onDragStart={(event) => event.preventDefault()}
            className={`absolute -top-4 flex size-10 -translate-x-1/2 cursor-grab items-center justify-center overflow-hidden rounded-full bg-slate-800 select-none touch-none active:cursor-grabbing ${
              isPlaneDragging || isDragging ? "" : "transition-all duration-200"
            }`}
            style={{ left: `calc(20px + ${planeProgress} * (100% - 40px))` }}
          >
            <img src={planeIcon} alt="" className="h-10 w-10" draggable={false} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={handleOpen}
          className="flex h-12 w-62.5 items-center justify-center rounded-full bg-white/80 font-['Paperlogy'] text-lg font-semibold tracking-tight text-slate-800 shadow-[0px_0px_5px_0px_rgba(25,39,60,0.30),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
        >
          열기
        </button>
      </div>
    </div>
  );
}