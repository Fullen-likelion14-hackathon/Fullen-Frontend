import { create } from "zustand";

import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";

// AI 생성 패치 결과 타입
export interface GeneratedPatch {
  // 현재 AI 생성 결과 내 구분용 id
  id: number;

  // S3 AI 패치 이미지 URL
  image: string;
}

// AI 패치 결과 페이지 저장 패치 타입
export interface SavedPatch {
  // 가방 커스텀 영역에서 사용하는 패치 고유 id
  id: string;

  // 서버 발급 실제 패치 id
  patchId: number;

  // AI 생성 결과 원본 id
  resultId: number;

  // 저장 패치 이미지 URL
  image: string;

  // AI 패치 생성 시 선택 프레임 타입
  frameType: FrameType;
}

// AI 패치 생성 및 저장 상태 타입
interface AIPatchStore {
  // 사용자가 선택한 피드 사진 id
  selectedPhotoId: number | null;

  // 사용자가 선택한 피드 사진 이미지 URL
  selectedImage?: string;

  // AI 패치 생성용 작가 id
  selectedArtistId: number | null;

  // AI 패치 생성용 프레임
  selectedFrame: FrameType | null;

  // 현재 AI 생성 패치 결과 목록
  generatedPatches: GeneratedPatch[];

  // 사용자가 저장한 AI 패치 목록
  savedPatches: SavedPatch[];

  // 피드 사진 id와 이미지 URL 선택 함수
  setSelectedPhoto: (photoId: number, image: string) => void;

  // 선택 피드 사진 초기화 함수
  clearSelectedPhoto: () => void;

  // 기존 사진 URL 선택 함수
  setSelectedImage: (image?: string) => void;

  // 작가 선택값 변경 함수
  setSelectedArtistId: (artistId: number | null) => void;

  // 프레임 선택값 변경 함수
  setSelectedFrame: (frame: FrameType | null) => void;

  // AI 생성 결과 목록 변경 함수
  setGeneratedPatches: (patches: GeneratedPatch[]) => void;

  // AI 생성 결과 목록 초기화 함수
  clearGeneratedPatches: () => void;

  // 서버 저장 패치 추가 함수
  addSavedPatch: (patch: SavedPatch) => void;

  // 저장 패치 한 개 삭제 함수
  removeSavedPatch: (patchId: string) => void;

  // 동일 AI 생성 결과 저장 여부 확인 함수
  isPatchSaved: (resultId: number, frameType: FrameType) => boolean;

  // AI 패치 생성 선택값 초기화 함수
  resetSelection: () => void;

  // 저장 패치 전체 초기화 함수
  clearSavedPatches: () => void;
}

// AI 패치 생성 및 저장 상태 Store
export const useAIPatchStore = create<AIPatchStore>((set, get) => ({
  // 최초 선택 피드 사진 id
  selectedPhotoId: null,

  // 최초 선택 피드 사진 이미지
  selectedImage: undefined,

  // 최초 작가 선택값
  selectedArtistId: null,

  // 최초 프레임 선택값
  selectedFrame: null,

  // 최초 AI 생성 패치 결과 목록
  generatedPatches: [],

  // 최초 저장 패치 목록
  savedPatches: [],

  // 피드 사진 id 및 이미지 URL 저장 처리
  setSelectedPhoto: (photoId, image) =>
    set({
      selectedPhotoId: photoId,
      selectedImage: image,
    }),

  // 선택 피드 사진 초기화 처리
  clearSelectedPhoto: () =>
    set({
      selectedPhotoId: null,
      selectedImage: undefined,
    }),

  // 기존 사진 URL 변경 처리
  setSelectedImage: (image) =>
    set({
      selectedImage: image,
    }),

  // 작가 선택값 변경 처리
  setSelectedArtistId: (artistId) =>
    set({
      selectedArtistId: artistId,
    }),

  // 프레임 선택값 변경 처리
  setSelectedFrame: (frame) =>
    set({
      selectedFrame: frame,
    }),

  // 현재 AI 생성 패치 결과 저장 처리
  setGeneratedPatches: (patches) =>
    set({
      generatedPatches: patches,
    }),

  // 현재 AI 생성 패치 결과 초기화 처리
  clearGeneratedPatches: () =>
    set({
      generatedPatches: [],
    }),

  // 서버 저장 완료 패치 추가 처리
  addSavedPatch: (patch) =>
    set((state) => ({
      savedPatches: [...state.savedPatches, patch],
    })),

  // 저장 패치 목록 영구 삭제 처리
  removeSavedPatch: (patchId) =>
    set((state) => ({
      savedPatches: state.savedPatches.filter((patch) => patch.id !== patchId),
    })),

  // 동일 AI 결과 및 프레임 조합 저장 여부 확인 처리
  isPatchSaved: (resultId, frameType) =>
    get().savedPatches.some(
      (patch) => patch.resultId === resultId && patch.frameType === frameType,
    ),

  // AI 패치 생성 선택값 및 생성 결과 초기화 처리
  resetSelection: () =>
    set({
      selectedPhotoId: null,
      selectedImage: undefined,
      selectedArtistId: null,
      selectedFrame: null,
      generatedPatches: [],
    }),

  // 저장 AI 패치 목록 전체 초기화 처리
  clearSavedPatches: () =>
    set({
      savedPatches: [],
    }),
}));
