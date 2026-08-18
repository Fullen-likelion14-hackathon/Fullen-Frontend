import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ArtistSlider from "@/components/oneToOneOrder/ArtistSlider";
import ArtistCard from "@/components/oneToOneOrder/ArtistCard";
import ArtistDetailModal from "@/components/oneToOneOrder/ArtistDetailModal";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

import type { Artist } from "@/mocks/ArtistData";
import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";

interface ArtistSelectLocationState {
  // 작가 선택 완료 후 돌아갈 경로
  returnTo?: string;

  // 어떤 플로우에서 들어왔는지 구분
  source?: "ai-patch" | "onetoone";

  // AI 패치에서 기존 선택값 유지
  selectedImage?: string;
  selectedFrame?: FrameType;

  // AI 패치 수정 모드 유지
  mode?: "edit";
  editStep?: 1 | 2 | 3;
}

export default function CustomArtistSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 state
  const locationState = location.state as ArtistSelectLocationState | null;

  // 실제 선택한 작가 id
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  // 다른 작가 더보기 상태
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // 상세 모달에서 보여줄 작가
  const [detailArtist, setDetailArtist] = useState<Artist | null>(null);

  // 작가 선택 / 선택 취소
  const handleArtistToggle = (artistId: number | null) => {
    if (artistId === null) {
      setSelectedArtistId(null);
      return;
    }

    setSelectedArtistId((prev) => (prev === artistId ? null : artistId));
  };

  // 작가 상세보기
  const handleArtistDetail = (artist: Artist) => {
    setDetailArtist(artist);
  };

  // 상세 모달 닫기
  const handleDetailClose = () => {
    setDetailArtist(null);
  };

  // 선택한 작가를 진입한 플로우에 맞는 페이지로 전달
  const handleSelectButtonClick = () => {
    if (selectedArtistId === null) return;

    // AI 패치 생성 / 수정 플로우에서 들어온 경우
    if (locationState?.source === "ai-patch" && locationState.returnTo) {
      navigate(locationState.returnTo, {
        state: {
          // 새로 선택한 작가
          selectedArtistId,

          // 기존 선택값 유지
          selectedImage: locationState.selectedImage,
          selectedFrame: locationState.selectedFrame,

          // 수정 모드 유지
          mode: locationState.mode,
          editStep: locationState.editStep,

          // 일반 AI 패치 작가 선택일 경우 2단계 복귀
          currentStep: 2,
        },
      });

      return;
    }

    // 1:1 커스텀 주문에서 들어온 경우
    if (locationState?.source === "onetoone") {
      navigate("/onetooneorder/request", {
        state: {
          selectedArtistId,

          // 기존에 선택했던 사진 유지
          selectedImage: locationState.selectedImage,

          // 작가 선택 완료 후 위치 선택 단계로 이동
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
    <div className="relative min-h-screen max-w-97 mx-auto bg-[#F9F4F0]">
      {/* 상단 헤더 */}
      <PageHeader title="작가 선택" />

      {/* AI 추천 작가 3명 */}
      <ArtistSlider
        artists={recommendedArtists}
        selectedArtistId={selectedArtistId}
        onSelectArtist={handleArtistToggle}
        onDetailArtist={handleArtistDetail}
      />

      {/* 기본 화면 */}
      <div className="px-6 pb-10 pt-6">
        {/* 다른 작가 더보기 */}
        <button
          type="button"
          onClick={handleMoreArtistClick}
          className="flex w-full items-center justify-between py-4"
        >
          <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

          <ChevronDown size={30} color="#192A40" />
        </button>

        {/* 작가 선택 완료 버튼 */}
        <button
          type="button"
          disabled={selectedArtistId === null}
          onClick={handleSelectButtonClick}
          className={`mt-8 h-16 w-full rounded-[20px] text-[18px] font-bold shadow-md transition ${
            selectedArtistId === null
              ? "cursor-not-allowed bg-[#D9D9D9] text-white"
              : "bg-[#162B47] text-white"
          }`}
        >
          해당 작가 선택하기
        </button>
      </div>
      {/* 다른 작가 목록 패널 */}
      {isMoreOpen && (
        <div className="max-w-97 mx-auto fixed inset-x-0 bottom-0 top-25.5 z-30 bg-[#F9F4F0]">
          {/* 스크롤 영역 */}
          <div className="h-full overflow-y-auto px-6 pb-32">
            {/* 다른 작가 더보기 닫기 */}
            <button
              type="button"
              onClick={handleMoreArtistClick}
              className="flex w-full items-center justify-between py-6"
            >
              <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

              <ChevronDown className="rotate-180" size={30} color="#192A40" />
            </button>

            {/* 다른 작가 목록 */}
            <div className="flex flex-col gap-3">
              {otherArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  isSelected={selectedArtistId === artist.id}
                  onSelect={handleArtistToggle}
                  onDetail={handleArtistDetail}
                />
              ))}
            </div>
          </div>

          {/* 하단 고정 작가 선택 버튼 */}
          <div className="max-w-97 mx-auto fixed inset-x-0 bottom-0 z-40 bg-[#F9F4F0] px-6 pb-6 pt-3">
            <button
              type="button"
              disabled={selectedArtistId === null}
              onClick={handleSelectButtonClick}
              className={`h-16 w-full rounded-[20px] text-[18px] font-bold shadow-md transition ${
                selectedArtistId === null
                  ? "cursor-not-allowed bg-[#D9D9D9] text-white"
                  : "bg-[#162B47] text-white"
              }`}
            >
              해당 작가 선택하기
            </button>
          </div>
        </div>
      )}

      {/* 작가 상세 모달 */}
      <ArtistDetailModal
        key={detailArtist?.id ?? "closed"}
        artist={detailArtist}
        isOpen={detailArtist !== null}
        onClose={handleDetailClose}
      />
    </div>
  );
}
