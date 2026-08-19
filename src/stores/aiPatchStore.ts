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

// AI 패치 생성 및 저장 상태 타입임
interface AIPatchStore {
  // AI 패치 생성에 사용할 사진임
  selectedImage?: string;

  // AI 패치 생성에 사용할 작가 id임
  selectedArtistId: number | null;

  // AI 패치 생성에 사용할 프레임임
  selectedFrame: FrameType | null;

  // 사용자가 저장한 AI 패치 목록임
  savedPatches: SavedPatch[];

  // 사진 선택값 변경 함수임
  setSelectedImage: (image?: string) => void;

  // 작가 선택값 변경 함수임
  setSelectedArtistId: (artistId: number | null) => void;

  // 프레임 선택값 변경 함수임
  setSelectedFrame: (frame: FrameType | null) => void;

  // AI 생성 결과에서 선택한 패치 저장 함수임
  addSavedPatch: (patch: SavedPatch) => void;

  // 저장된 패치 한 개 삭제 함수임
  removeSavedPatch: (patchId: string) => void;

  // 특정 AI 생성 결과가 이미 저장되어 있는지 확인하는 함수임
  isPatchSaved: (resultId: number, frameType: FrameType) => boolean;

  // AI 패치 생성 과정의 선택값 초기화 함수임
  resetSelection: () => void;

  // 저장된 패치 전체 초기화 함수임
  clearSavedPatches: () => void;
}

// AI 패치 생성 및 저장 상태 store임
export const useAIPatchStore = create<AIPatchStore>((set, get) => ({
  // 초기 사진 선택값임
  selectedImage: undefined,

  // 초기 작가 선택값임
  selectedArtistId: null,

  // 초기 프레임 선택값임
  selectedFrame: null,

  // 초기 저장 패치 목록임
  savedPatches: [],

  // 사진 선택값 변경함
  setSelectedImage: (image) =>
    set({
      selectedImage: image,
    }),

  // 작가 선택값 변경함
  setSelectedArtistId: (artistId) =>
    set({
      selectedArtistId: artistId,
    }),

  // 프레임 선택값 변경함
  setSelectedFrame: (frame) =>
    set({
      selectedFrame: frame,
    }),

  // 새로운 저장 패치 추가함
  addSavedPatch: (patch) =>
    set((state) => ({
      savedPatches: [...state.savedPatches, patch],
    })),

  // 저장된 패치 목록에서 해당 패치 완전히 삭제함
  removeSavedPatch: (patchId) =>
    set((state) => ({
      savedPatches: state.savedPatches.filter((patch) => patch.id !== patchId),
    })),

  // 같은 AI 결과와 같은 프레임 조합의 저장 여부 확인함
  isPatchSaved: (resultId, frameType) =>
    get().savedPatches.some(
      (patch) => patch.resultId === resultId && patch.frameType === frameType,
    ),

  // AI 패치 생성 과정의 선택값만 초기화함
  resetSelection: () =>
    set({
      selectedImage: undefined,
      selectedArtistId: null,
      selectedFrame: null,
    }),

  // 저장된 AI 패치 목록 전체 초기화함
  clearSavedPatches: () =>
    set({
      savedPatches: [],
    }),
}));
