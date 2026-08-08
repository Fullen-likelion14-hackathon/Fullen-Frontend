// ============================================================
// Passport.tsx — 메인 피드 페이지 (3번)
// 국가별 여행 카테고리를 카드 그리드로 보여주고,
// 지도 이동 / 카테고리 추가 진입점을 제공하는 화면
// ============================================================

import { useNavigate } from "react-router-dom";
import { mockCategories } from "./passport.mock";
// TODO: 실제 커밋 시엔 아래처럼 빈 배열로 교체
// const mockCategories: TravelCategory[] = [];

// 실제 에셋 (경로/파일명 확정됨)
import leatherTexture from "@/assets/images/leather-texture.png"; // 배경 가죽 텍스처
import globeIcon from "@/assets/icons/globe.png"; // 지도 보기 버튼 아이콘
import diamondIcon from "@/assets/icons/Rectangle.png"; // 카드 하단 플랩 다이아몬드 워터마크
import mcmWatermark from "@/assets/images/MainMcmLogo.png"; // 카드 하단 플랩 MCM 로고 워터마크

// 국가별 여행 카테고리 데이터 타입
// mock 파일(passport.mock.ts)과 실제 API 응답 둘 다 이 타입을 따름
export interface TravelCategory {
  id: string;
  countryName: string; // 카드에 표시되는 국가명 (영문, font-sans/Geist Variable)
  imageUrl: string;
}

const mockUserName = "멋사대학"; // TODO: 로그인 연동 후 실제 사용자명으로 교체

interface TravelCardProps {
  category: TravelCategory;
  onClick: () => void;
}

// 사진 + 국가명은 완성본 유지, 하단 MCM 로고 + 다이아몬드 워터마크 플랩만 추가
// 플랩 구조/수치는 피그마 익스포트 코드 기준 (MCM 로고 1.5배, 다이아몬드 아이콘 size-6로 확대)
const TravelCard = ({ category, onClick }: TravelCardProps) => (
  <button onClick={onClick} className="w-40 h-48 relative shrink-0 text-left">
    <div className="w-32 h-40 left-1/2 -translate-x-1/2 top-0 absolute bg-neutral-50 rounded-[5px] overflow-hidden">
      <img
        src={category.imageUrl}
        alt={category.countryName}
        className="w-32 h-40 absolute inset-0 object-cover"
      />
      {/* 사진 안에서 세로 중앙 정렬 (top-1/2 -translate-y-1/2) */}
      {/* font-['PT_Serif']는 프로젝트에 로드돼 있지 않아 폴백 폰트로 보이던 문제 → 실제 로드된 font-sans(Geist Variable)로 교체 */}
      <div className="left-[9px] top-1/2 -translate-y-1/2 absolute text-white text-xl font-bold font-sans">
        {category.countryName}
      </div>
    </div>

    {/* 하단 플랩: 카드 전체 폭 기준, MCM 로고 + 다이아몬드 워터마크 장식
        직접 조정 포인트:
        - 가로 폭: w-42 숫자만 바꾸면 됨 (left-1/2 -translate-x-1/2로 항상 가운데 정렬 유지)
        - 불투명도: bg-stone-300/70 의 /70(0~100) 숫자만 바꾸면 됨 (숫자가 클수록 불투명) */}
    <div
      aria-hidden="true"
      className="w-42 h-24 left-1/2 -translate-x-1/2 top-22 absolute overflow-hidden rounded-bl-[10px] rounded-br-[10px] bg-stone-300/65 shadow-[0px_0px_2.5px_1px_rgba(0,0,0,0.10),0px_1.5px_2.5px_1.5px_rgba(81,48,24,0.30),inset_0px_0px_2.5px_2.5px_rgba(198,198,198,0.25)] outline-[0.5px] outline-offset-[-0.5px] outline-stone-400/30"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
        <div className="w-full flex items-center justify-between">
          <img src={mcmWatermark} alt="" className="w-15 h-13 object-contain opacity-50" />
          <img src={diamondIcon} alt="" className="size-6 opacity-70" />
          <img src={mcmWatermark} alt="" className="w-15 h-13 object-contain opacity-50" />
        </div>
        <div className="w-full flex items-center justify-between">
          <img src={diamondIcon} alt="" className="size-6 opacity-70" />
          <img
            src={mcmWatermark}
            alt=""
            className="w-15 h-13 rotate-180 object-contain opacity-50"
          />
          <img src={diamondIcon} alt="" className="size-6 opacity-70" />
        </div>
      </div>
    </div>
  </button>
);

