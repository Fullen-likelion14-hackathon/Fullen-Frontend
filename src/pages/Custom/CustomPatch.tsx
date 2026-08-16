import { useState } from "react";
import { ProductViewer } from "@/components/custom/viewer/ProductViewer";
import floorBg from "@/assets/images/Floor.png";
import { ApplyButton } from "@/components/custom/ApplyButton";
import { CustomModeToggle } from "@/components/custom/CustomModeToggle";
import PatchTypeButton from "@/components/custom/PatchTypeButton";
import ticketImg from "@/assets/images/patchButtons/ticket.png";
import stampImg from "@/assets/images/patchButtons/stamp.png";
import labelImg from "@/assets/images/patchButtons/label.png";

export default function CustomPatch() {
  const [mode, setMode] = useState<"initial" | "patch">("patch");
  const handleApply = () => {
    console.log("적용");
  };
  const [selectedType, setSelectedType] = useState<"ticket" | "stamp" | "label">("stamp");

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
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
      <div className="absolute inset-x-0 top-10 flex justify-center">
        <CustomModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="absolute inset-0">
        <ProductViewer />
      </div>

      <div className="flex items-center justify-center gap-3">
        <PatchTypeButton
          text="티켓"
          image={ticketImg}
          selected={selectedType === "ticket"}
          onClick={() => setSelectedType("ticket")}
        />

        <PatchTypeButton
          text="우표"
          image={stampImg}
          selected={selectedType === "stamp"}
          onClick={() => setSelectedType("stamp")}
        />

        <PatchTypeButton
          text="라벨"
          image={labelImg}
          selected={selectedType === "label"}
          onClick={() => setSelectedType("label")}
        />
      </div>

      <div className="absolute inset-x-0 bottom-25 flex justify-center">
        <ApplyButton text="적용하기" onApply={handleApply} />
      </div>
    </main>
  );
}
