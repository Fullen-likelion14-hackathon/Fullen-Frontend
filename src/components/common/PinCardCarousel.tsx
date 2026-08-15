// src/components/common/PinCardCarousel.tsx
//
// 설치 필요:
//   npm install embla-carousel-react
//
// 피그마 디자인 반영: 가운데(활성) 카드는 크고 선명하게, 양옆(비활성) 카드는
// 작고 어둡게(bg-black/50) 처리 - 지도 핀 색상(선택=빨강/비선택=회색)과
// 같은 맥락의 강조 규칙입니다.
//
// 카드 클릭 시: 활성 카드 클릭 -> 상세(피드 목록) 페이지로 이동
//              비활성 카드 클릭 -> 그 카드를 가운데로 스크롤(선택)만 함

import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { MapPin } from "../../types/mapPin";
import fileIcon from "@/assets/icons/file.png";

interface PinCardCarouselProps {
  pins: MapPin[];
  activeIndex: number;
  onSlideChange: (index: number) => void;
  onDetailClick?: (pin: MapPin) => void;
}

// 피그마 3-layer 그림자(외곽 소프트 섀도우 + 좌상단 흰색 하이라이트 + 우하단 검정 그림자)를
// 하나의 box-shadow에 콤마로 이어붙임. 여러 shadow-[...] 클래스를 따로 쓰면
// 마지막 클래스만 적용돼서 레이어가 합쳐지지 않는 문제가 있어 이렇게 처리함.
const ACTIVE_CARD_SHADOW =
  "shadow-[0_0_9.69px_1.94px_rgba(0,0,0,0.25),inset_1.45px_1.45px_0_0_rgba(255,255,255,0.5),inset_-1.45px_-1.45px_0_0_rgba(0,0,0,0.15)]";
const INACTIVE_CARD_SHADOW =
  "shadow-[0_0_7.76px_1.55px_rgba(0,0,0,0.25),inset_1.16px_1.16px_0_0_rgba(255,255,255,0.5),inset_-1.16px_-1.16px_0_0_rgba(0,0,0,0.15)]";
const BADGE_SHADOW =
  "shadow-[0_0_6.63px_0_rgba(94,140,136,0.25),inset_0_-0.99px_0.99px_0_rgba(159,159,159,0.25),inset_0_1.99px_1.99px_0_rgba(255,255,255,0.25)]";

export function PinCardCarousel({
  pins,
  activeIndex,
  onSlideChange,
  onDetailClick,
}: PinCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    startIndex: activeIndex,
    // 카드 크기가 활성/비활성마다 달라서(w-64 vs w-52), 기본값(trimSnaps)이
    // 맨 앞/맨 뒤 스냅 위치를 억지로 잘라내며 중앙 정렬이 어긋나는 버그가 생김.
    // false로 두면 경계에서도 다른 카드들과 동일하게 정확히 중앙 정렬됨.
    containScroll: false,
  });

  // 사용자가 캐러셀을 직접 스와이프했을 때 -> 지도에 알림
  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => onSlideChange(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi, onSlideChange]);

  // 외부(예: '가장 최근 여행 보기' 클릭)에서 activeIndex가 바뀌면 캐러셀도 따라가게
  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== activeIndex) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [activeIndex, emblaApi]);

  // 활성 카드는 다른 카드보다 크기 때문에(w-64 vs w-52), 카드 크기가 바뀔 때마다
  // 캐러셀이 스냅 위치를 다시 계산하도록 reInit 해줘야 함
  useEffect(() => {
    emblaApi?.reInit();
  }, [activeIndex, emblaApi]);

  const handleCardClick = useCallback(
    (pin: MapPin, index: number) => {
      if (index === activeIndex) {
        onDetailClick?.(pin);
      } else {
        emblaApi?.scrollTo(index);
      }
    },
    [activeIndex, emblaApi, onDetailClick],
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex items-center gap-3 px-6">
        {pins.map((pin, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => handleCardClick(pin, index)}
              className={[
                "relative shrink-0 overflow-hidden text-left transition-all duration-300",
                isActive ? "h-90 w-64 rounded-xl" : "h-72 w-52 rounded-lg",
                isActive ? ACTIVE_CARD_SHADOW : INACTIVE_CARD_SHADOW,
              ].join(" ")}
            >
              <img
                src={pin.thumbnailUrl}
                alt={pin.countryName}
                className={[
                  "absolute inset-0 size-full object-cover",
                  isActive ? "rounded-xl" : "rounded-lg",
                ].join(" ")}
              />

              {/* 비활성 카드 딤 처리 */}
              {!isActive && <div className="absolute inset-0 rounded-lg bg-black/50" />}

              {/* 국기 원형 배지 */}
              {pin.flagUrl && (
                <div
                  className={[
                    "absolute right-3 top-3 flex items-center justify-center overflow-hidden rounded-full bg-stone-100",
                    isActive ? "size-14" : "size-12",
                    BADGE_SHADOW,
                  ].join(" ")}
                >
                  <img
                    src={pin.flagUrl}
                    alt={`${pin.countryName} 국기`}
                    className={isActive ? "h-5 w-7 object-cover" : "h-4 w-6 object-cover"}
                  />
                </div>
              )}

              {/* 하단 텍스트 그라데이션 오버레이 */}
              <div
                className={[
                  "absolute inset-x-0 bottom-0 flex flex-col justify-end overflow-hidden bg-linear-to-t from-black/70 via-black/40 via-40% to-transparent",
                  isActive
                    ? "h-36 rounded-b-xl px-4 pt-4 pb-10"
                    : "h-28 rounded-b-lg px-3 pt-3 pb-10",
                ].join(" ")}
              >
                <p
                  className={[
                    "font-bold text-white",
                    isActive
                      ? "font-['Paperlogy'] text-2xl tracking-wide"
                      : "font-['Paperlogy'] text-lg tracking-tight",
                  ].join(" ")}
                >
                  {pin.countryName}
                </p>
                <p
                  className={[
                    "mt-1 font-['Paperlogy'] font-semibold tracking-tight text-white",
                    isActive ? "text-sm" : "text-xs",
                  ].join(" ")}
                >
                  {pin.travelTitle}
                </p>
                <p
                  className={[
                    "mt-1 font-['Paperlogy'] font-semibold text-stone-100",
                    isActive ? "text-xs" : "text-[9.94px]",
                  ].join(" ")}
                >
                  {pin.period}
                </p>

                {/* 기록 개수 배지: file.png(접힌 모서리 문서 아이콘) 위에 숫자를 겹쳐서 표시 */}
                <div
                  className={[
                    "absolute",
                    isActive ? "bottom-4 right-4 size-8" : "bottom-3 right-3 size-6",
                  ].join(" ")}
                >
                  <img src={fileIcon} alt="" className="size-full object-contain" />
                  <span
                    className={[
                      "absolute inset-0 flex items-center justify-center pt-1 font-['Paperlogy'] font-semibold text-neutral-400",
                      isActive ? "text-sm" : "text-xs",
                    ].join(" ")}
                  >
                    {pin.recordCount}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
