import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";
import FrameSelectBox from "@/components/custom/common/selection/FrameSelectBox";
import PhotoSelectBox from "@/components/custom/common/selection/PhotoSelectBox";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { useGenerateAIPatch } from "@/hooks/mutations/ai/useGenerateAIPatch";
import { useAIAnalysis } from "@/hooks/queries/ai/useAIAnalysis";
import { useArtists } from "@/hooks/queries/artist/useArtists";

import { useAIPatchStore } from "@/stores/aiPatchStore";

import type { AIPatchApiType } from "@/types/ai";

const AIPatchFinalCheck = () => {
  const navigate = useNavigate();

  // AI 여행 분석 조회 Query
  const {
    data: analysis,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
  } = useAIAnalysis();

  // AI 패치 생성 Mutation
  const {
    mutateAsync: generateAIPatch,
    isPending: isGenerating,
  } = useGenerateAIPatch();

  // 선택 피드 사진 id
  const selectedPhotoId = useAIPatchStore(
    (state) => state.selectedPhotoId,
  );

  // 선택 피드 사진 이미지 URL
  const selectedImage = useAIPatchStore(
    (state) => state.selectedImage,
  );

  // 선택 작가 id
  const selectedArtistId = useAIPatchStore(
    (state) => state.selectedArtistId,
  );

  // 선택 프레임
  const selectedFrame = useAIPatchStore(
    (state) => state.selectedFrame,
  );

  // AI 생성 결과 저장 함수
  const setGeneratedPatches = useAIPatchStore(
    (state) => state.setGeneratedPatches,
  );

  // 작가 리스트 API 조회
  const {
    data: artists = [],
    isPending: isArtistsPending,
    isError: isArtistsError,
  } = useArtists();

  // API 작가 리스트 선택 작가 정보
  const selectedArtist =
    artists.find(
      (artist) => artist.artistId === selectedArtistId,
    ) ?? null;

  // AI 분석 사용자 이름
  const nickname = analysis?.username ?? "";

  // AI 분석 여행 스타일
  const travelStyle = analysis?.travelStyle ?? "";

  // 서버 전송용 프레임 타입
  const apiFrameType: AIPatchApiType | null =
    selectedFrame === "ticket"
      ? "TICKET"
      : selectedFrame === "stamp"
        ? "STAMP"
        : selectedFrame === "label"
          ? "LABEL"
          : null;