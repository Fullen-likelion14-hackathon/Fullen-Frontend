import { useState } from "react";
import { ProductViewer } from "@/components/custom/viewer/ProductViewer";
import { CustomModeToggle } from "@/components/custom/common/CustomModeToggle";
import PatchPanel from "@/components/custom/patch/PatchPanel";
import InitialPanel from "@/components/custom/initials/InitialsPanel";

import floorBg from "@/assets/images/Floor.png";

export default function Customizing() {
  // 현재 이니셜/패치 모드 저장함
  const [mode, setMode] = useState<"initial" | "patch">("patch");

  return (
    <main
      className="
        relative
        mx-auto
        h-dvh
        w-full
        max-w-97.5
        overflow-hidden
        bg-[#F9F4F0]
      "
    >
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

      {/* UI 전체 레이어임 */}
      {/* 가방보다 위에 UI 보여주기 위해 z-20 사용함 */}
      <div className="pointer-events-none relative z-20 h-full">
        {/* 이니셜 / 패치 모드 변경 토글임 */}
        <div
          className="
            pointer-events-auto
            absolute
            inset-x-0
            top-10
            flex
            justify-center
          "
        >
          <CustomModeToggle mode={mode} onChange={setMode} />
        </div>

        {/* 패치 모드일 때 패치 UI 보여줌 */}
        {mode === "patch" && <PatchPanel />}

        {/* 이니셜 모드일 때 이니셜 UI 보여줌 */}
        {mode === "initial" && <InitialPanel />}
      </div>
    </main>
  );
}
