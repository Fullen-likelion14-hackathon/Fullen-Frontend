import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ArtistSlider from "@/components/oneToOneOrder/ArtistSlider";
import ArtistCard from "@/components/oneToOneOrder/ArtistCard";
import ArtistDetailModal from "@/components/oneToOneOrder/ArtistDetailModal";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

import type { Artist } from "@/mocks/ArtistData";

import { useAIPatchStore } from "@/stores/aiPatchStore";

// 작가 선택 페이지로 들어올 때 전달받는 state 타입임
interface ArtistSelectLocationState {
  // 작가 선택 완료 후 돌아갈 경로임
  returnTo?: string;

  // 어떤 플로우에서 작가 선택 페이지로 들어왔는지 구분함
  source?: "ai-patch" | "onetoone";

  // AI 패치 수정 모드 여부임
  mode?: "edit";

  // AI 패치에서 수정 중인 단계임
  editStep?: 1 | 2 | 3;

  // 1:1 커스텀에서 기존에 선택한 사진임
  selectedImage?: string;
}

export default function CustomArtistSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 state임
  const locationState = location.state as ArtistSelectLocationState | null;

  // AI 패치에서 선택한 작가 id를 저장하는 Zustand 함수임
  const setAIPatchSelectedArtistId = useAIPatchStore((state) => state.setSelectedArtistId);

  // 현재 화면에서 선택한 작가 id임
  // 아직 선택하지 않은 경우 null임
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  // 다른 작가 더보기 패널이 열려있는지 저장함
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // 상세 모달에서 보여줄 작가 정보를 저장함
  const [detailArtist, setDetailArtist] = useState<Artist | null>(null);

  // 작가 선택 또는 선택 취소 처리함
  const handleArtistToggle = (artistId: number | null) => {
    // null이 들어오면 현재 선택을 해제함
    if (artistId === null) {
      setSelectedArtistId(null);
      return;
    }

    // 이미 선택된 작가를 다시 누르면 선택 해제함
    // 다른 작가를 누르면 해당 작가로 변경함
    setSelectedArtistId((prev) => (prev === artistId ? null : artistId));
  };

  // 작가 상세보기 모달을 열어줌
  const handleArtistDetail = (artist: Artist) => {
    setDetailArtist(artist);
  };

  // 작가 상세보기 모달을 닫아줌
  const handleDetailClose = () => {
    setDetailArtist(null);
  };

  // 선택한 작가를 현재 진입한 플로우에 맞게 저장하고 이동함
  const handleSelectButtonClick = () => {
    // 작가를 선택하지 않은 경우 아무 동작하지 않음
    if (selectedArtistId === null) return;

    // AI 패치 생성 또는 수정 플로우에서 들어온 경우임
    if (locationState?.source === "ai-patch" && locationState.returnTo) {
      // 선택한 작가 id를 AI 패치 Zustand store에 저장함
      // 사진과 프레임은 이미 store에 있으므로 다시 전달하지 않음
      setAIPatchSelectedArtistId(selectedArtistId);

      // AI 패치 옵션 선택 페이지로 돌아감
      navigate(locationState.returnTo, {
        state: {
          // 수정 모드에서 들어온 경우 수정 상태 유지함
          mode: locationState.mode,
          editStep: locationState.editStep,

          // 일반 AI 패치 작가 선택에서 들어온 경우
          // 작가 선택 단계인 2단계로 돌아감
          currentStep: 2,
        },
      });

      return;
    }

    // 1:1 커스텀 주문 플로우에서 들어온 경우임
    if (locationState?.source === "onetoone") {
      navigate("/onetooneorder/request", {
        state: {
          // 선택한 작가 id 전달함
          selectedArtistId,

          // 1:1 커스텀에서 기존에 선택한 사진 유지함
          selectedImage: locationState.selectedImage,

          // 작가 선택 완료 후 위치 선택 단계로 이동함
          currentStep: 3,
        },
      });

      return;
    }
  };

  // 다른 작가 목록 열기 또는 닫기 처리함
  const handleMoreArtistClick = () => {
    setIsMoreOpen((prev) => !prev);
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-97 bg-[#F9F4F0]">
      {/* 상단 헤더 영역임 */}
      <PageHeader title="작가 선택" />

      {/* AI 추천 작가 슬라이더 영역임 */}
      <ArtistSlider
        artists={recommendedArtists}
        selectedArtistId={selectedArtistId}
        onSelectArtist={handleArtistToggle}
        onDetailArtist={handleArtistDetail}
      />

      {/* 기본 화면 하단 영역임 */}
      <div className="px-6 pb-10 pt-6">
        {/* 다른 작가 목록 열기 버튼임 */}
        <button
          type="button"
          onClick={handleMoreArtistClick}
          className="flex w-full items-center justify-between py-4"
        >
          <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

          <ChevronDown size={30} color="#192A40" />
        </button>

        {/* 현재 선택한 작가 확정 버튼임 */}
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

      {/* 다른 작가 목록 패널임 */}
      {isMoreOpen && (
        <div className="fixed inset-x-0 bottom-0 top-25.5 z-30 bg-[#F9F4F0]">
          {/* 다른 작가 목록 스크롤 영역임 */}
          <div className="h-full overflow-y-auto px-6 pb-32">
            {/* 다른 작가 목록 닫기 버튼임 */}
            <button
              type="button"
              onClick={handleMoreArtistClick}
              className="flex w-full items-center justify-between py-6"
            >
              <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

              <ChevronDown className="rotate-180" size={30} color="#192A40" />
            </button>

            {/* 다른 작가 카드 목록임 */}
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

          {/* 다른 작가 목록 하단 고정 선택 버튼임 */}
          <div className="fixed inset-x-0 bottom-0 z-40 bg-[#F9F4F0] px-6 pb-6 pt-3">
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

      {/* 작가 상세보기 모달임 */}
      <ArtistDetailModal
        key={detailArtist?.id ?? "closed"}
        artist={detailArtist}
        isOpen={detailArtist !== null}
        onClose={handleDetailClose}
      />
    </div>
  );
}
