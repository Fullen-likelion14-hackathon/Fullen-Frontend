import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ArtistSlider from "@/components/oneToOneOrder/ArtistSlider";
import ArtistCard from "@/components/oneToOneOrder/ArtistCard";
import ArtistDetailModal from "@/components/oneToOneOrder/ArtistDetailModal";

// AI 추천 작가는 패치 API 연결 전까지 더미 데이터 사용
import { recommendedArtists } from "@/mocks/ArtistData";
import type { Artist as MockArtist } from "@/mocks/ArtistData";

import { useArtists } from "@/hooks/queries/artist/useArtists";
import { useArtist } from "@/hooks/queries/artist/useArtist";

import type { PatchLocation } from "@/types/patchLocation";

import { useAIPatchStore } from "@/stores/aiPatchStore";

// 작가 선택 페이지로 들어올 때 전달받는 state 타입
interface ArtistSelectLocationState {
  // 작가 선택 완료 후 돌아갈 경로
  returnTo?: string;

  // 어떤 플로우에서 작가 선택 페이지로 들어왔는지 구분
  source?: "ai-patch" | "onetoone";

  // AI 패치 수정 모드 여부
  mode?: "edit";

  // AI 패치에서 수정 중인 단계
  editStep?: 1 | 2 | 3;

  // 추후 AI 패치 생성 결과에서 전달받을 추천 작가 id
  recommendedArtistIds?: number[];

  // 1:1 커스텀에서 선택한 사진 id
  selectedPhotoId?: number;

  // 1:1 커스텀에서 선택한 사진 URL
  selectedImage?: string;

  // 기존에 선택한 작가 id
  selectedArtistId?: number;

  // 기존에 선택한 위치
  selectedLocation?: PatchLocation;

  // 작성 중인 요청사항
  requestText?: string;
}