const Passport = () => {
  const navigate = useNavigate();

  // 카테고리 유무에 따라 그리드 vs 빈 상태 UI 분기
  const hasCategories = mockCategories.length > 0;

  const handleAddCategory = () => {
    navigate("/passport/new");
  };

  const handleOpenMap = () => {
    navigate("/map");
  };

  const handleOpenCategory = (categoryId: string) => {
    navigate(`/passport/${categoryId}`);
  };

  return (
    // 전체 컨테이너: FooterNavigation과 동일한 폭 기준(w-full max-w-107.5)으로 맞춤, 배경은 가죽 텍스처 이미지
    // min-h-dvh: 실제 뷰포트 높이가 844px보다 커도 가죽 배경이 하단 푸터까지 끊김 없이 이어지도록 함
    // 카드가 absolute로 배치돼서 컨테이너 높이에 반영되지 않으므로, overflow-hidden을 없애
    // 카테고리가 많아 화면을 넘어갈 때 (고정된 푸터는 그대로 두고) 페이지 자체가 스크롤되게 함
    <div
      className="relative w-full max-w-107.5 min-h-dvh mx-auto bg-[#AB6A37] bg-cover bg-center"
      style={{ backgroundImage: `url(${leatherTexture})` }}
    >
      {/* 상단 그라데이션 오버레이 + 헤더(인사말 + 지도/카테고리 추가 버튼) */}
      <div className="w-full h-64 left-0 top-0 absolute bg-linear-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-2 absolute right-[29px] top-[82px]">
          {/* 지도 보기 버튼 - 원형 아이콘 버튼 */}
          <button
            onClick={handleOpenMap}
            aria-label="지도 보기"
            className="size-8 relative bg-white/50 rounded-[10px] flex items-center justify-center"
          >
            <img src={globeIcon} alt="" className="size-5" />
          </button>
          {/* 카테고리 추가하기 버튼 */}
          <button
            onClick={handleAddCategory}
            className="px-3.5 py-2 bg-white/50 rounded-[10px] text-white text-xs font-semibold font-['Pretendard_Variable'] whitespace-nowrap"
          >
            카테고리 추가하기
          </button>
        </div>

        {/* 인사말 텍스트 */}
        <p className="left-[49px] top-[83px] absolute text-white text-xl font-bold font-['Pretendard_Variable']">
          반가워요,
        </p>
        <p className="left-[49px] top-[111px] absolute text-white text-3xl font-bold font-['Pretendard_Variable']">
          @{mockUserName}
        </p>
      </div>

      {/* 카드 그리드 (카테고리 있을 때) vs 빈 상태 안내 문구 (없을 때) */}
      {/* absolute 대신 일반 흐름(margin/padding)으로 배치 → 컨테이너 높이가 카테고리 수만큼 실제로 늘어나서
          배경 가죽 텍스처가 스크롤 끝까지 끊기지 않고 이어짐 */}
      {hasCategories ? (
        // w-fit + mx-auto: 카드 2장(w-40) + 간격(gap-5)이 실제로 필요로 하는 폭만큼만 차지하고
        // 컨테이너 안에서 좌우 중앙 정렬되도록 함 (이전엔 w-80 고정폭이 카드+간격 합계보다 좁아서
        // 카드가 찌그러지고 왼쪽으로 치우쳐 보였음)
        <div className="w-fit mx-auto pt-45.75 flex flex-col gap-5 pb-32">
          {/* 카테고리를 2개씩 묶어서 행(row) 단위로 렌더링 (2열 그리드) */}
          {Array.from({ length: Math.ceil(mockCategories.length / 2) }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-5">
              {mockCategories.slice(rowIdx * 2, rowIdx * 2 + 2).map((category) => (
                <TravelCard
                  key={category.id}
                  category={category}
                  onClick={() => handleOpenCategory(category.id)}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        // 빈 상태: 아직 등록된 카테고리가 없을 때 보여주는 안내 문구
        <div className="w-80 mx-auto pt-55 flex flex-col items-center text-center gap-1">
          <p className="text-white text-sm font-['Pretendard_Variable']">
            아직 등록된 여행 기록이 없어요
          </p>
          <p className="text-white/70 text-xs font-['Pretendard_Variable']">
            카테고리를 추가하고 첫 여행을 기록해보세요
          </p>
        </div>
      )}

      {/* 하단 푸터(FooterNavigation)는 RootLayout에서 공통으로 감싸서 렌더링되므로 여기선 작성하지 않음 */}
    </div>
  );
};

export default Passport;
