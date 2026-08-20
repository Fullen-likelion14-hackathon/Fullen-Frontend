// ============================================================
// Passport.tsx — 메인 피드 페이지 (3번)
// 대륙별로 그룹핑된 여행 카테고리를 가로 카드 형태로 보여주고,
// 최근 등록순으로 오른쪽에 쌓이며 가로 슬라이드로 이전 기록 탐색 가능
// ============================================================

import { useNavigate } from "react-router-dom";
import { useJourneys } from "@/hooks/queries/useJourneys";
import type { Continent } from "@/api/journey";
import { useUsernameQuery } from "@/hooks/queries/useUsernameQuery";

import mainGlobeIcon from "@/assets/icons/mainglobe.png"; // 지도 보기 버튼 아이콘
import planeIcon from "@/assets/icons/mainplane.png"; // 인사말 옆 비행기 아이콘
import plusIcon from "@/assets/icons/plus.png"; // 여행 추가 버튼 + 아이콘
// TODO: 로그인 연동 후 실제 사용자명으로 교체

// 백엔드 Continent enum 키 → 화면에 보여줄 한글 대륙명 + 렌더링 순서
const CONTINENT_LABELS: Record<Continent, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
  ANTARCTICA: "남극",
};
const CONTINENT_ORDER: Continent[] = [
  "ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "SOUTH_AMERICA",
  "AFRICA",
  "OCEANIA",
  "ANTARCTICA",
];

interface ContinentGroupProps {
  continentLabel: string;
  journeys: {
    journeyId: number;
    nationENName: string;
    coverImgUrl: string;
  }[];
  count: number;
  onOpen: (continentLabel: string) => void;
}

