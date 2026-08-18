import { create } from "zustand";

import type { FrameType } from "@/components/custom/common/selection/FrameSelectBox";

// AI 패치 결과 페이지에서 저장한 패치 타입임
export interface SavedPatch {
  // 저장된 패치를 구분하기 위한 고유 id임
  id: string;

  // AI 생성 결과의 원래 id임
  resultId: number;

  // 저장된 패치 이미지임
  image: string;

  // AI 패치 생성 시 선택했던 프레임 타입임
  frameType: FrameType;
}

interface AIPatchStore {
  // AI 패치 생성에 사용할 사진임
  selectedImage?: string;

  // AI 패치 생성에 사용할 작가 id임
  selectedArtistId: number | null;

  // AI 패치 생성에 사용할 프레임임
  selectedFrame: FrameType | null;

  // 사용자가 저장한 AI 패치 목록임
  savedPatches: SavedPatch[];

  // 사진 선택값 변경함
  setSelectedImage: (image?: string) => void;

  // 작가 선택값 변경함
  setSelectedArtistId: (artistId: number | null) => void;

  // 프레임 선택값 변경함
  setSelectedFrame: (frame: FrameType | null) => void;

  // AI 생성 결과에서 선택한 패치를 저장함
  addSavedPatch: (patch: SavedPatch) => void;

  // 특정 AI 생성 결과가 이미 저장되어 있는지 확인함
  isPatchSaved: (resultId: number, frameType: FrameType) => boolean;

  // AI 패치 생성 과정의 선택값만 초기화함
  resetSelection: () => void;

  // 저장된 패치를 전부 초기화함
  clearSavedPatches: () => void;
}

export const useAIPatchStore = create<AIPatchStore>((set, get) => ({
  selectedImage: undefined,
  selectedArtistId: null,
  selectedFrame: null,

  savedPatches: [],

  setSelectedImage: (image) =>
    set({
      selectedImage: image,
    }),

  setSelectedArtistId: (artistId) =>
    set({
      selectedArtistId: artistId,
    }),

  setSelectedFrame: (frame) =>
    set({
      selectedFrame: frame,
    }),

  addSavedPatch: (patch) =>
    set((state) => ({
      savedPatches: [...state.savedPatches, patch],
    })),

  isPatchSaved: (resultId, frameType) =>
    get().savedPatches.some(
      (patch) => patch.resultId === resultId && patch.frameType === frameType,
    ),

  resetSelection: () =>
    set({
      selectedImage: undefined,
      selectedArtistId: null,
      selectedFrame: null,
    }),

  clearSavedPatches: () =>
    set({
      savedPatches: [],
    }),
}));
