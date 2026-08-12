// src/components/common/DetailCard.tsx
import type { TravelCategory } from "@/pages/Passport/Passport";
import fileIcon from "@/assets/icons/file.png"; // TODO: 실제 파일명으로 교체

interface DetailCardProps {
  category: TravelCategory;
  isActive: boolean;
}

export function DetailCard({ category, isActive }: DetailCardProps) {
  const { countryName, imageUrl, travelTitle, startDate, endDate, feedCount } = category;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl shadow-[0px_0px_11.7px_2.34px_rgba(0,0,0,0.25),inset_1.76px_1.76px_0px_0px_rgba(255,255,255,0.50),inset_-1.76px_-1.76px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-300 ${
        isActive ? "h-105.25 w-77.25 opacity-100" : "h-80 w-60 opacity-60"
      }`}
    >
      <img
        src={imageUrl}
        alt={countryName}
        className="absolute inset-0 h-full w-full rounded-xl object-cover"
      />

      {/* 하단 그라데이션 오버레이 */}
      <div
        className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-xl bg-linear-to-t from-black/70 via-stone-950/60 via-36% to-stone-500/0 ${
          isActive ? "h-44" : "h-36"
        }`}
      >
        <div
          className={`absolute flex flex-col items-start gap-1 ${isActive ? "left-8.75 top-12.25 w-48" : "left-7 top-10"}`}
        >
          <div
            className={`font-['Paperlogy'] font-bold tracking-wide text-white ${isActive ? "text-3xl" : "text-2xl"}`}
          >
            {countryName === "GERMANY" ? "독일" : countryName}
          </div>
          <div
            className={`font-['Paperlogy'] font-semibold tracking-tight text-white ${isActive ? "text-lg" : "text-sm"}`}
          >
            {travelTitle}
          </div>
          <div className="flex items-center gap-0.5">
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-base" : "text-xs"}`}
            >
              {startDate}
            </span>
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-lg" : "text-sm"}`}
            >
              ~
            </span>
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-base" : "text-xs"}`}
            >
              {endDate}
            </span>
          </div>
        </div>

        {/* 피드개수 아이콘 */}
        <div
          className={`absolute overflow-hidden ${
            isActive ? "left-60.5 top-21.5 h-11 w-9" : "left-48.5 top-17.25 h-9 w-7"
          }`}
        >
          <img src={fileIcon} alt="" className="absolute inset-0 h-full w-full" />
          <span
            className={`absolute font-['Paperlogy'] font-semibold text-stone-300 ${
              isActive ? "left-3.25 top-3.25 text-base" : "left-2.5 top-2.5 text-xs"
            }`}
          >
            {feedCount}
          </span>
        </div>
      </div>
    </div>
  );
}
