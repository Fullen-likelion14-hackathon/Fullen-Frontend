import { create } from "zustand";

import type { PatchSide } from "@/types/patch";

// 3D 좌표 타입
export type Vector3Tuple = [number, number, number];

// 이니셜 글자 굵기 타입
export type InitialFontWeight = "normal" | "bold";

// 가방 위 패치 상태 타입
export interface PlacedPatch {
  id: string;

  patchPositionId: number | null;

  savedPatchId: string;

  image: string;

  position: Vector3Tuple | null;

  normal: Vector3Tuple;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  flipped: boolean;

  layer: number;
}

// 가방 위 이니셜 상태 타입
export interface PlacedInitial {
  id: string;

  initialId: number | null;

  text: string;

  color: string;

  fontWeight: InitialFontWeight;

  position: Vector3Tuple | null;

  normal: Vector3Tuple;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  layer: number;
}

interface BagCustomStore {
  draftPatches: PlacedPatch[];

  appliedPatches: PlacedPatch[];

  draftInitials: PlacedInitial[];

  appliedInitials: PlacedInitial[];

  selectedPlacedPatchId: string | null;

  selectedPlacedInitialId: string | null;

  // 패치 목록 활성 상태
  activeSavedPatchId: string | null;

  isDirty: boolean;

  isEditingPatch: boolean;

  isEditingInitial: boolean;

  addDraftPatch: (patch: Omit<PlacedPatch, "layer">) => void;

  addDraftInitial: (initial: Omit<PlacedInitial, "layer">) => void;

  selectPlacedPatch: (patchId: string | null) => void;

  selectPlacedInitial: (initialId: string | null) => void;

  setActiveSavedPatchId: (patchId: string | null) => void;

  moveDraftPatch: (
    patchId: string,
    position: Vector3Tuple,
    normal: Vector3Tuple,
    side: PatchSide,
    posX: number,
    posY: number,
  ) => void;

  moveDraftInitial: (
    initialId: string,
    position: Vector3Tuple,
    normal: Vector3Tuple,
    side: PatchSide,
    posX: number,
    posY: number,
  ) => void;

  setDraftPatchPositionId: (patchId: string, patchPositionId: number) => void;

  setDraftInitialServerId: (initialId: string, serverInitialId: number) => void;

  restorePatchGeometry: (patchId: string, position: Vector3Tuple, normal: Vector3Tuple) => void;

  restoreInitialGeometry: (initialId: string, position: Vector3Tuple, normal: Vector3Tuple) => void;

  resizeDraftPatch: (patchId: string, scale: number) => void;

  resizeDraftInitial: (initialId: string, scale: number) => void;

  flipDraftPatch: (patchId: string) => void;

  changeDraftInitialColor: (initialId: string, color: string) => void;

  changeDraftInitialFontWeight: (initialId: string, fontWeight: InitialFontWeight) => void;

  removeDraftPatch: (patchId: string) => void;

  removeDraftInitial: (initialId: string) => void;

  // 특정 원본의 미적용 패치 일괄 제거
  removeUnappliedDraftPatchesBySavedPatchId: (savedPatchId: string) => void;

  applyDraft: () => void;

  discardDraft: () => void;

  setAppliedPatches: (patches: PlacedPatch[]) => void;

  setAppliedInitials: (initials: PlacedInitial[]) => void;

  setIsEditingPatch: (isEditing: boolean) => void;

  setIsEditingInitial: (isEditing: boolean) => void;
}

// 패치 상태 깊은 복사
const clonePatches = (patches: PlacedPatch[]): PlacedPatch[] =>
  patches.map((patch) => ({
    ...patch,

    position: patch.position ? ([...patch.position] as Vector3Tuple) : null,

    normal: [...patch.normal] as Vector3Tuple,
  }));

// 이니셜 상태 깊은 복사
const cloneInitials = (initials: PlacedInitial[]): PlacedInitial[] =>
  initials.map((initial) => ({
    ...initial,

    position: initial.position ? ([...initial.position] as Vector3Tuple) : null,

    normal: [...initial.normal] as Vector3Tuple,
  }));

// 다음 커스텀 표시 순서
const getNextLayer = (patches: PlacedPatch[], initials: PlacedInitial[]) =>
  Math.max(0, ...patches.map((patch) => patch.layer), ...initials.map((initial) => initial.layer)) +
  1;

