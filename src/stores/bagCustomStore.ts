import { create } from "zustand";

// 3D 좌표 타입임
export type Vector3Tuple = [number, number, number];

// 이니셜 글자 굵기 타입임
export type InitialFontWeight = "normal" | "bold";

// 가방 위 패치 한 개의 상태 타입임
export interface PlacedPatch {
  // 가방 위 패치 인스턴스 고유 id임
  id: string;

  // 저장 패치 원본 id임
  savedPatchId: string;

  // 패치 이미지임
  image: string;

  // 가방 Mesh 기준 로컬 위치임
  position: Vector3Tuple | null;

  // 패치가 붙어있는 가방 표면 방향임
  normal: Vector3Tuple;

  // 패치 크기임
  scale: number;

  // 좌우 반전 여부임
  flipped: boolean;
}

// 가방 위 이니셜 한 개의 상태 타입임
export interface PlacedInitial {
  // 가방 위 이니셜 인스턴스 고유 id임
  id: string;

  // 사용자가 입력한 이니셜 문자열임
  text: string;

  // 이니셜 색상임
  color: string;

  // 이니셜 글자 굵기임
  fontWeight: InitialFontWeight;

  // 가방 Mesh 기준 로컬 위치임
  position: Vector3Tuple | null;

  // 이니셜이 붙어있는 가방 표면 방향임
  normal: Vector3Tuple;

  // 이니셜 크기임
  scale: number;
}

interface BagCustomStore {
  // 현재 편집 중인 패치 목록임
  draftPatches: PlacedPatch[];

  // 마지막 적용 완료된 패치 목록임
  appliedPatches: PlacedPatch[];

  // 현재 편집 중인 이니셜 목록임
  draftInitials: PlacedInitial[];

  // 마지막 적용 완료된 이니셜 목록임
  appliedInitials: PlacedInitial[];

  // 현재 선택된 패치 id임
  selectedPlacedPatchId: string | null;

  // 현재 선택된 이니셜 id임
  selectedPlacedInitialId: string | null;

  // 마지막 적용 상태와 다른 변경사항 존재 여부임
  isDirty: boolean;

  // 패치 위치 또는 크기 편집 중 여부임
  isEditingPatch: boolean;

  // 이니셜 위치 또는 크기 편집 중 여부임
  isEditingInitial: boolean;

  // 저장 패치를 편집 가방에 추가함
  addDraftPatch: (patch: PlacedPatch) => void;

  // 이니셜을 편집 가방에 추가함
  addDraftInitial: (initial: PlacedInitial) => void;

  // 가방 위 패치 선택함
  selectPlacedPatch: (patchId: string | null) => void;

  // 가방 위 이니셜 선택함
  selectPlacedInitial: (initialId: string | null) => void;

  // 패치 위치 변경함
  moveDraftPatch: (patchId: string, position: Vector3Tuple, normal: Vector3Tuple) => void;

  // 이니셜 위치 변경함
  moveDraftInitial: (initialId: string, position: Vector3Tuple, normal: Vector3Tuple) => void;

  // 패치 크기 변경함
  resizeDraftPatch: (patchId: string, scale: number) => void;

  // 이니셜 크기 변경함
  resizeDraftInitial: (initialId: string, scale: number) => void;

  // 패치 좌우 반전함
  flipDraftPatch: (patchId: string) => void;

  // 이니셜 색상 변경함
  changeDraftInitialColor: (initialId: string, color: string) => void;

  // 이니셜 굵기 변경함
  changeDraftInitialFontWeight: (initialId: string, fontWeight: InitialFontWeight) => void;

  // 편집 중인 가방에서 패치 제거함
  removeDraftPatch: (patchId: string) => void;

  // 편집 중인 가방에서 이니셜 제거함
  removeDraftInitial: (initialId: string) => void;

  // 현재 편집 상태 전체를 실제 적용 상태로 확정함
  applyDraft: () => void;

  // 적용 전 변경사항을 마지막 적용 상태로 복구함
  discardDraft: () => void;

  // 서버 조회값으로 패치 적용 상태 초기화함
  setAppliedPatches: (patches: PlacedPatch[]) => void;

  // 서버 조회값으로 이니셜 적용 상태 초기화함
  setAppliedInitials: (initials: PlacedInitial[]) => void;

  // 패치 편집 여부 변경함
  setIsEditingPatch: (isEditing: boolean) => void;

  // 이니셜 편집 여부 변경함
  setIsEditingInitial: (isEditing: boolean) => void;
}

// 패치 상태 깊은 복사용 함수임
const clonePatches = (patches: PlacedPatch[]): PlacedPatch[] =>
  patches.map((patch) => ({
    ...patch,
    position: patch.position ? [...patch.position] : null,
    normal: [...patch.normal],
  }));

