// src/components/common/DetailCard.tsx
import type { JourneyItem } from "@/api/journey";
import { useJourney } from "@/hooks/queries/useJourney";
import fileIcon from "@/assets/icons/file.png"; // TODO: 실제 파일명으로 교체

const BADGE_SHADOW =
  "shadow-[0_0_6.63px_0_rgba(94,140,136,0.25),inset_0_-0.99px_0.99px_0_rgba(159,159,159,0.25),inset_0_1.99px_1.99px_0_rgba(255,255,255,0.25)]";

interface DetailCardProps {
  category: JourneyItem;
  isActive: boolean;
}

export function DetailCard({ category, isActive }: DetailCardProps) {
  const { journeyId, nationKRName, coverImgUrl, type, startDate, endDate, flagImgUrl } = category;

  // postCount는 단일 조회 API에만 있어서, 이 카드가 화면에 뜬 시점에 별도로 가져옴
  const { data: detail } = useJourney(journeyId);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl shadow-[0px_0px_11.7px_2.34px_rgba(0,0,0,0.25),inset_1.76px_1.76px_0px_0px_rgba(255,255,255,0.50),inset_-1.76px_-1.76px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-300 ${
        isActive ? "h-98.75 w-72.5 opacity-100" : "h-78.25 w-57.5 opacity-60"
      }`}
    >
      <img
        src={coverImgUrl}
        alt={nationKRName}
        className="absolute inset-0 h-full w-full rounded-xl object-cover"
      />

      {flagImgUrl && (
        <div
          className={`absolute right-3 top-3 flex items-center justify-center overflow-hidden rounded-full bg-stone-100 ${
            isActive ? "size-14" : "size-12"
          } ${BADGE_SHADOW}`}
        >
          <img
            src={flagImgUrl}
            alt={`${nationKRName} 국기`}
            className={isActive ? "h-5 w-7 object-cover" : "h-4 w-6 object-cover"}
          />
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-xl bg-linear-to-t from-black/70 via-stone-950/60 via-36% to-stone-500/0 ${
          isActive ? "h-44" : "h-36"
        }`}
      >
        <div
          className={`absolute flex flex-col items-start ${isActive ? "left-8 top-14 w-48" : "left-7 top-10"}`}
        >
          <div
            className={`font-['Paperlogy'] font-bold tracking-wide text-white ${isActive ? "text-2xl" : "text-1xl"}`}
          >
            {nationKRName}
          </div>
          <div
            className={`font-['Paperlogy'] font-semibold tracking-tight text-white ${isActive ? "text-base" : "text-sm"}`}
          >
            {type}
          </div>
          <div className="flex items-center gap-0.5 whitespace-nowrap">
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-sm" : "text-xs"}`}
            >
              {startDate}
            </span>
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-sm" : "text-sm"}`}
            >
              ~
            </span>
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-sm" : "text-xs"}`}
            >
              {endDate}
            </span>
          </div>
        </div>

        <div
          className={`absolute overflow-hidden ${
            isActive ? "left-59 top-23 h-[2.25rem] w-[1.875rem]" : "left-48 top-18 h-7 w-5.5"
          }`}
        >
          <img src={fileIcon} alt="" className="absolute inset-0 h-full w-full" />

          <span
            className={`absolute inset-0 flex items-center justify-center font-['Paperlogy'] font-semibold text-[#8B929D] ${
              isActive ? "text-sm" : "text-xs"
            }`}
          >
            {detail?.postCount ?? "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