export default function CustomArtistSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 state
  const locationState = location.state as ArtistSelectLocationState | null;

  // 진입 플로우 구분
  const isOneToOne = locationState?.source === "onetoone";

  const isAIPatch = locationState?.source === "ai-patch";

  // 전체 작가 목록 조회
  // 1:1 커스텀에서는 앞 3명 + 나머지 작가를 나누어 사용
  // AI 커스텀에서는 다른 작가 목록에 사용
  const { data: artists = [], isPending: isArtistsPending, isError: isArtistsError } = useArtists();

  // AI 패치에서 선택한 작가 id를 저장하는 Zustand 함수
  const setAIPatchSelectedArtistId = useAIPatchStore((state) => state.setSelectedArtistId);

  // 현재 선택한 작가 id
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
    locationState?.selectedArtistId ?? null,
  );

  // 상세보기할 작가 id
  const [detailArtistId, setDetailArtistId] = useState<number | undefined>(undefined);

  // 선택한 작가 상세 조회
  const { data: detailArtist } = useArtist(detailArtistId);

  // 다른 작가 더보기 패널 상태
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // ======================================
  // 1:1 커스텀 작가 데이터
  // ======================================

  // 전체 작가 중 앞 3명
  const oneToOneTopArtists = artists.slice(0, 3);

  // ArtistSlider가 아직 MockArtist 타입을 사용하고 있으므로
  // API 데이터를 Slider에서 사용하는 형태로 변환
  const oneToOneSliderArtists: MockArtist[] = oneToOneTopArtists.map((artist) => ({
    id: artist.artistId,
    name: artist.artistName,
    image: artist.imgUrl,
    flagImage: artist.nationImgUrl,
    description: artist.introSummary,

    // 상세 정보는 상세 API에서 따로 조회
    detailImages: [],
    detailSummary: artist.introSummary,
    detailDescription: [],
  }));

  // 1:1 커스텀에서는 앞 3명을 제외한 작가
  const oneToOneOtherArtists = artists.slice(3);

  // ======================================
  // 화면에 사용할 데이터 결정
  // ======================================

  // 슬라이더
  // 1:1 → 전체 작가 API 앞 3명
  // AI → 현재는 더미 추천 작가 3명
  const sliderArtists = isOneToOne ? oneToOneSliderArtists : recommendedArtists;

  // 다른 작가 목록
  // 1:1 → 앞 3명을 제외한 나머지
  // AI → 전체 작가 목록
  const otherArtistList = isOneToOne ? oneToOneOtherArtists : artists;

  // 작가 선택 / 선택 취소
  const handleArtistToggle = (artistId: number | null) => {
    if (artistId === null) {
      setSelectedArtistId(null);
      return;
    }

    setSelectedArtistId((prev) => (prev === artistId ? null : artistId));
  };

  // 다른 작가 카드 상세보기
  const handleArtistDetail = (artistId: number) => {
    setDetailArtistId(artistId);
  };

  // 슬라이더 작가 상세보기
  // 1:1의 경우 API artistId가 들어있음
  // AI는 추후 추천 artistId API 연결 예정
  const handleSliderArtistDetail = (artist: MockArtist) => {
    setDetailArtistId(artist.id);
  };

  // 작가 상세보기 모달 닫기
  const handleDetailClose = () => {
    setDetailArtistId(undefined);
  };

  // 선택한 작가 저장 및 이동
  const handleSelectButtonClick = () => {
    if (selectedArtistId === null) return;

    // ======================================
    // AI 패치 플로우
    // ======================================
    if (isAIPatch && locationState?.returnTo) {
      setAIPatchSelectedArtistId(selectedArtistId);

      navigate(locationState.returnTo, {
        state: {
          mode: locationState.mode,
          editStep: locationState.editStep,
          currentStep: 2,
        },
      });

      return;
    }

    // ======================================
    // 1:1 커스텀 주문 플로우
    // ======================================
    if (isOneToOne) {
      navigate(locationState?.returnTo ?? "/onetooneorder/request", {
        state: {
          // 사진 id 유지
          selectedPhotoId: locationState?.selectedPhotoId,

          // 사진 URL 유지
          selectedImage: locationState?.selectedImage,

          // 선택한 실제 작가 id
          selectedArtistId,

          // 기존 위치 유지
          selectedLocation: locationState?.selectedLocation,

          // 기존 요청사항 유지
          requestText: locationState?.requestText,

          // 작가 선택 완료 후 위치 선택 단계
          currentStep: 3,
        },
      });

      return;
    }
  };

  // 다른 작가 목록 열기 / 닫기
  const handleMoreArtistClick = () => {
    setIsMoreOpen((prev) => !prev);
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-97 bg-[#F9F4F0]">
      {/* 상단 헤더 */}
      <PageHeader title="작가 선택" />

      {/* 작가 목록 로딩 */}
      {isArtistsPending && isOneToOne && (
        <p className="py-20 text-center text-[#727272]">작가 목록을 불러오는 중입니다.</p>
      )}

      {/* 작가 목록 에러 */}
      {isArtistsError && isOneToOne && (
        <p className="py-20 text-center text-[#727272]">작가 목록을 불러오지 못했습니다.</p>
      )}

      {/* ======================================
          작가 슬라이더
          1:1 → API 앞 3명
          AI → 현재 더미 추천 3명
      ====================================== */}
      {(!isOneToOne || (!isArtistsPending && !isArtistsError)) && (
        <ArtistSlider
          artists={sliderArtists}
          selectedArtistId={selectedArtistId}
          onSelectArtist={handleArtistToggle}
          onDetailArtist={handleSliderArtistDetail}
        />
      )}

      {/* 기본 화면 하단 영역 */}
      <div className="px-6 pb-10 pt-6">
        {/* 다른 작가 목록 열기 버튼 */}
        <button
          type="button"
          onClick={handleMoreArtistClick}
          className="flex w-full items-center justify-between py-4"
        >
          <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

          <ChevronDown size={30} color="#192A40" />
        </button>

        {/* 작가 선택 버튼 */}
        <button
          type="button"
          disabled={selectedArtistId === null}
          onClick={handleSelectButtonClick}
          className={`
            mt-8
            h-16
            w-full
            rounded-[20px]
            text-[18px]
            font-bold
            shadow-md
            transition
            ${
              selectedArtistId === null
                ? "cursor-not-allowed bg-[#D9D9D9] text-white"
                : "bg-[#162B47] text-white"
            }
          `}
        >
          해당 작가 선택하기
        </button>
      </div>

      {/* ======================================
          다른 작가 목록 패널
      ====================================== */}
      {isMoreOpen && (
        <div className="max-w-97 mx-auto fixed inset-x-0 bottom-0 top-25.5 z-30 bg-[#F9F4F0]">
          {/* 스크롤 영역 */}
          <div className="h-full overflow-y-auto px-6 pb-32">
            {/* 다른 작가 목록 닫기 버튼 */}
            <button
              type="button"
              onClick={handleMoreArtistClick}
              className="flex w-full items-center justify-between py-6"
            >
              <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

              <ChevronDown className="rotate-180" size={30} color="#192A40" />
            </button>

            {/* 로딩 */}
            {isArtistsPending && (
              <p className="py-10 text-center text-[#727272]">작가 목록을 불러오는 중입니다.</p>
            )}

            {/* 에러 */}
            {isArtistsError && (
              <p className="py-10 text-center text-[#727272]">작가 목록을 불러오지 못했습니다.</p>
            )}

            {/* 다른 작가 카드 목록 */}
            {!isArtistsPending && !isArtistsError && (
              <div className="flex flex-col gap-3">
                {otherArtistList.map((artist) => (
                  <ArtistCard
                    key={artist.artistId}
                    artist={artist}
                    isSelected={selectedArtistId === artist.artistId}
                    onSelect={handleArtistToggle}
                    onDetail={handleArtistDetail}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 하단 고정 작가 선택 버튼 */}
          <div className="max-w-97 mx-auto fixed inset-x-0 bottom-0 z-40 bg-[#F9F4F0] px-6 pb-6 pt-3">
            <button
              type="button"
              disabled={selectedArtistId === null}
              onClick={handleSelectButtonClick}
              className={`
                h-16
                w-full
                rounded-[20px]
                text-[18px]
                font-bold
                shadow-md
                transition
                ${
                  selectedArtistId === null
                    ? "cursor-not-allowed bg-[#D9D9D9] text-white"
                    : "bg-[#162B47] text-white"
                }
              `}
            >
              해당 작가 선택하기
            </button>
          </div>
        </div>
      )}

      {/* 작가 상세보기 모달 */}
      <ArtistDetailModal
        key={detailArtist?.artistId ?? "closed"}
        artist={detailArtist ?? null}
        isOpen={detailArtistId !== undefined}
        onClose={handleDetailClose}
      />
    </div>
  );
}
