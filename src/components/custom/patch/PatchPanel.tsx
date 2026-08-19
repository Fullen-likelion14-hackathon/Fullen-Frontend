import { useEffect, useMemo, useState } from "react";

import InfoButton from "@/components/common/button/InfoButton";
import WarningModal from "@/components/common/modal/WarningModal";

import PatchTypeButton from "@/components/custom/patch/PatchTypeButton";
import SavedPatchSlider from "@/components/custom/patch/SavedPatchSlider";

import { CustomGenerateButton } from "@/components/custom/common/CustomGenerate";
import { ApplyButton } from "@/components/custom/common/ApplyButton";

import ticketImg from "@/assets/images/patchButtons/ticket.png";
import stampImg from "@/assets/images/patchButtons/stamp.png";
import labelImg from "@/assets/images/patchButtons/label.png";

import ticketSelectedImg from "@/assets/images/patchButtons/ticketActive.png";
import stampSelectedImg from "@/assets/images/patchButtons/stampActive.png";
import labelSelectedImg from "@/assets/images/patchButtons/labelActive.png";

import { useDeletePatch } from "@/hooks/mutations/patch/useDeletePatch";
import { useDeletePatchPosition } from "@/hooks/mutations/patch/useDeletePatchPosition";
import { useSavePatchPosition } from "@/hooks/mutations/patch/useSavePatchPosition";
import { useUpdatePatchPosition } from "@/hooks/mutations/patch/useUpdatePatchPosition";
import { usePatches } from "@/hooks/queries/patch/usePatches";

import type { SavedPatch } from "@/stores/aiPatchStore";

import { useBagCustomStore, type PlacedPatch } from "@/stores/bagCustomStore";

import type { AIPatchApiType } from "@/types/ai";

type PatchType = "ticket" | "stamp" | "label";

interface PatchPanelProps {
  // 현재 커스텀 대상 가방 id
  userBagId: number;

  // 가방 상태 적용 완료 Toast 함수
  onApplied: () => void;
}

// 패치 위치 변경 여부 비교 함수
const hasPatchPositionChanged = (draftPatch: PlacedPatch, appliedPatch: PlacedPatch) =>
  draftPatch.side !== appliedPatch.side ||
  draftPatch.posX !== appliedPatch.posX ||
  draftPatch.posY !== appliedPatch.posY ||
  draftPatch.rotation !== appliedPatch.rotation;

