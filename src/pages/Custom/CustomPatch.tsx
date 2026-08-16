import { useState } from "react";
import { ProductViewer } from "@/components/custom/viewer/ProductViewer";
import floorBg from "@/assets/images/Floor.png";
import { ApplyButton } from "@/components/custom/ApplyButton";
import { CustomModeToggle } from "@/components/custom/CustomModeToggle";
import PatchTypeButton from "@/components/custom/PatchTypeButton";
import { AIGenerateButton } from "@/components/custom/CustomAIGenerate";
import InfoButton from "@/components/common/button/InfoButton";

import ticketImg from "@/assets/images/patchButtons/ticket.png";
import stampImg from "@/assets/images/patchButtons/stamp.png";
import labelImg from "@/assets/images/patchButtons/label.png";
import ticketSelectedImg from "@/assets/images/patchButtons/ticketActive.png";
import stampSelectedImg from "@/assets/images/patchButtons/stampActive.png";
import labelSelectedImg from "@/assets/images/patchButtons/labelActive.png";

export default function CustomPatch() {
  const [mode, setMode] = useState<"initial" | "patch">("patch");

  const [selectedType, setSelectedType] = useState<"ticket" | "stamp" | "label" | null>(null);

  const handleApply = () => {
    console.log("적용");
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      {/* 배경 이미지임 */}
      {/* 클릭이나 드래그 이벤트 받으면 안 되므로 pointer-events-none 사용함 */}
      <img
        src={floorBg}
        alt=""
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-auto
          w-155
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          opacity-60
        "
      />

      {/* 3D 가방임 */}
      {/* 드래그해야 하므로 pointer-events-none 넣으면 안 됨 */}
      <div className="absolute inset-0 z-0">
        <ProductViewer />
      </div>

      {/* UI 전체 레이어 */}
      {/* z-20으로 가방보다 위에 보이게 함 */}
      {/* 빈 공간은 가방 드래그 가능하도록 이벤트 무시함 */}
      <div className="pointer-events-none relative z-20 h-full">
        {/* 토글은 클릭해야 하므로 이벤트 다시 활성화함 */}
        <div className="pointer-events-auto absolute inset-x-0 top-10 flex justify-center">
          <CustomModeToggle mode={mode} onChange={setMode} />
        </div>

        {/* 안내 버튼도 클릭 가능해야 함 */}
        <div className="pointer-events-auto absolute inset-x-0 top-30 flex justify-start pl-11">
          <InfoButton
            content="패치를 선택한 후 화면 위로 끌어올려 원하는 위치에 
            자유롭게 배치하고 ‘가방에 적용하기’를 눌러주세요."
          />
        </div>

        {/* AI 생성 버튼도 클릭 가능해야 함 */}
        <div className="pointer-events-auto absolute inset-x-0 top-30 flex justify-end pr-11">
          <AIGenerateButton text="AI 패치 생성" path="/custom/initial" />
        </div>

        {/* 패치 선택 버튼들도 클릭 가능해야 함 */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-45 flex items-center justify-center gap-2">
          <PatchTypeButton
            type="ticket" // 버튼 종류 지정함
            text="티켓" // 버튼에 표시할 글자임
            image={ticketImg} // 기본 이미지임
            selectedImage={ticketSelectedImg} // 선택/호버 시 보여줄 이미지임
            selected={selectedType === "ticket"} // 현재 티켓이 선택됐는지 확인함
            onClick={() => setSelectedType(selectedType === "ticket" ? null : "ticket")} // 클릭 시 선택하고, 이미 선택됐으면 해제함
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

        {/* 적용하기 버튼도 클릭 가능해야 함 */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-25 flex justify-center">
          <ApplyButton text="적용하기" onApply={handleApply} />
        </div>
      </div>
    </main>
  );
}
