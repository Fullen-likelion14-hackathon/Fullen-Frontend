import { useState } from "react";
import PatchTypeButton from "@/components/custom/patch/PatchTypeButton";
import { CustomGenerateButton } from "@/components/custom/common/CustomGenerate";
import InfoButton from "@/components/common/button/InfoButton";
import { ApplyButton } from "@/components/custom/common/ApplyButton";

import ticketImg from "@/assets/images/patchButtons/ticket.png";
import stampImg from "@/assets/images/patchButtons/stamp.png";
import labelImg from "@/assets/images/patchButtons/label.png";
import ticketSelectedImg from "@/assets/images/patchButtons/ticketActive.png";
import stampSelectedImg from "@/assets/images/patchButtons/stampActive.png";
import labelSelectedImg from "@/assets/images/patchButtons/labelActive.png";

export default function PatchPanel() {
  // 현재 선택된 패치 종류 저장함
  const [selectedType, setSelectedType] = useState<"ticket" | "stamp" | "label" | null>(null);

  return (
    <>
      {/* 안내 버튼도 클릭 가능해야 함 */}
      <div className="pointer-events-auto absolute inset-x-0 top-30 flex justify-start pl-11">
        <InfoButton content="패치를 선택한 후 화면 위로 끌어올려 원하는 위치에 자유롭게 배치하고 ‘가방에 적용하기’를 눌러주세요." />
      </div>

      {/* AI 생성 버튼도 클릭 가능해야 함 */}
      <div className="pointer-events-auto absolute inset-x-0 top-30 flex justify-end pr-11">
        <CustomGenerateButton text="AI 패치 생성" path="/custom/ai-patch" />
      </div>

      {/* 패치 선택 버튼들도 클릭 가능해야 함 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-45 flex items-center justify-center gap-2">
        <PatchTypeButton
          type="ticket"
          text="티켓"
          image={ticketImg}
          selectedImage={ticketSelectedImg}
          selected={selectedType === "ticket"}
          onClick={() => setSelectedType(selectedType === "ticket" ? null : "ticket")}
        />

        <PatchTypeButton
          type="stamp"
          text="우표"
          image={stampImg}
          selectedImage={stampSelectedImg}
          selected={selectedType === "stamp"}
          onClick={() => setSelectedType(selectedType === "stamp" ? null : "stamp")}
        />

        <PatchTypeButton
          type="label"
          text="라벨"
          image={labelImg}
          selectedImage={labelSelectedImg}
          selected={selectedType === "label"}
          onClick={() => setSelectedType(selectedType === "label" ? null : "label")}
        />
      </div>
      {/* 적용하기 버튼임 */}
      {/* 아직 패치 적용 기능 연결 전이라 비활성화 해둠 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-25 flex justify-center">
        <ApplyButton text="가방에 적용하기" onApply={() => {}} disabled={true} />
      </div>
    </>
  );
}