// 이니셜 상태 깊은 복사용 함수임
const cloneInitials = (initials: PlacedInitial[]): PlacedInitial[] =>
  initials.map((initial) => ({
    ...initial,
    position: initial.position ? [...initial.position] : null,
    normal: [...initial.normal],
  }));

export const useBagCustomStore = create<BagCustomStore>((set) => ({
  // 최초 편집 패치 없음
  draftPatches: [],

  // 최초 적용 패치 없음
  appliedPatches: [],

  // 최초 편집 이니셜 없음
  draftInitials: [],

  // 최초 적용 이니셜 없음
  appliedInitials: [],

  // 최초 선택 패치 없음
  selectedPlacedPatchId: null,

  // 최초 선택 이니셜 없음
  selectedPlacedInitialId: null,

  // 최초 변경사항 없음
  isDirty: false,

  // 최초 패치 편집 상태 아님
  isEditingPatch: false,

  // 최초 이니셜 편집 상태 아님
  isEditingInitial: false,

  // 저장 패치를 편집 가방 위에 추가함
  addDraftPatch: (patch) =>
    set((state) => {
      // 같은 저장 패치가 이미 가방 위에 있는지 확인함
      const existingPatch = state.draftPatches.find(
        (item) => item.savedPatchId === patch.savedPatchId,
      );

      // 이미 존재하면 새로 추가하지 않고 해당 패치 선택함
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

  // 새로운 이니셜을 편집 가방 위에 추가함
  addDraftInitial: (initial) =>
    set((state) => ({
      draftInitials: [...state.draftInitials, initial],
      selectedPlacedInitialId: initial.id,
      selectedPlacedPatchId: null,
      isDirty: true,
    })),

  // 현재 편집할 패치 선택함
  selectPlacedPatch: (patchId) =>
    set((state) => ({
      selectedPlacedPatchId: patchId,

      // 실제 패치 선택 시 이니셜 선택 해제함
      selectedPlacedInitialId: patchId !== null ? null : state.selectedPlacedInitialId,
    })),

  // 현재 편집할 이니셜 선택함
  selectPlacedInitial: (initialId) =>
    set((state) => ({
      selectedPlacedInitialId: initialId,

      // 실제 이니셜 선택 시 패치 선택 해제함
      selectedPlacedPatchId: initialId !== null ? null : state.selectedPlacedPatchId,
    })),

  // 가방 표면을 따라 패치 위치 변경함
  moveDraftPatch: (patchId, position, normal) =>
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
      isDirty: true,
    })),

  // 가방 표면을 따라 이니셜 위치 변경함
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

  // 패치 크기 변경함
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

  // 이니셜 크기 변경함
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

  // 패치 좌우 반전함
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

  // 이니셜 색상 변경함
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

  // 이니셜 글자 굵기 변경함
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

  // 현재 편집 가방에서만 패치 제거함
  removeDraftPatch: (patchId) =>
    set((state) => ({
      draftPatches: state.draftPatches.filter((patch) => patch.id !== patchId),

      selectedPlacedPatchId:
        state.selectedPlacedPatchId === patchId ? null : state.selectedPlacedPatchId,

      isDirty: true,
    })),

  // 현재 편집 가방에서만 이니셜 제거함
  removeDraftInitial: (initialId) =>
    set((state) => ({
      draftInitials: state.draftInitials.filter((initial) => initial.id !== initialId),

      selectedPlacedInitialId:
        state.selectedPlacedInitialId === initialId ? null : state.selectedPlacedInitialId,

      isDirty: true,
    })),

  // 패치와 이니셜 현재 편집 상태 전체를 적용함
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

  // 적용하지 않은 패치와 이니셜을 마지막 적용 상태로 복구함
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

  // 서버에서 받은 패치 적용 상태 초기화함
  setAppliedPatches: (patches) =>
    set({
      appliedPatches: clonePatches(patches),
      draftPatches: clonePatches(patches),

      selectedPlacedPatchId: null,

      isDirty: false,
    }),

  // 서버에서 받은 이니셜 적용 상태 초기화함
  setAppliedInitials: (initials) =>
    set({
      appliedInitials: cloneInitials(initials),
      draftInitials: cloneInitials(initials),

      selectedPlacedInitialId: null,

      isDirty: false,
    }),

  // 패치 위치 / 크기 편집 여부 변경함
  setIsEditingPatch: (isEditing) =>
    set({
      isEditingPatch: isEditing,
    }),

  // 이니셜 위치 / 크기 편집 여부 변경함
  setIsEditingInitial: (isEditing) =>
    set({
      isEditingInitial: isEditing,
    }),
}));