export default function PatchPanel({ userBagId, onApplied }: PatchPanelProps) {
  // 현재 선택 패치 종류
  const [selectedType, setSelectedType] = useState<PatchType | null>(null);

  // 현재 활성 저장 패치 index
  const [currentPatchIndex, setCurrentPatchIndex] = useState<number | null>(null);

  // 영구 삭제 대상 패치
  const [deleteTargetPatch, setDeleteTargetPatch] = useState<SavedPatch | null>(null);

  // 서버 전송 패치 타입
  const apiPatchType: AIPatchApiType | undefined =
    selectedType === "ticket"
      ? "TICKET"
      : selectedType === "stamp"
        ? "STAMP"
        : selectedType === "label"
          ? "LABEL"
          : undefined;

  // 저장 패치 목록 Query
  const {
    data: serverPatches = [],
    isPending: isPatchesPending,
    isError: isPatchesError,
  } = usePatches(apiPatchType);

  // 저장 패치 삭제 Mutation
  const { mutateAsync: deleteSavedPatch, isPending: isDeletingSavedPatch } = useDeletePatch();

  // 가방 패치 적용 Mutation
  const { mutateAsync: savePatchPosition, isPending: isSavingPosition } = useSavePatchPosition();

  // 가방 패치 위치 수정 Mutation
  const { mutateAsync: updatePatchPosition, isPending: isUpdatingPosition } =
    useUpdatePatchPosition();

  // 가방 패치 위치 삭제 Mutation
  const { mutateAsync: deletePatchPosition, isPending: isDeletingPosition } =
    useDeletePatchPosition();

  // 가방 상태 변경 여부
  const isDirty = useBagCustomStore((state) => state.isDirty);

  // 현재 편집 패치 목록
  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  // 마지막 적용 패치 목록
  const appliedPatches = useBagCustomStore((state) => state.appliedPatches);

  // 저장 패치 편집 가방 추가 함수
  const addDraftPatch = useBagCustomStore((state) => state.addDraftPatch);

  // 패치 서버 위치 id 변경 함수
  const setDraftPatchPositionId = useBagCustomStore((state) => state.setDraftPatchPositionId);

  // 편집 상태 실제 적용 함수
  const applyDraft = useBagCustomStore((state) => state.applyDraft);

  // 서버 요청 진행 여부
  const isApplying = isSavingPosition || isUpdatingPosition || isDeletingPosition;

  // 서버 저장 패치 UI 변환 목록
  const filteredPatches = useMemo<SavedPatch[]>(() => {
    if (!selectedType) {
      return [];
    }

    return serverPatches.map((patch) => ({
      id: String(patch.patchId),

      patchId: patch.patchId,

      resultId: patch.patchId,

      image: patch.imgUrl,

      frameType: selectedType,
    }));
  }, [serverPatches, selectedType]);

  // 패치 종류 변경 시 활성 패치 초기화
  useEffect(() => {
    setCurrentPatchIndex(null);
  }, [selectedType]);

  // 패치 종류 선택
  const handleTypeSelect = (type: PatchType) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  // 저장 패치 가방 추가
  const handlePatchActivate = (patch: SavedPatch) => {
    addDraftPatch({
      id: crypto.randomUUID(),

      patchPositionId: null,

      savedPatchId: String(patch.patchId),

      image: patch.image,

      position: null,

      normal: [0, 0, 1],

      side: "FRONT",

      posX: 0.5,

      posY: 0.5,

      rotation: 0,

      scale: 0.5,

      flipped: false,
    });
  };

  // 현재 편집 패치 서버 적용
  const handleApplyPatch = async () => {
    if (!isDirty || isApplying) {
      return;
    }

    try {
      // 서버 신규 적용 대상
      const newPatches = draftPatches.filter(
        (patch) => patch.patchPositionId === null && patch.position !== null,
      );

      // 서버 위치 수정 대상
      const updatedPatches = draftPatches.filter((draftPatch) => {
        if (draftPatch.patchPositionId === null) {
          return false;
        }

        const appliedPatch = appliedPatches.find(
          (patch) => patch.patchPositionId === draftPatch.patchPositionId,
        );

        if (!appliedPatch) {
          return false;
        }

        return hasPatchPositionChanged(draftPatch, appliedPatch);
      });

      // 서버 위치 삭제 대상
      const deletedPatches = appliedPatches.filter((appliedPatch) => {
        if (appliedPatch.patchPositionId === null) {
          return false;
        }

        return !draftPatches.some(
          (draftPatch) => draftPatch.patchPositionId === appliedPatch.patchPositionId,
        );
      });

      // 기존 패치 위치 삭제 요청
      await Promise.all(
        deletedPatches.map((patch) =>
          deletePatchPosition({
            patchPositionId: patch.patchPositionId!,
            userBagId,
          }),
        ),
      );

      // 기존 패치 위치 수정 요청
      await Promise.all(
        updatedPatches.map((patch) =>
          updatePatchPosition({
            patchPositionId: patch.patchPositionId!,

            userBagId,

            request: {
              side: patch.side,

              posX: patch.posX,

              posY: patch.posY,

              rotation: patch.rotation,
            },
          }),
        ),
      );

      // 신규 패치 적용 요청
      const savedPositions = await Promise.all(
        newPatches.map(async (patch) => {
          const response = await savePatchPosition({
            userBagId,

            patchId: Number(patch.savedPatchId),

            side: patch.side,

            posX: patch.posX,

            posY: patch.posY,

            rotation: patch.rotation,
          });

          return {
            localPatchId: patch.id,

            patchPositionId: response.data.patchPositionId,
          };
        }),
      );

      // 서버 패치 위치 id 저장
      savedPositions.forEach(({ localPatchId, patchPositionId }) => {
        setDraftPatchPositionId(localPatchId, patchPositionId);
      });

      // 편집 상태 적용 상태 확정
      applyDraft();

      // 적용 완료 Toast
      onApplied();
    } catch (error) {
      console.error("가방 패치 적용 실패", error);
    }
  };

  // 저장 패치 영구 삭제
  const handleDeleteSavedPatch = async () => {
    if (!deleteTargetPatch || !apiPatchType || isDeletingSavedPatch) {
      return;
    }

    try {
      await deleteSavedPatch({
        patchId: deleteTargetPatch.patchId,

        type: apiPatchType,
      });

      setCurrentPatchIndex(null);

      setDeleteTargetPatch(null);
    } catch (error) {
      console.error("저장 패치 삭제 실패", error);
    }
  };

  // 저장 패치 삭제 취소
  const handleCloseDeleteModal = () => {
    setDeleteTargetPatch(null);
  };

  return (
    <>
      {/* 패치 사용 안내 버튼 */}
      <div className="pointer-events-auto absolute inset-x-0 top-20 flex justify-start pl-11">
        <InfoButton content="패치를 선택한 후 화면 위로 끌어올려 원하는 위치에 자유롭게 배치하고 ‘가방에 적용하기’를 눌러주세요." />
      </div>

      {/* AI 패치 생성 버튼 */}
      <div className="pointer-events-auto absolute inset-x-0 top-20 flex justify-end pr-11">
        <CustomGenerateButton text="AI 패치 생성" path="/custom/ai-patch" />
      </div>

      {/* 저장 패치 조회 로딩 상태 */}
      {selectedType && isPatchesPending && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62 flex justify-center">
          <p className="text-sm font-semibold text-[#B89B84]">저장 패치를 불러오는 중입니다</p>
        </div>
      )}

      {/* 저장 패치 조회 실패 상태 */}
      {selectedType && isPatchesError && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62 flex justify-center">
          <p className="text-sm font-semibold text-[#B89B84]">저장 패치를 불러오지 못했습니다</p>
        </div>
      )}

      {/* 선택 종류 저장 패치 목록 */}
      {selectedType && !isPatchesPending && !isPatchesError && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62">
          <SavedPatchSlider
            patches={filteredPatches}
            currentIndex={currentPatchIndex}
            onIndexChange={setCurrentPatchIndex}
            onPatchActivate={handlePatchActivate}
            onDeleteRequest={setDeleteTargetPatch}
          />
        </div>
      )}

      {/* 패치 종류 선택 영역 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-55 flex items-center justify-center gap-2">
        <PatchTypeButton
          type="ticket"
          text="티켓"
          image={ticketImg}
          selectedImage={ticketSelectedImg}
          selected={selectedType === "ticket"}
          onClick={() => handleTypeSelect("ticket")}
        />

        <PatchTypeButton
          type="stamp"
          text="우표"
          image={stampImg}
          selectedImage={stampSelectedImg}
          selected={selectedType === "stamp"}
          onClick={() => handleTypeSelect("stamp")}
        />

        <PatchTypeButton
          type="label"
          text="라벨"
          image={labelImg}
          selectedImage={labelSelectedImg}
          selected={selectedType === "label"}
          onClick={() => handleTypeSelect("label")}
        />
      </div>

      {/* 가방 상태 적용 버튼 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-35 flex justify-center">
        <ApplyButton
          text={isApplying ? "적용 중" : "가방에 적용하기"}
          onApply={handleApplyPatch}
          disabled={!isDirty || isApplying}
        />
      </div>

      {/* 저장 패치 영구 삭제 WarningModal */}
      <WarningModal
        isOpen={deleteTargetPatch !== null}
        title="해당 패치를 영구 삭제하시겠습니까?"
        description="한번 영구삭제한 패치는 복원할 수 없습니다."
        primaryButtonText="보관 유지하기"
        secondaryButtonText={isDeletingSavedPatch ? "삭제 중" : "영구 삭제하기"}
        imageUrl={deleteTargetPatch?.image}
        onPrimaryClick={handleCloseDeleteModal}
        onSecondaryClick={handleDeleteSavedPatch}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
}
