import { useMemo, useState } from "react";

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

// 작가 선택 페이지 Location State 타입
interface ArtistSelectLocationState {
  // 작가 선택 완료 후 복귀 경로
  returnTo?: string;

  // 작가 선택 진입 플로우
  source?: "ai-patch" | "onetoone";

  // AI 패치 수정 모드
  mode?: "edit";

  // AI 패치 수정 단계
  editStep?: 1 | 2 | 3;

  // AI 여행 분석 추천 작가 id 목록
  recommendedArtistIds?: number[];

  // 1:1 커스텀 선택 사진 id
  selectedPhotoId?: number;

  // 1:1 커스텀 선택 사진 URL
  selectedImage?: string;

  // 기존 선택 작가 id
  selectedArtistId?: number;

  // 기존 선택 위치
  selectedLocation?: PatchLocation;

  // 기존 요청사항
  requestText?: string;
}

export default function CustomArtistSelect() {
  const navigate = useNavigate();

  const location = useLocation();

  // 이전 페이지 전달 Location State
  const locationState = location.state as ArtistSelectLocationState | null;

  // 1:1 커스텀 플로우 여부
  const isOneToOne = locationState?.source === "onetoone";

  // AI 패치 플로우 여부
  const isAIPatch = locationState?.source === "ai-patch";

  // 전체 작가 목록 조회
  const { data: artists = [], isPending: isArtistsPending, isError: isArtistsError } = useArtists();

  // AI 패치 선택 작가 id 저장 함수
  const setAIPatchSelectedArtistId = useAIPatchStore((state) => state.setSelectedArtistId);

  // 현재 선택 작가 id
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
    locationState?.selectedArtistId ?? null,
  );

  // 상세 조회 작가 id
  const [detailArtistId, setDetailArtistId] = useState<number | undefined>(undefined);

  // 선택 작가 상세 조회
  const { data: detailArtist } = useArtist(detailArtistId);

  // 다른 작가 목록 패널 상태
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // AI 추천 작가 id 목록
  const recommendedArtistIds = locationState?.recommendedArtistIds ?? [];

  // AI 추천 작가 id 집합
  const recommendedArtistIdSet = useMemo(
    () => new Set(recommendedArtistIds),
    [recommendedArtistIds],
  );

  // AI 추천 실제 작가 목록
  const aiRecommendedArtists = useMemo<Artist[]>(
    () =>
      recommendedArtistIds
        .map((artistId) => artists.find((artist) => artist.artistId === artistId))
        .filter((artist): artist is Artist => artist !== undefined),
    [artists, recommendedArtistIds],
  );

  // 1:1 커스텀 상단 작가 목록
  const oneToOneTopArtists = artists.slice(0, 3);

  // 1:1 커스텀 기타 작가 목록
  const oneToOneOtherArtists = artists.slice(3);

  // AI 추천 작가 제외 기타 작가 목록
  const aiOtherArtists = useMemo(
    () => artists.filter((artist) => !recommendedArtistIdSet.has(artist.artistId)),
    [artists, recommendedArtistIdSet],
  );

  // 상단 슬라이더 작가 목록
  const sliderArtists = isOneToOne ? oneToOneTopArtists : aiRecommendedArtists;

  // 다른 작가 목록
  const otherArtistList = isOneToOne ? oneToOneOtherArtists : aiOtherArtists;

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

  // 선택 작가 저장 및 이동
  const handleSelectButtonClick = () => {
    if (selectedArtistId === null) {
      return;
    }

    // AI 패치 플로우 이동
    if (isAIPatch && locationState?.returnTo) {
      setAIPatchSelectedArtistId(selectedArtistId);

      navigate(locationState.returnTo, {
        state: {
          // 수정 모드 유지 정보
          mode: locationState.mode,

          // 수정 단계 유지 정보
          editStep: locationState.editStep,

          // 작가 선택 단계 유지 정보
          currentStep: 2,
        },
      });

      return;
    }

    // 1:1 커스텀 주문 플로우 이동
    if (isOneToOne) {
      navigate(locationState?.returnTo ?? "/onetooneorder/request", {
        state: {
          // 선택 사진 id
          selectedPhotoId: locationState?.selectedPhotoId,

          // 선택 사진 URL
          selectedImage: locationState?.selectedImage,

          // 선택 실제 작가 id
          selectedArtistId,

          // 기존 선택 위치
          selectedLocation: locationState?.selectedLocation,

          // 기존 요청사항
          requestText: locationState?.requestText,

          // 다음 진행 단계
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
    <div className="relative mx-auto min-h-dvh max-w-97 bg-[#F9F4F0]">
      {/* 상단 헤더 */}
      <PageHeader title="작가 선택" />

      {/* 작가 목록 로딩 */}
      {isArtistsPending && (
        <p className="py-20 text-center text-[#727272]">작가 목록을 불러오는 중입니다.</p>
      )}

      {/* 작가 목록 오류 */}
      {isArtistsError && (
        <p className="py-20 text-center text-[#727272]">작가 목록을 불러오지 못했습니다.</p>
      )}

      {/* AI 추천 작가 없음 */}
      {!isArtistsPending && !isArtistsError && isAIPatch && sliderArtists.length === 0 && (
        <p className="py-20 text-center text-[#727272]">추천 작가가 없습니다.</p>
      )}

      {/* 추천 작가 슬라이더 */}
      {!isArtistsPending && !isArtistsError && sliderArtists.length > 0 && (
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
          <span className="text-[1.125rem] font-bold text-[#192A40]">다른 작가 더보기</span>

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
            text-[1.125rem]
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

      {/* 다른 작가 목록 패널 */}
      {isMoreOpen && (
        <div className="fixed inset-x-0 bottom-0 top-25.5 z-30 mx-auto max-w-97 bg-[#F9F4F0]">
          {/* 다른 작가 스크롤 영역 */}
          <div className="h-full overflow-y-auto px-6 pb-32">
            {/* 다른 작가 목록 닫기 버튼 */}
            <button
              type="button"
              onClick={handleMoreArtistClick}
              className="flex w-full items-center justify-between py-6"
            >
              <span className="text-[1.125rem] font-bold text-[#192A40]">다른 작가 더보기</span>

              <ChevronDown className="rotate-180" size={30} color="#192A40" />
            </button>

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

            {/* 다른 작가 없음 */}
            {!isArtistsPending && !isArtistsError && otherArtistList.length === 0 && (
              <p className="py-10 text-center text-[#727272]">다른 작가가 없습니다.</p>
            )}
          </div>

          {/* 하단 고정 작가 선택 버튼 */}
          <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-97 bg-[#F9F4F0] px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              disabled={selectedArtistId === null}
              onClick={handleSelectButtonClick}
              className={`
                h-16
                w-full
                rounded-[20px]
                text-[1.125rem]
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
