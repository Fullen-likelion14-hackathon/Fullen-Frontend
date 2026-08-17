// src/components/common/DetailCard.tsx
import type { TravelCategory } from "@/pages/Passport/Passport";
import fileIcon from "@/assets/icons/file.png"; // TODO: 실제 파일명으로 교체
import { countryNameKoMap } from "@/mocks/countryFlags.mock";

const BADGE_SHADOW =
  "shadow-[0_0_6.63px_0_rgba(94,140,136,0.25),inset_0_-0.99px_0.99px_0_rgba(159,159,159,0.25),inset_0_1.99px_1.99px_0_rgba(255,255,255,0.25)]";

interface DetailCardProps {
  category: TravelCategory;
  isActive: boolean;
}

const formatDate = (dateString: string) => dateString.replaceAll("-", ".");

export function DetailCard({ category, isActive }: DetailCardProps) {
  const { countryName, imageUrl, travelTitle, startDate, endDate, feedCount, flagUrl } = category;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl shadow-[0px_0px_11.7px_2.34px_rgba(0,0,0,0.25),inset_1.76px_1.76px_0px_0px_rgba(255,255,255,0.50),inset_-1.76px_-1.76px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-300 ${
        isActive ? "h-98.75 w-72.5 opacity-100" : "h-78.25 w-57.5 opacity-60"
      }`}
    >
      <img
        src={imageUrl}
        alt={countryName}
        className="absolute inset-0 h-full w-full rounded-xl object-cover"
      />

      {flagUrl && (
        <div
          className={`absolute right-3 top-3 flex items-center justify-center overflow-hidden rounded-full bg-stone-100 ${
            isActive ? "size-14" : "size-12"
          } ${BADGE_SHADOW}`}
        >
          <img
            src={flagUrl}
            alt={`${countryName} 국기`}
            className={isActive ? "h-5 w-7 object-cover" : "h-4 w-6 object-cover"}
          />
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-xl bg-linear-to-t from-black/70 via-stone-950/60 via-36% to-stone-500/0 ${
          isActive ? "h-44" : "h-36"
        }`}
      >
        {/* 텍스트 묶음 부분 */}
        <div
          className={`absolute flex flex-col items-start ${isActive ? "left-8 top-14 w-48" : "left-7 top-10"}`}
        >
          {/* 국가 부분 */}
          <div
            className={`font-['Paperlogy'] font-bold tracking-wide text-white ${isActive ? "text-2xl" : "text-1xl"}`}
          >
            {countryNameKoMap[countryName] ?? countryName}
          </div>
          {/* 여행 내용 부분 */}
          <div
            className={`font-['Paperlogy'] font-semibold tracking-tight text-white ${isActive ? "text-base" : "text-sm"}`}
          >
            {travelTitle}
          </div>
          {/* 여행 날짜 */}
          <div className="flex items-center gap-0.5 whitespace-nowrap">
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-sm" : "text-xs"}`}
            >
              {formatDate(startDate)}
            </span>
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-sm" : "text-sm"}`}
            >
              ~
            </span>
            <span
              className={`font-['Paperlogy'] font-semibold text-stone-100 ${isActive ? "text-sm" : "text-xs"}`}
            >
              {formatDate(endDate)}
            </span>
          </div>
        </div>

        {/* 피드개수 아이콘: 카드 기준 절대 위치, 비활성 카드는 크기 축소(h-9 w-7 → h-7 w-5.5) */}
        <div
          className={`absolute overflow-hidden ${
            isActive ? "left-59 top-23 h-[36px] w-[30px]" : "left-48 top-18 h-7 w-5.5"
          }`}
        >
          <img src={fileIcon} alt="" className="absolute inset-0 h-full w-full" />

          <span
            className={`absolute inset-0 flex items-center justify-center font-['Paperlogy'] font-semibold text-[#8B929D] ${
              isActive ? "text-sm" : "text-xs"
            }`}
          >
            {feedCount}
          </span>
        </div>
      </div>
    </div>
  );
}
