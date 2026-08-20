// src/components/common/PinCardCarousel.tsx
import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { JourneySummary, NearbyJourneys } from "@/api/journey";
import fileIcon from "@/assets/icons/file.png";

interface PinCardCarouselProps {
  nearby: NearbyJourneys;
  onSelectJourney: (journeyId: number) => void; // 좌/우 카드가 새 center가 될 때
  onDetailClick: (journeyId: number) => void; // 활성(center) 카드 클릭 시
}

const ACTIVE_CARD_SHADOW =
  "shadow-[0_0_0.605625rem_0.12125rem_rgba(0,0,0,0.25),inset_0.090625rem_0.090625rem_0_0_rgba(255,255,255,0.5),inset_-0.090625rem_-0.090625rem_0_0_rgba(0,0,0,0.15)]";
const INACTIVE_CARD_SHADOW =
  "shadow-[0_0_0.485rem_0.096875rem_rgba(0,0,0,0.25),inset_0.0725rem_0.0725rem_0_0_rgba(255,255,255,0.5),inset_-0.0725rem_-0.0725rem_0_0_rgba(0,0,0,0.15)]";
const BADGE_SHADOW =
  "shadow-[0_0_0.414375rem_0_rgba(94,140,136,0.25),inset_0_-0.061875rem_0.061875rem_0_rgba(159,159,159,0.25),inset_0_0.124375rem_0.124375rem_0_rgba(255,255,255,0.25)]";

// 좌/중/우를 고정 3슬롯 배열로 (없는 쪽은 null)
// left와 right가 같은 여행(journeyId 중복, 여행이 2개뿐일 때 발생)이면
// key 중복/카드 중복 표시를 막기 위해 right를 빈 슬롯 처리
function toSlots(nearby: NearbyJourneys): (JourneySummary | null)[] {
  const { leftJourney, centerJourney, rightJourney } = nearby;
  const isDuplicate =
    leftJourney && rightJourney && leftJourney.journeyId === rightJourney.journeyId;

  return [leftJourney, centerJourney, isDuplicate ? null : rightJourney];
}

function formatPeriod(start: string, end: string) {
  return `${start} ~ ${end}`;
}

export function PinCardCarousel({ nearby, onSelectJourney, onDetailClick }: PinCardCarouselProps) {
  const slots = toSlots(nearby);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    startIndex: 1, // center 카드가 항상 가운데
    containScroll: false,
  });

  // nearby 데이터가 바뀔 때마다(=새 center로 이동) 캐러셀도 가운데(index 1)로 부드럽게 이동
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(1); // 애니메이션 있는 이동
  }, [nearby.centerJourney.journeyId, emblaApi]);

  // 사용자가 직접 스와이프해서 좌/우 카드에 안착하면 -> 그 카드를 새 center로 선택
  useEffect(() => {
    if (!emblaApi) return;
    const handleSettle = () => {
      const index = emblaApi.selectedScrollSnap();
      if (index === 1) return; // 이미 center
      const target = slots[index];
      if (target) onSelectJourney(target.journeyId);
    };
    emblaApi.on("settle", handleSettle);
    return () => {
      emblaApi.off("settle", handleSettle);
    };
    // slots는 nearby가 바뀔 때마다 새로 계산되므로 nearby를 dep으로 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, nearby, onSelectJourney]);

  const handleCardClick = useCallback(
    (journey: JourneySummary | null, index: number) => {
      if (!journey) return;
      if (index === 1) {
        onDetailClick(journey.journeyId);
      } else {
        onSelectJourney(journey.journeyId);
      }
    },
    [onDetailClick, onSelectJourney],
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex items-center gap-3 px-6">
        {slots.map((journey, index) => {
          if (!journey) {
            // 좌/우 이웃이 없는 경우(맨 끝, 또는 left/right 중복 제거된 경우) -> 빈 슬롯으로 자리만 유지
            return <div key={`empty-${index}`} className="h-[18.3125rem] w-[13.4375rem] shrink-0" />;
          }

          const isActive = index === 1;

          return (
            <button
              key={`${index}-${journey.journeyId}`}
              type="button"
              onClick={() => handleCardClick(journey, index)}
              className={[
                "relative shrink-0 overflow-hidden text-left transition-all duration-300",
                isActive ? "h-[23.125rem] w-[16.9375rem] rounded-xl" : "h-[18.3125rem] w-[13.4375rem] rounded-lg",
                isActive ? ACTIVE_CARD_SHADOW : INACTIVE_CARD_SHADOW,
              ].join(" ")}
            >
              <img
                src={journey.thumbnailUrl}
                alt={journey.nationKRName}
                className={[
                  "absolute inset-0 size-full object-cover",
                  isActive ? "rounded-xl" : "rounded-lg",
                ].join(" ")}
              />

              {journey.flagImgUrl && (
                <div
                  className={[
                    "absolute right-3 top-3 flex items-center justify-center overflow-hidden rounded-full bg-stone-100",
                    isActive ? "size-14" : "size-12",
                    BADGE_SHADOW,
                  ].join(" ")}
                >
                  <img
                    src={journey.flagImgUrl}
                    alt={`${journey.nationKRName} 국기`}
                    className={isActive ? "h-5 w-7 object-cover" : "h-4 w-6 object-cover"}
                  />
                </div>
              )}

              <div
                className={[
                  "absolute inset-x-0 bottom-0 flex flex-col justify-end overflow-hidden bg-linear-to-t from-black/70 via-black/40 via-40% to-transparent",
                  isActive
                    ? "h-36 rounded-b-xl px-4 pt-4 pb-10"
                    : "h-28 rounded-b-lg px-3 pt-3 pb-10",
                ].join(" ")}
              >
                <div className="pl-[1.5625rem]">
                  <p
                    className={[
                      "font-bold text-white",
                      isActive
                        ? "font-['Paperlogy'] text-2xl tracking-wide"
                        : "font-['Paperlogy'] text-lg tracking-tight",
                    ].join(" ")}
                  >
                    {journey.nationKRName}
                  </p>
                  <p
                    className={[
                      "mt-1 font-['Paperlogy'] font-semibold tracking-tight text-white",
                      isActive ? "text-sm" : "text-xs",
                    ].join(" ")}
                  >
                    {journey.type}
                  </p>
                  <p
                    className={[
                      "mt-1 font-['Paperlogy'] font-semibold text-stone-100",
                      isActive ? "text-xs" : "text-[max(9.94px,0.62125rem)]",
                    ].join(" ")}
                  >
                    {formatPeriod(journey.startDate, journey.endDate)}
                  </p>
                </div>

                <div
                  className={[
                    "absolute",
                    isActive
                      ? "bottom-10.5 right-5.5 h-[2.25rem] w-[1.875rem]"
                      : "bottom-10.5 right-4.5 h-7 w-5.5",
                  ].join(" ")}
                >
                  <img src={fileIcon} alt="" className="size-full object-contain" />
                  <span
                    className={[
                      "absolute inset-0 flex items-center justify-center pt-1 font-['Paperlogy'] font-semibold text-slate-800/50",
                      isActive ? "text-sm" : "text-xs",
                    ].join(" ")}
                  >
                    {journey.postCount}
                  </span>
                </div>
              </div>

              {!isActive && <div className="absolute inset-0 rounded-lg bg-black/50" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}