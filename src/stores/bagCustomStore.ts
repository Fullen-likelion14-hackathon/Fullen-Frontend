import { create } from "zustand";

import type { PatchSide } from "@/types/patch";

// 3D 좌표 타입
export type Vector3Tuple = [number, number, number];

// 이니셜 글자 굵기 타입
export type InitialFontWeight = "normal" | "bold";

// 가방 위 패치 상태 타입
export interface PlacedPatch {
  // 가방 위 패치 인스턴스 고유 id
  id: string;

  // 서버 발급 패치 위치 id
  patchPositionId: number | null;

  // 서버 저장 패치 원본 id
  savedPatchId: string;

  // 패치 이미지
  image: string;

  // 가방 Mesh 기준 로컬 위치
  position: Vector3Tuple | null;

  // 패치 가방 표면 방향
  normal: Vector3Tuple;

  // 패치 적용 면
  side: PatchSide;

  // 서버 패치 X 좌표
  posX: number;

  // 서버 패치 Y 좌표
  posY: number;

  // 서버 패치 회전 각도
  rotation: number;

  // 패치 크기
  scale: number;

  // 좌우 반전 여부
  flipped: boolean;
}

// 가방 위 이니셜 상태 타입
export interface PlacedInitial {
  // 가방 위 이니셜 인스턴스 고유 id
  id: string;

  // 사용자 입력 이니셜 문자열
  text: string;

  // 이니셜 색상
  color: string;

  // 이니셜 글자 굵기
  fontWeight: InitialFontWeight;

  // 가방 Mesh 기준 로컬 위치
  position: Vector3Tuple | null;

  // 이니셜 가방 표면 방향
  normal: Vector3Tuple;

  // 이니셜 크기
  scale: number;
}

interface BagCustomStore {
  // 현재 편집 패치 목록
  draftPatches: PlacedPatch[];

  // 마지막 적용 패치 목록
  appliedPatches: PlacedPatch[];

  // 현재 편집 이니셜 목록
  draftInitials: PlacedInitial[];

  // 마지막 적용 이니셜 목록
  appliedInitials: PlacedInitial[];

  // 현재 선택 패치 id
  selectedPlacedPatchId: string | null;

  // 현재 선택 이니셜 id
  selectedPlacedInitialId: string | null;

  // 마지막 적용 상태 변경 여부
  isDirty: boolean;

  // 패치 편집 상태
  isEditingPatch: boolean;

  // 이니셜 편집 상태
  isEditingInitial: boolean;

  // 저장 패치 편집 가방 추가 함수
  addDraftPatch: (patch: PlacedPatch) => void;

  // 이니셜 편집 가방 추가 함수
  addDraftInitial: (initial: PlacedInitial) => void;

  // 패치 선택 함수
  selectPlacedPatch: (patchId: string | null) => void;

  // 이니셜 선택 함수
  selectPlacedInitial: (initialId: string | null) => void;

  // 패치 위치 변경 함수
  moveDraftPatch: (
    patchId: string,
    position: Vector3Tuple,
    normal: Vector3Tuple,
    side: PatchSide,
    posX: number,
    posY: number,
  ) => void;

  // 이니셜 위치 변경 함수
  moveDraftInitial: (initialId: string, position: Vector3Tuple, normal: Vector3Tuple) => void;

  // 패치 서버 위치 id 변경 함수
  setDraftPatchPositionId: (patchId: string, patchPositionId: number) => void;

  // 패치 크기 변경 함수
  resizeDraftPatch: (patchId: string, scale: number) => void;

  // 이니셜 크기 변경 함수
  resizeDraftInitial: (initialId: string, scale: number) => void;

  // 패치 좌우 반전 함수
  flipDraftPatch: (patchId: string) => void;

  // 이니셜 색상 변경 함수
  changeDraftInitialColor: (initialId: string, color: string) => void;

  // 이니셜 굵기 변경 함수
  changeDraftInitialFontWeight: (initialId: string, fontWeight: InitialFontWeight) => void;

  // 편집 패치 제거 함수
  removeDraftPatch: (patchId: string) => void;

