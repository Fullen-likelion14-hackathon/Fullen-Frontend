import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ArtistSlider from "@/components/oneToOneOrder/ArtistSlider";
import ArtistCard from "@/components/oneToOneOrder/ArtistCard";
import ArtistDetailModal from "@/components/oneToOneOrder/ArtistDetailModal";

import { useArtists } from "@/hooks/queries/artist/useArtists";
import { useArtist } from "@/hooks/queries/artist/useArtist";

import type { Artist } from "@/types/artist";
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

  // AI 패치 생성 결과에서 전달받은 추천 작가 id
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

  // 1:1 커스텀에서는 전체 작가 중 앞 3명 사용
  const oneToOneTopArtists = artists.slice(0, 3);

  // 1:1 커스텀에서는 앞 3명을 제외한 나머지 작가
  const oneToOneOtherArtists = artists.slice(3);

  // AI 추천 작가 데이터
  const recommendedArtistIds = locationState?.recommendedArtistIds ?? [];

  // 추천 작가 id가 있으면 해당 id 순서대로 실제 작가 데이터 조회
  const aiRecommendedArtists: Artist[] =
    recommendedArtistIds.length > 0
      ? recommendedArtistIds
          .map((artistId) => artists.find((artist) => artist.artistId === artistId))
          .filter((artist): artist is Artist => artist !== undefined)
      : artists.slice(0, 3);

  // 슬라이더 1:1 → 전체 작가 API 앞 3명  AI → 추천 artistId에 해당하는 실제 작가
  const sliderArtists = isOneToOne ? oneToOneTopArtists : aiRecommendedArtists;

  // 다른 작가 목록 1:1 → 앞 3명을 제외한 나머지 AI → 전체 작가 목록
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
  const handleSliderArtistDetail = (artist: Artist) => {
    setDetailArtistId(artist.artistId);
  };

  // 작가 상세보기 모달 닫기
  const handleDetailClose = () => {
    setDetailArtistId(undefined);
  };

  // 선택한 작가 저장 및 이동
  const handleSelectButtonClick = () => {
    if (selectedArtistId === null) return;

    // AI 패치 플로우
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

    // 1:1 커스텀 주문 플로우
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
      {isArtistsPending && (
        <p className="py-20 text-center text-[#727272]">작가 목록을 불러오는 중입니다.</p>
      )}

      {/* 작가 목록 에러 */}
      {isArtistsError && (
        <p className="py-20 text-center text-[#727272]">작가 목록을 불러오지 못했습니다.</p>
      )}

      {/* 작가 슬라이더 1:1 → API 앞 3명  AI → 추천 작가 id 기반*/}
      {!isArtistsPending && !isArtistsError && (
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

      {/* 다른 작가 목록 패널*/}
      {isMoreOpen && (
        <div className="fixed inset-x-0 bottom-0 top-25.5 z-30 mx-auto max-w-97 bg-[#F9F4F0]">
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
          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-97 bg-[#F9F4F0] px-6 pb-6 pt-3">
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