export const useBagCustomStore = create<BagCustomStore>((set) => ({
  draftPatches: [],

  appliedPatches: [],

  draftInitials: [],

  appliedInitials: [],

  selectedPlacedPatchId: null,

  selectedPlacedInitialId: null,

  activeSavedPatchId: null,

  isDirty: false,

  isEditingPatch: false,

  isEditingInitial: false,

  // 저장 패치 신규 인스턴스 생성
  addDraftPatch: (patch) =>
    set((state) => {
      const layer = getNextLayer(state.draftPatches, state.draftInitials);

      return {
        draftPatches: [
          ...state.draftPatches,
          {
            ...patch,
            layer,
          },
        ],

        selectedPlacedPatchId: patch.id,

        selectedPlacedInitialId: null,

        isDirty: true,
      };
    }),

  // 신규 이니셜 생성
  addDraftInitial: (initial) =>
    set((state) => {
      const layer = getNextLayer(state.draftPatches, state.draftInitials);

      return {
        draftInitials: [
          ...state.draftInitials,
          {
            ...initial,
            layer,
          },
        ],

        selectedPlacedInitialId: initial.id,

        selectedPlacedPatchId: null,

        isDirty: true,
      };
    }),

  selectPlacedPatch: (patchId) =>
    set((state) => ({
      selectedPlacedPatchId: patchId,

      selectedPlacedInitialId: patchId !== null ? null : state.selectedPlacedInitialId,
    })),

  selectPlacedInitial: (initialId) =>
    set((state) => ({
      selectedPlacedInitialId: initialId,

      selectedPlacedPatchId: initialId !== null ? null : state.selectedPlacedPatchId,
    })),

  setActiveSavedPatchId: (patchId) =>
    set({
      activeSavedPatchId: patchId,
    }),

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

  moveDraftInitial: (initialId, position, normal, side, posX, posY) =>
    set((state) => ({
      draftInitials: state.draftInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,

              position,

              normal,

              side,

              posX,

              posY,
            }
          : initial,
      ),

      isDirty: true,
    })),

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

  setDraftInitialServerId: (initialId, serverInitialId) =>
    set((state) => ({
      draftInitials: state.draftInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,

              initialId: serverInitialId,
            }
          : initial,
      ),
    })),

  // 서버 UV 기반 패치 3D 위치 복원
  restorePatchGeometry: (patchId, position, normal) =>
    set((state) => ({
      draftPatches: state.draftPatches.map((patch) =>
        patch.id === patchId
          ? {
              ...patch,

              position,

              normal,
            }
          : patch,
      ),

      appliedPatches: state.appliedPatches.map((patch) =>
        patch.id === patchId
          ? {
              ...patch,

              position,

              normal,
            }
          : patch,
      ),
    })),

  // 서버 UV 기반 이니셜 3D 위치 복원
  restoreInitialGeometry: (initialId, position, normal) =>
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

      appliedInitials: state.appliedInitials.map((initial) =>
        initial.id === initialId
          ? {
              ...initial,

              position,

              normal,
            }
          : initial,
      ),
    })),

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

  // 가방 위 패치 제거 및 목록 활성 해제
  removeDraftPatch: (patchId) =>
    set((state) => {
      const targetPatch = state.draftPatches.find((patch) => patch.id === patchId);

      return {
        draftPatches: state.draftPatches.filter((patch) => patch.id !== patchId),

        selectedPlacedPatchId:
          state.selectedPlacedPatchId === patchId ? null : state.selectedPlacedPatchId,

        activeSavedPatchId:
          targetPatch && state.activeSavedPatchId === targetPatch.savedPatchId
            ? null
            : state.activeSavedPatchId,

        isEditingPatch: false,

        isDirty: true,
      };
    }),

  removeDraftInitial: (initialId) =>
    set((state) => ({
      draftInitials: state.draftInitials.filter((initial) => initial.id !== initialId),

      selectedPlacedInitialId:
        state.selectedPlacedInitialId === initialId ? null : state.selectedPlacedInitialId,

      isEditingInitial: false,

      isDirty: true,
    })),

  // 원본 영구삭제 시 미적용 인스턴스 제거
  removeUnappliedDraftPatchesBySavedPatchId: (savedPatchId) =>
    set((state) => {
      const removedIds = new Set(
        state.draftPatches
          .filter((patch) => patch.savedPatchId === savedPatchId && patch.patchPositionId === null)
          .map((patch) => patch.id),
      );

      return {
        draftPatches: state.draftPatches.filter(
          (patch) => !(patch.savedPatchId === savedPatchId && patch.patchPositionId === null),
        ),

        selectedPlacedPatchId:
          state.selectedPlacedPatchId && removedIds.has(state.selectedPlacedPatchId)
            ? null
            : state.selectedPlacedPatchId,

        activeSavedPatchId:
          state.activeSavedPatchId === savedPatchId ? null : state.activeSavedPatchId,

        isEditingPatch: false,

        isDirty: removedIds.size > 0 ? true : state.isDirty,
      };
    }),

  applyDraft: () =>
    set((state) => ({
      appliedPatches: clonePatches(state.draftPatches),

      appliedInitials: cloneInitials(state.draftInitials),

      selectedPlacedPatchId: null,

      selectedPlacedInitialId: null,

      activeSavedPatchId: null,

      isEditingPatch: false,

      isEditingInitial: false,

      isDirty: false,
    })),

  discardDraft: () =>
    set((state) => ({
      draftPatches: clonePatches(state.appliedPatches),

      draftInitials: cloneInitials(state.appliedInitials),

      selectedPlacedPatchId: null,

      selectedPlacedInitialId: null,

      activeSavedPatchId: null,

      isEditingPatch: false,

      isEditingInitial: false,

      isDirty: false,
    })),

  setAppliedPatches: (patches) =>
    set({
      appliedPatches: clonePatches(patches),

      draftPatches: clonePatches(patches),

      selectedPlacedPatchId: null,

      activeSavedPatchId: null,

      isDirty: false,
    }),

  setAppliedInitials: (initials) =>
    set({
      appliedInitials: cloneInitials(initials),

      draftInitials: cloneInitials(initials),

      selectedPlacedInitialId: null,

      isDirty: false,
    }),

  setIsEditingPatch: (isEditing) =>
    set({
      isEditingPatch: isEditing,
    }),

  setIsEditingInitial: (isEditing) =>
    set({
      isEditingInitial: isEditing,
    }),
}));