  // 편집 이니셜 제거 함수
  removeDraftInitial: (initialId: string) => void;

  // 현재 편집 상태 적용 함수
  applyDraft: () => void;

  // 현재 편집 상태 복구 함수
  discardDraft: () => void;

  // 서버 패치 적용 상태 초기화 함수
  setAppliedPatches: (patches: PlacedPatch[]) => void;

  // 서버 이니셜 적용 상태 초기화 함수
  setAppliedInitials: (initials: PlacedInitial[]) => void;

  // 패치 편집 상태 변경 함수
  setIsEditingPatch: (isEditing: boolean) => void;

  // 이니셜 편집 상태 변경 함수
  setIsEditingInitial: (isEditing: boolean) => void;
}

// 패치 상태 깊은 복사 함수
const clonePatches = (patches: PlacedPatch[]): PlacedPatch[] =>
  patches.map((patch) => ({
    ...patch,

    position: patch.position ? [...patch.position] : null,

    normal: [...patch.normal],
  }));

// 이니셜 상태 깊은 복사 함수
const cloneInitials = (initials: PlacedInitial[]): PlacedInitial[] =>
  initials.map((initial) => ({
    ...initial,

    position: initial.position ? [...initial.position] : null,

    normal: [...initial.normal],
  }));

export const useBagCustomStore = create<BagCustomStore>((set) => ({
  // 최초 편집 패치 목록
  draftPatches: [],

  // 최초 적용 패치 목록
  appliedPatches: [],

  // 최초 편집 이니셜 목록
  draftInitials: [],

  // 최초 적용 이니셜 목록
  appliedInitials: [],

  // 최초 선택 패치
  selectedPlacedPatchId: null,

  // 최초 선택 이니셜
  selectedPlacedInitialId: null,

  // 최초 변경 상태
  isDirty: false,

  // 최초 패치 편집 상태
  isEditingPatch: false,

  // 최초 이니셜 편집 상태
  isEditingInitial: false,

  // 저장 패치 편집 가방 추가 처리
  addDraftPatch: (patch) =>
    set((state) => {
      const existingPatch = state.draftPatches.find(
        (item) => item.savedPatchId === patch.savedPatchId,
      );

      if (existingPatch) {
        return {
          selectedPlacedPatchId: existingPatch.id,

          selectedPlacedInitialId: null,
        };
      }

      return {
        draftPatches: [...state.draftPatches, patch],

        selectedPlacedPatchId: patch.id,

        selectedPlacedInitialId: null,

        isDirty: true,
      };
    }),

  // 새로운 이니셜 편집 가방 추가 처리
  addDraftInitial: (initial) =>
    set((state) => ({
      draftInitials: [...state.draftInitials, initial],

      selectedPlacedInitialId: initial.id,

      selectedPlacedPatchId: null,

      isDirty: true,
    })),

  // 현재 패치 선택 처리
  selectPlacedPatch: (patchId) =>
    set((state) => ({
      selectedPlacedPatchId: patchId,

      selectedPlacedInitialId: patchId !== null ? null : state.selectedPlacedInitialId,
    })),

  // 현재 이니셜 선택 처리
  selectPlacedInitial: (initialId) =>
    set((state) => ({
      selectedPlacedInitialId: initialId,

      selectedPlacedPatchId: initialId !== null ? null : state.selectedPlacedPatchId,
    })),

  // 가방 표면 패치 위치 변경 처리
  moveDraftPatch: (patchId, position, normal, side, posX, posY) =>
    set((state) => ({
      draftPatches: state.draftPatches.map((patch) =>
        patch.id === patchId
          ? {
              ...patch,

              position,

              normal,

              side,

              posX,

              posY,
            }
          : patch,
      ),

      isDirty: true,
    })),

  // 가방 표면 이니셜 위치 변경 처리
  moveDraftInitial: (initialId, position, normal) =>
    set((state) => ({
      draftInitials: state.draftInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,

              position,

              normal,
            }
          : initial,
      ),

      isDirty: true,
    })),

  // 서버 패치 위치 id 변경 처리
  setDraftPatchPositionId: (patchId, patchPositionId) =>
    set((state) => ({
      draftPatches: state.draftPatches.map((patch) =>
        patch.id === patchId
          ? {
              ...patch,
              patchPositionId,
            }
          : patch,
      ),
    })),

  // 패치 크기 변경 처리
  resizeDraftPatch: (patchId, scale) =>
    set((state) => ({
      draftPatches: state.draftPatches.map((patch) =>
        patch.id === patchId
          ? {
              ...patch,
              scale,
            }
          : patch,
      ),

      isDirty: true,
    })),

  // 이니셜 크기 변경 처리
  resizeDraftInitial: (initialId, scale) =>
    set((state) => ({
      draftInitials: state.draftInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,
              scale,
            }
          : initial,
      ),

      isDirty: true,
    })),

  // 패치 좌우 반전 처리
  flipDraftPatch: (patchId) =>
    set((state) => ({
      draftPatches: state.draftPatches.map((patch) =>
        patch.id === patchId
          ? {
              ...patch,

              flipped: !patch.flipped,
            }
          : patch,
      ),

      isDirty: true,
    })),

  // 이니셜 색상 변경 처리
  changeDraftInitialColor: (initialId, color) =>
    set((state) => ({
      draftInitials: state.draftInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,
              color,
            }
          : initial,
      ),

      isDirty: true,
    })),

  // 이니셜 굵기 변경 처리
  changeDraftInitialFontWeight: (initialId, fontWeight) =>
    set((state) => ({
      draftInitials: state.draftInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,
              fontWeight,
            }
          : initial,
      ),

      isDirty: true,
    })),

  // 편집 가방 패치 제거 처리
  removeDraftPatch: (patchId) =>
    set((state) => ({
      draftPatches: state.draftPatches.filter((patch) => patch.id !== patchId),

      selectedPlacedPatchId:
        state.selectedPlacedPatchId === patchId ? null : state.selectedPlacedPatchId,

      isDirty: true,
    })),

  // 편집 가방 이니셜 제거 처리
  removeDraftInitial: (initialId) =>
    set((state) => ({
      draftInitials: state.draftInitials.filter((initial) => initial.id !== initialId),

      selectedPlacedInitialId:
        state.selectedPlacedInitialId === initialId ? null : state.selectedPlacedInitialId,

      isDirty: true,
    })),

  // 현재 편집 상태 적용 처리
  applyDraft: () =>
    set((state) => ({
      appliedPatches: clonePatches(state.draftPatches),

      appliedInitials: cloneInitials(state.draftInitials),

      selectedPlacedPatchId: null,

      selectedPlacedInitialId: null,

      isEditingPatch: false,

      isEditingInitial: false,

      isDirty: false,
    })),

  // 미적용 변경 상태 복구 처리
  discardDraft: () =>
    set((state) => ({
      draftPatches: clonePatches(state.appliedPatches),

      draftInitials: cloneInitials(state.appliedInitials),

      selectedPlacedPatchId: null,

      selectedPlacedInitialId: null,

      isEditingPatch: false,

      isEditingInitial: false,

      isDirty: false,
    })),

  // 서버 패치 적용 상태 초기화 처리
  setAppliedPatches: (patches) =>
    set({
      appliedPatches: clonePatches(patches),

      draftPatches: clonePatches(patches),

      selectedPlacedPatchId: null,

      isDirty: false,
    }),

  // 서버 이니셜 적용 상태 초기화 처리
  setAppliedInitials: (initials) =>
    set({
      appliedInitials: cloneInitials(initials),

      draftInitials: cloneInitials(initials),

      selectedPlacedInitialId: null,

      isDirty: false,
    }),

  // 패치 편집 상태 변경 처리
  setIsEditingPatch: (isEditing) =>
    set({
      isEditingPatch: isEditing,
    }),

  // 이니셜 편집 상태 변경 처리
  setIsEditingInitial: (isEditing) =>
    set({
      isEditingInitial: isEditing,
    }),
}));
