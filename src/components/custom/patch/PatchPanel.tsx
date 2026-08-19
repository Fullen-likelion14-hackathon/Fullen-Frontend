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

import { useAIPatchStore, type SavedPatch } from "@/stores/aiPatchStore";

import { useBagCustomStore } from "@/stores/bagCustomStore";

type PatchType = "ticket" | "stamp" | "label";

interface PatchPanelProps {
  // 가방 상태 적용 완료 Toast 함수임
  onApplied: () => void;
}

export default function PatchPanel({ onApplied }: PatchPanelProps) {
  // 현재 선택된 패치 종류임
  const [selectedType, setSelectedType] = useState<PatchType | null>(null);

  // 현재 활성화된 저장 패치 index임
  // 종류만 선택한 상태에서는 null임
  const [currentPatchIndex, setCurrentPatchIndex] = useState<number | null>(null);

  // 영구 삭제 대상 패치임
  const [deleteTargetPatch, setDeleteTargetPatch] = useState<SavedPatch | null>(null);

  // 저장된 AI 패치 목록임
  const savedPatches = useAIPatchStore((state) => state.savedPatches);

  // 저장 패치 영구 삭제 함수임
  const removeSavedPatch = useAIPatchStore((state) => state.removeSavedPatch);

  // 가방 상태 변경 여부임
  const isDirty = useBagCustomStore((state) => state.isDirty);

  // 저장 패치를 편집 가방에 추가함
  const addDraftPatch = useBagCustomStore((state) => state.addDraftPatch);

  // 현재 편집 상태를 실제 적용함
  const applyDraft = useBagCustomStore((state) => state.applyDraft);

  // 선택 종류에 해당하는 저장 패치만 필터링함
  const filteredPatches = useMemo(() => {
    if (!selectedType) {
      return [];
    }

    return savedPatches.filter((patch) => patch.frameType === selectedType);
  }, [savedPatches, selectedType]);

  // 패치 종류 변경 시 활성 패치 선택 해제함
  useEffect(() => {
    setCurrentPatchIndex(null);
  }, [selectedType]);

  // 패치 종류 선택 처리함
  const handleTypeSelect = (type: PatchType) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  // 저장 패치 원클릭 시 가방 위에 즉시 표시함
  const handlePatchActivate = (patch: SavedPatch) => {
    addDraftPatch({
      // 가방 위 패치 인스턴스 id임
      id: crypto.randomUUID(),

      // 저장 패치 원본 id임
      savedPatchId: patch.id,

      // 실제 패치 이미지임
      image: patch.image,

      // Product에서 최초 위치 계산 예정임
      position: null,

      // 최초 정면 방향임
      normal: [0, 0, 1],

      // 최초 패치 크기임
      scale: 0.5,

      // 최초 좌우 반전 상태임
      flipped: false,
    });
  };

  // 현재 편집 상태를 실제 가방 상태로 적용함
  const handleApplyPatch = () => {
    if (!isDirty) return;

    applyDraft();

    // 적용 완료 Toast 표시함
    onApplied();
  };

  // 저장 패치 영구 삭제함
  const handleDeleteSavedPatch = () => {
    if (!deleteTargetPatch) {
      return;
    }

    // 저장 목록에서 패치 완전 삭제함
    removeSavedPatch(deleteTargetPatch.id);

    // 삭제 후 활성 패치 선택 해제함
    setCurrentPatchIndex(null);

    // 삭제 완료 후 모달 닫음
    setDeleteTargetPatch(null);
  };

  // 저장 패치 삭제 취소함
  const handleCloseDeleteModal = () => {
    // 패치 데이터는 그대로 유지함
    // 삭제 대상 상태만 초기화함
    setDeleteTargetPatch(null);
  };

  return (
    <>
      {/* 패치 사용 안내 버튼임 */}
      <div className="pointer-events-auto absolute inset-x-0 top-30 flex justify-start pl-11">
        <InfoButton content="패치를 선택한 후 화면 위로 끌어올려 원하는 위치에 자유롭게 배치하고 ‘가방에 적용하기’를 눌러주세요." />
      </div>

      {/* AI 패치 생성 버튼임 */}
      <div className="pointer-events-auto absolute inset-x-0 top-30 flex justify-end pr-11">
        <CustomGenerateButton text="AI 패치 생성" path="/custom/ai-patch" />
      </div>

      {/* 선택 종류의 저장 패치 목록임 */}
      {selectedType && (
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

      {/* 패치 종류 선택 영역임 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-45 flex items-center justify-center gap-2">
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

      {/* 가방 상태 적용 버튼임 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-25 flex justify-center">
        <ApplyButton
          text="가방에 적용하기"
          onApply={handleApplyPatch}

          // 마지막 적용 상태와 달라졌을 때만 활성화함
          disabled={!isDirty}
        />
      </div>

      {/* 저장 패치 영구 삭제 WarningModal임 */}
      <WarningModal
        isOpen={deleteTargetPatch !== null}
        title="해당 패치를 영구 삭제하시겠습니까?"
        description="한번 영구삭제한 패치는 복원할 수 없습니다."
        primaryButtonText="보관 유지하기"
        secondaryButtonText="영구 삭제하기"
        imageUrl={deleteTargetPatch?.image}

        // 보관 유지하기 클릭 시 데이터 유지 후 닫음
        onPrimaryClick={handleCloseDeleteModal}

        // 영구 삭제하기 클릭 시 저장 목록에서 삭제함
        onSecondaryClick={handleDeleteSavedPatch}

        // 모달 바깥 영역 클릭 시 삭제 취소 후 닫음
        onClose={handleCloseDeleteModal}
      />
    </>
  );
}