// 대륙 하나 = 가로 카드 최대 3장 + 하단 정보 바(플랩)
// createdAt이 응답에 없어 별도 정렬 없이 API가 주는 순서 그대로, 최근 3개만 사용
const ContinentGroup = ({ continentLabel, journeys, count, onOpen }: ContinentGroupProps) => {
  const previewJourneys = journeys.slice(-3);

  return (
    <div className="w-full h-44 relative overflow-hidden">
      <div className="absolute left-8.5 right-8.5 top-1.5 flex items-center gap-3.5">
        {previewJourneys.map((journey) => (
          <button
            key={journey.journeyId}
            onClick={() => onOpen(continentLabel)}
            className="w-24 h-32 shrink-0 relative bg-neutral-50 rounded-[5px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            <img
              src={journey.coverImgUrl}
              alt={journey.nationENName}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* 국가명 텍스트: text-lg로 조정 */}
            <span className="absolute inset-0 flex items-center justify-center text-neutral-50 text-lg font-bold font-['PT_Serif'] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
              {journey.nationENName.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* 하단 플랩(대륙 정보 바)
            직접 조정 포인트:
            - 불투명도: bg-stone-400/60 의 /60(0~100) 숫자만 바꾸면 됨 (숫자가 클수록 불투명)
            - 색상: bg-stone-400 부분만 다른 Tailwind 색상 클래스로 교체 가능
            - 세로 위치: top-[110px] 숫자만 바꾸면 위/아래로 이동 (기존 119px에서 위로 조정됨)
            - 블러 효과: backdrop-blur-[2px]의 대괄호 안 px 숫자만 바꾸면 흐림 정도 조절 가능
            - 장식 원↔텍스트 간격: 원(size-2, left-[7px]/right-[7px])과 텍스트 사이 35px 간격 확보를 위해
              좌우 padding을 px-[50px]로 설정함 (7px + 8px(원 지름) + 35px = 50px) */}
      <button
        onClick={() => onOpen(continentLabel)}
        className="absolute left-1/2 top-[110px] -translate-x-1/2 w-[371px] h-[43px] flex items-center justify-between px-[50px] bg-stone-400/20 backdrop-blur-[2px] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        <div className="size-2 absolute left-[7px] top-1/2 -translate-y-1/2 bg-conic-63 from-black/20 to-stone-500/20 rounded-[50px]" />
        <div className="size-2 absolute right-[7px] top-1/2 -translate-y-1/2 bg-conic-63 from-black/20 to-stone-500/20 rounded-[50px]" />

        <span className="text-white text-base font-bold font-['Paperlogy']">{continentLabel}</span>
        <span className="text-white text-sm font-bold font-['Paperlogy']">{count}개의 여정</span>
      </button>
    </div>
  );
};

const Passport = () => {
  const navigate = useNavigate();
  const { data: continents, isLoading, isError } = useJourneys();
  const { data: username } = useUsernameQuery();

  const handleAddCategory = () => {
    navigate("/passport/new");
  };

  const handleOpenMap = () => {
    navigate("/map");
  };

  const handleOpenCategory = (continentLabel: string) => {
    navigate(`/passport/detail/${continentLabel}`);
  };

  // enum 순서대로, 실제 데이터가 있는 대륙만 필터링
  const groups = CONTINENT_ORDER.map((key) => {
    const group = continents?.[key];
    return group ? { key, label: CONTINENT_LABELS[key], ...group } : null;
  }).filter((g): g is NonNullable<typeof g> => g !== null);

  const hasJourneys = groups.length > 0;

  return (
    <div className="relative w-full max-w-97.5 min-h-dvh mx-auto bg-[#F9F4F0]">
      {/* 헤더: 상단 여백 pt-12로 조정하여 전체적으로 위로 이동 */}
      <div className="relative w-full px-8.25 pt-12 pb-5 flex flex-col gap-0">
        <div className="flex items-center justify-end gap-2.5">
          {/* 버튼 아이콘 사이즈 확대: plus size-3.5→size-5, globe size-4→size-5 */}
          <button
            onClick={handleAddCategory}
            className="w-[76px] h-[35px] flex items-center justify-center gap-1.25 bg-white/80 rounded-[10px] shadow-[0px_0px_5px_0px_rgba(25,39,60,0.10),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
          >
            <img src={plusIcon} alt="" className="size-5" />
            <span className="text-slate-800/80 text-base font-semibold font-['Paperlogy']">
              여행
            </span>
          </button>

          <button
            onClick={handleOpenMap}
            className="w-[76px] h-[35px] flex items-center justify-center gap-1.25 bg-white/80 rounded-[10px] shadow-[0px_0px_5px_0px_rgba(25,39,60,0.10),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
          >
            <img src={mainGlobeIcon} alt="" className="size-5" />
            <span className="text-slate-800 text-base font-semibold font-['Paperlogy']">지도</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.25 min-w-0 -mt-px whitespace-nowrap">
          <p className="text-slate-800 text-base font-medium font-['Paperlogy']">MCM과 함께한,</p>
          <p className="leading-tight">
            <span className="text-slate-800 text-2xl font-extrabold font-['Paperlogy'] align-middle">
              {username}
            </span>
            <span className="text-slate-800 text-2xl font-extrabold font-['Paperlogy'] align-middle">
              {" "}
            </span>
            <span className="inline-flex items-center gap-1 align-middle whitespace-nowrap">
              <span className="text-slate-800 text-xl font-medium font-['Paperlogy']">
                님의 여정
              </span>
              <img src={planeIcon} alt="" className="size-6 rotate-10" />
            </span>
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="w-80 mx-auto pt-20 text-center text-slate-800/60 text-sm font-['Paperlogy']">
          불러오는 중...
        </div>
      ) : isError ? (
        <div className="w-80 mx-auto pt-20 text-center text-slate-800/60 text-sm font-['Paperlogy']">
          여행 목록을 불러오지 못했어요
        </div>
      ) : hasJourneys ? (
        <div className="flex flex-col gap-2.5 pb-32">
          {groups.map(({ key, label, journeys, count }) => (
            <ContinentGroup
              key={key}
              continentLabel={label}
              journeys={journeys.map((j) => ({
                journeyId: j.journeyId,
                nationENName: j.nationENName,
                coverImgUrl: j.coverImgUrl,
              }))}
              count={count}
              onOpen={handleOpenCategory}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1 font-['Paperlogy'] pointer-events-none">
          <p className="text-slate-800 text-sm">아직 등록된 여행 기록이 없어요</p>
          <p className="text-slate-800/60 text-xs">카테고리를 추가하고 첫 여행을 기록해보세요</p>
        </div>
      )}

      {/* 하단 푸터(FooterNavigation)는 RootLayout에서 공통으로 감싸서 렌더링되므로 여기선 작성하지 않음 */}
    </div>
  );
};

export default Passport;
