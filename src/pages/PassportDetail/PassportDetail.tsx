// src/pages/PassportDetail/PassportDetail.tsx
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DetailCard } from "@/components/common/DetailCard";
import { mockCategories } from "@/pages/Passport/passport.mock";
import backIcon from "@/assets/icons/back.png";
import planeIcon from "@/assets/icons/plane.png";

// MCoMFeedSlider(components/mcom/MCoMFeedSlider.tsx)의 포인터 드래그 스와이프 방식을 그대로 적용.
// 활성 카드 반너비(154.5) + 비활성 카드 반너비(120) + 카드 사이 여백(14) = 카드 한 칸 이동 거리
const CARD_STEP = 288.5;
const SWIPE_THRESHOLD = 60;
const ANIMATION_DURATION = 300;

export default function PassportDetail() {
  const navigate = useNavigate();
  const { continent } = useParams<{ continent: string }>();

  // "전체"로 전환하면 URL의 continent 파라미터 자체가 "all"로 바뀌어버려서 원래 보던 대륙 정보가
  // 사라짐 → 처음 진입했을 때의 대륙을 별도로 기억해뒀다가 "전체"에서 다시 돌아갈 대상으로 사용
  const [homeContinent] = useState(() => (continent && continent !== "all" ? continent : null));

  // "전체" 모드일 땐 continent 값이 없거나 "all"
  const [mode, setMode] = useState<"continent" | "all">(
    continent && continent !== "all" ? "continent" : "all",
  );

  const filteredCategories =
    mode === "continent"
      ? mockCategories.filter((c) => c.continent === continent)
      : [...mockCategories].sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // MCoMFeedSlider와 동일한 포인터 드래그 스와이프 상태
  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const previousCategory = selectedIndex > 0 ? filteredCategories[selectedIndex - 1] : null;
  const currentCategory = filteredCategories[selectedIndex] ?? null;
  const nextCategory =
    selectedIndex < filteredCategories.length - 1 ? filteredCategories[selectedIndex + 1] : null;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating) return;

    dragStartX.current = event.clientX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null || isAnimating) return;

    const distance = event.clientX - dragStartX.current;

    // 다음/이전 카드가 없는 방향으로 당기면 저항감을 주기 위해 이동량을 줄임
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

  // 비행기 위치: 드래그 진행률이 아니라, 카드 개수 대비 "몇 번째 카드가 선택됐는지"로 계산.
  // 카드가 3개면 1번째=맨 왼쪽, 2번째=정중앙, 3번째=맨 오른쪽에 딱 정렬됨
  const planeProgress =
    filteredCategories.length > 1 ? selectedIndex / (filteredCategories.length - 1) : 0;

  const handleToggle = () => {
    if (mode === "continent") {
      navigate("/passport/detail/all");
      setMode("all");
      setSelectedIndex(0);
    } else if (homeContinent) {
      navigate(`/passport/detail/${homeContinent}`);
      setMode("continent");
      setSelectedIndex(0);
    }
  };

  const handleOpen = () => {
    const current = filteredCategories[selectedIndex];
    if (current) navigate(`/passport/${current.id}`);
  };

  const headerLeftLabel = mode === "continent" ? continent : "전체";
  const headerRightLabel = mode === "continent" ? "전체" : homeContinent;

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-97.5 overflow-hidden bg-stone-100">
      {/* 헤더 */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-800">
        <button
          onClick={() => navigate("/")}
          className="absolute left-[34px] top-[81px]"
          aria-label="뒤로가기"
        >
          <img src={backIcon} alt="" className="h-6 w-3.5" />
        </button>

        <span className="absolute left-1/2 top-[81px] -translate-x-1/2 font-['Paperlogy'] text-xl font-semibold tracking-tight text-stone-100">
          {headerLeftLabel}
        </span>

        <button
          onClick={handleToggle}
          className="absolute right-[33px] top-[81px] font-['Paperlogy'] text-xl font-semibold tracking-tight text-emerald-300"
        >
          {headerRightLabel}
        </button>

        <div className="absolute bottom-0 h-1.5 w-full bg-yellow-700" />
      </div>

      {/* 카드 캐러셀: MCoMFeedSlider와 동일하게 이전/현재/다음 카드를 포인터 드래그로 좌우 전환 */}
      <div
        className="relative mt-24 flex h-105.25 select-none items-center justify-center overflow-hidden touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(event) => event.preventDefault()}
      >
        {/* 이전 카드 */}
        {previousCategory && (
          <div
            className={`absolute left-1/2 ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{
              transform: `translateX(calc(-50% - ${CARD_STEP}px + ${dragOffset}px))`,
            }}
          >
            <DetailCard category={previousCategory} isActive={false} />
          </div>
        )}

        {/* 현재 카드 */}
        {currentCategory && (
          <div
            className={`absolute left-1/2 z-10 cursor-grab active:cursor-grabbing ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{
              transform: `translateX(calc(-50% + ${dragOffset}px))`,
            }}
          >
            <DetailCard category={currentCategory} isActive />
          </div>
        )}

        {/* 다음 카드 */}
        {nextCategory && (
          <div
            className={`absolute left-1/2 ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{
              transform: `translateX(calc(-50% + ${CARD_STEP}px + ${dragOffset}px))`,
            }}
          >
            <DetailCard category={nextCategory} isActive={false} />
          </div>
        )}
      </div>

      {/* 진행 인디케이터 (비행기): 바(w-72=288px) 안에서만 움직이도록 비행기 아이콘 반지름(18px)만큼 안쪽으로 여유를 둠.
          바를 감싸는 wrapper를 따로 둬서 left(%)가 바깥 flex 컨테이너가 아니라 바(288px) 기준으로 계산되게 함 */}
      <div className="mt-10 flex justify-center">
        <div className="relative h-2 w-72">
          <div className="h-full w-full overflow-hidden rounded-full bg-slate-800/50" />
          <img
            src={planeIcon}
            alt=""
            className="absolute -top-3.5 h-9 w-9 -translate-x-1/2 rounded-full bg-white transition-all duration-200"
            style={{ left: `calc(18px + ${planeProgress} * (100% - 36px))` }}
          />
        </div>
      </div>

      {/* 열기 버튼 */}
      <div className="mt-8 flex justify-center pb-10">
        <button
          onClick={handleOpen}
          className="flex h-12 w-50 items-center justify-center rounded-full bg-white/40 font-['Paperlogy'] text-xl font-semibold tracking-tight text-slate-800/80 shadow-[0px_0px_5px_0px_rgba(94,140,136,0.25),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
        >
          열기
        </button>
      </div>
    </div>
  );
}
