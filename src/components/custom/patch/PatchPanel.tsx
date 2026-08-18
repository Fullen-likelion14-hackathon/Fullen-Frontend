import { useEffect, useMemo, useState } from "react";

import PatchTypeButton from "@/components/custom/patch/PatchTypeButton";
import SavedPatchSlider from "@/components/custom/patch/SavedPatchSlider";

import { CustomGenerateButton } from "@/components/custom/common/CustomGenerate";
import InfoButton from "@/components/common/button/InfoButton";
import { ApplyButton } from "@/components/custom/common/ApplyButton";

import ticketImg from "@/assets/images/patchButtons/ticket.png";
import stampImg from "@/assets/images/patchButtons/stamp.png";
import labelImg from "@/assets/images/patchButtons/label.png";

import ticketSelectedImg from "@/assets/images/patchButtons/ticketActive.png";
import stampSelectedImg from "@/assets/images/patchButtons/stampActive.png";
import labelSelectedImg from "@/assets/images/patchButtons/labelActive.png";

import { useAIPatchStore } from "@/stores/aiPatchStore";

type PatchType = "ticket" | "stamp" | "label";

export default function PatchPanel() {
  // 현재 선택한 패치 종류임
  const [selectedType, setSelectedType] = useState<PatchType | null>(null);

  // 현재 저장 패치 슬라이더에서 선택된 index임
  const [currentPatchIndex, setCurrentPatchIndex] = useState(0);

  // Zustand에 저장된 AI 패치 목록임
  const savedPatches = useAIPatchStore((state) => state.savedPatches);

  // 선택한 타입에 해당하는 저장 패치만 필터링함
  const filteredPatches = useMemo(() => {
    if (!selectedType) {
      return [];
    }

    return savedPatches.filter((patch) => patch.frameType === selectedType);
  }, [savedPatches, selectedType]);

  // 현재 중앙에 선택된 저장 패치임
  const selectedPatch = filteredPatches[currentPatchIndex] ?? null;

  // 패치 카테고리가 바뀌면 첫 번째 패치부터 보여줌
  useEffect(() => {
    setCurrentPatchIndex(0);
  }, [selectedType]);

  // 패치 타입 선택 처리함
  const handleTypeSelect = (type: PatchType) => {
    setSelectedType((prev) => (prev === type ? null : type));
  };

  // 선택한 패치를 가방에 올리는 처리 예정임
  const handleApplyPatch = () => {
    if (!selectedPatch) return;

    // TODO:
    // bagCustomStore 구현 후
    // 선택한 패치를 실제 가방 편집 상태에 추가할 예정임
    console.log("가방에 적용할 패치", selectedPatch);
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

      {/* 선택한 카테고리의 저장 패치 목록임 */}
      {selectedType && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-62">
          <SavedPatchSlider
            patches={filteredPatches}
            currentIndex={currentPatchIndex}
            onIndexChange={setCurrentPatchIndex}
          />
        </div>
      )}

      {/* 패치 종류 선택 버튼 영역임 */}
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

      {/* 가방 적용 버튼임 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-25 flex justify-center">
        <ApplyButton text="가방에 적용하기" onApply={handleApplyPatch} disabled={!selectedPatch} />
      </div>
    </>
  );
}
