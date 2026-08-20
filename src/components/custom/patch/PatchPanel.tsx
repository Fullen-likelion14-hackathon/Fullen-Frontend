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
  userBagId: number;

  intro?: boolean;

  onApplied: () => void;
}

// 패치 서버 상태 변경 여부
const hasPatchChanged = (draftPatch: PlacedPatch, appliedPatch: PlacedPatch) =>
  draftPatch.side !== appliedPatch.side ||
  draftPatch.posX !== appliedPatch.posX ||
  draftPatch.posY !== appliedPatch.posY ||
  draftPatch.rotation !== appliedPatch.rotation ||
  draftPatch.scale !== appliedPatch.scale ||
  draftPatch.flipped !== appliedPatch.flipped ||
  draftPatch.layer !== appliedPatch.layer;

export default function PatchPanel({ userBagId, intro = true, onApplied }: PatchPanelProps) {
  const [selectedType, setSelectedType] = useState<PatchType | null>(null);

  // 영구삭제 대상 원본 패치
  const [deleteTargetPatch, setDeleteTargetPatch] = useState<SavedPatch | null>(null);

  const apiPatchType: AIPatchApiType | undefined =
    selectedType === "ticket"
      ? "TICKET"
      : selectedType === "stamp"
        ? "STAMP"
        : selectedType === "label"
          ? "LABEL"
          : undefined;

  const {
    data: serverPatches = [],
    isPending: isPatchesPending,
    isError: isPatchesError,
  } = usePatches(apiPatchType);

  const { mutateAsync: deleteSavedPatch, isPending: isDeletingSavedPatch } = useDeletePatch();

  const { mutateAsync: savePatchPosition, isPending: isSavingPosition } = useSavePatchPosition();

  const { mutateAsync: updatePatchPosition, isPending: isUpdatingPosition } =
    useUpdatePatchPosition();

  const { mutateAsync: deletePatchPosition, isPending: isDeletingPosition } =
    useDeletePatchPosition();

  const isDirty = useBagCustomStore((state) => state.isDirty);

  const draftPatches = useBagCustomStore((state) => state.draftPatches);

  const appliedPatches = useBagCustomStore((state) => state.appliedPatches);

  const activeSavedPatchId = useBagCustomStore((state) => state.activeSavedPatchId);

  const addDraftPatch = useBagCustomStore((state) => state.addDraftPatch);

  const setActiveSavedPatchId = useBagCustomStore((state) => state.setActiveSavedPatchId);

  const removeUnappliedDraftPatchesBySavedPatchId = useBagCustomStore(
    (state) => state.removeUnappliedDraftPatchesBySavedPatchId,
  );

  const setDraftPatchPositionId = useBagCustomStore((state) => state.setDraftPatchPositionId);

  const applyDraft = useBagCustomStore((state) => state.applyDraft);

  const isApplying = isSavingPosition || isUpdatingPosition || isDeletingPosition;

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

  // 목록 active index
  const currentPatchIndex = useMemo(() => {
    if (!activeSavedPatchId) {
      return null;
    }

    const index = filteredPatches.findIndex(
      (patch) => String(patch.patchId) === activeSavedPatchId,
    );

    return index >= 0 ? index : null;
  }, [activeSavedPatchId, filteredPatches]);

  // 미적용 동일 원본 패치 존재 여부
  const hasUnappliedDeleteTarget = useMemo(() => {
    if (!deleteTargetPatch) {
      return false;
    }

    const savedPatchId = String(deleteTargetPatch.patchId);

    return draftPatches.some(
      (patch) => patch.savedPatchId === savedPatchId && patch.patchPositionId === null,
    );
  }, [deleteTargetPatch, draftPatches]);

  // 종류 변경 시 저장 패치 active 초기화
  useEffect(() => {
    setActiveSavedPatchId(null);
  }, [selectedType, setActiveSavedPatchId]);

  const handleTypeSelect = (type: PatchType) => {
    setSelectedType((previousType) => (previousType === type ? null : type));
  };

  // 저장 패치 active 변경
  const handlePatchIndexChange = (index: number | null) => {
    if (index === null) {
      setActiveSavedPatchId(null);

      return;
    }

    const patch = filteredPatches[index];

    if (!patch) {
      setActiveSavedPatchId(null);

      return;
    }

    setActiveSavedPatchId(String(patch.patchId));
  };

  // 원본 패치 신규 인스턴스 생성
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

      // 신규 배치 패치는 주문 전이므로 수정 가능
      isEditable: true,
    });
  };

  // 가방 패치 적용
  const handleApplyPatch = async () => {
    if (!isDirty || isApplying) {
      return;
    }

    try {
      const newPatches = draftPatches.filter(
        (patch) => patch.patchPositionId === null && patch.position !== null,
      );

      const updatedPatches = draftPatches.filter((draftPatch) => {
        if (draftPatch.patchPositionId === null || draftPatch.isEditable === false) {
          return false;
        }

        const appliedPatch = appliedPatches.find(
          (patch) => patch.patchPositionId === draftPatch.patchPositionId,
        );

        if (!appliedPatch || appliedPatch.isEditable === false) {
          return false;
        }

        return hasPatchChanged(draftPatch, appliedPatch);
      });

      const deletedPatches = appliedPatches.filter((appliedPatch) => {
        if (appliedPatch.patchPositionId === null || appliedPatch.isEditable === false) {
          return false;
        }

        return !draftPatches.some(
          (draftPatch) => draftPatch.patchPositionId === appliedPatch.patchPositionId,
        );
      });

      // 가방에서 제거한 적용 패치 삭제
      await Promise.all(
        deletedPatches.map((patch) =>
          deletePatchPosition({
            patchPositionId: patch.patchPositionId!,

            userBagId,
          }),
        ),
      );

      // 기존 적용 패치 수정
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

              scale: patch.scale,

              flipped: patch.flipped,

              layer: patch.layer,
            },
          }),
        ),
      );

      // 신규 패치 적용
      const savedPositions = await Promise.all(
        newPatches.map(async (patch) => {
          const response = await savePatchPosition({
            userBagId,

            patchId: Number(patch.savedPatchId),

            side: patch.side,

            posX: patch.posX,

            posY: patch.posY,

            rotation: patch.rotation,

            scale: patch.scale,

            flipped: patch.flipped,

            layer: patch.layer,
          });

          return {
            localPatchId: patch.id,

            patchPositionId: response.data.patchPositionId,
          };
        }),
      );

      savedPositions.forEach(({ localPatchId, patchPositionId }) => {
        setDraftPatchPositionId(localPatchId, patchPositionId);
      });

      applyDraft();

      setActiveSavedPatchId(null);

      onApplied();
    } catch (error) {
      console.error("가방 패치 적용 실패", error);
    }
  };

  // 저장 패치 영구삭제
  const handleDeleteSavedPatch = async () => {
    if (!deleteTargetPatch || !apiPatchType || isDeletingSavedPatch) {
      return;
    }

    const savedPatchId = String(deleteTargetPatch.patchId);

    try {
      await deleteSavedPatch({
        patchId: deleteTargetPatch.patchId,

        type: apiPatchType,
      });

      // 현재 정책에서는 미적용 draft만 함께 제거
      removeUnappliedDraftPatchesBySavedPatchId(savedPatchId);

      setActiveSavedPatchId(null);

      setDeleteTargetPatch(null);
    } catch (error) {
      console.error("저장 패치 삭제 실패", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteTargetPatch(null);
  };

  return (
    <>
      {/* 패치 안내 */}
      <div className="pointer-events-auto absolute inset-x-0 top-20 flex justify-start pl-11">
        <InfoButton content="패치를 선택한 후 화면 위로 끌어올려 원하는 위치에 자유롭게 배치하고 ‘가방에 적용하기’를 눌러주세요." />
      </div>

      {/* AI 패치 생성 */}
      <div className="pointer-events-auto absolute inset-x-0 top-20 flex justify-end pr-11">
        <CustomGenerateButton text="AI 패치 생성" path="/custom/ai-patch" />
      </div>

      {/* 저장 패치 로딩 */}
      {selectedType && isPatchesPending && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62 flex justify-center">
          <p className="text-sm font-semibold text-[#B89B84]">저장 패치를 불러오는 중입니다</p>
        </div>
      )}

      {/* 저장 패치 오류 */}
      {selectedType && isPatchesError && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62 flex justify-center">
          <p className="text-sm font-semibold text-[#B89B84]">저장 패치를 불러오지 못했습니다</p>
        </div>
      )}

      {/* 저장 패치 목록 */}
      {selectedType && !isPatchesPending && !isPatchesError && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62">
          <SavedPatchSlider
            patches={filteredPatches}
            currentIndex={currentPatchIndex}
            onIndexChange={handlePatchIndexChange}
            onPatchActivate={handlePatchActivate}
            onDeleteRequest={setDeleteTargetPatch}
          />
        </div>
      )}

      {/* 패치 종류 */}
      <div
        className={`pointer-events-auto absolute inset-x-0 bottom-55 flex items-center justify-center gap-2 transition-all delay-150 duration-700 ease-out ${
          intro ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
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

      {/* 가방 적용 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-35 flex justify-center">
        <ApplyButton
          text={isApplying ? "적용 중" : "가방에 적용하기"}
          onApply={handleApplyPatch}
          disabled={!isDirty || isApplying}
        />
      </div>

      {/* 저장 패치 영구삭제 */}
      <WarningModal
        isOpen={deleteTargetPatch !== null}
        title="해당 패치를 영구 삭제하시겠습니까?"
        description={
          hasUnappliedDeleteTarget
            ? "아직 가방에 적용하지 않은 패치입니다. 영구삭제하면 현재 가방 위에 배치한 패치도 함께 삭제됩니다."
            : "한번 영구삭제한 패치는 복원할 수 없습니다."
        }
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
