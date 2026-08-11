import { CustomizeButton, OrderButton, DPPButton } from "@/components/custom/CustomActionButton";

import { PatchButton, InitialButton } from "@/components/custom/CustomTypeButton";

import { ProductViewer } from "@/components/custom/viewer/ProductViewer";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import floorBg from "@/assets/images/Floor.png";

export default function Custom() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);

  const handleCustomize = () => {
    // 커스터마이징 모드 시작
    // → DPP / 상품 정보 숨김
    // → 기존 버튼 즉시 숨김
    // → 가방 회전 + 위로 이동 시작
    setIsCustomizing(true);

    // 가방이 도는 동안 약간의 시간을 둔 뒤
    // 패치 / 이니셜 버튼 표시
    setTimeout(() => {
      setShowCustomType(true);
    }, 500);
  };
  const handleBack = () => {
    setIsCustomizing(false);
    setShowCustomType(false);
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      {/*배경색 피그마 고정 배경 - F9F4F0, mx-auto:좌우 마진 중앙 위치, 삐져나온건 숨기기, 화면 높이 꽉채우고, 가로는 최대 390px*/}
      {/*Todo - 코드 리팩토리시 반응형으로 구현 예정*/}

      {/* 2D 고정 배경 */}
      {/*피그마 고정 로고 이미지, pointer-events-none: 상품 드래그시 이미지가 드래그 되지 않게 막아놈, main기준으로 이미지 생성*/}
      {/*Todo - 아직 로고 이미지가 흐릿하게 보이고 피그마와 맞지 않아 추후에 고칠 예정*/}
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

      {/* 가방 3D */}
      {/* productviewer-three.js화면을 꽉채워서 먼저 배치*/}
      {/* todo- nfc랑 연동되서 해당 가방의 3d를 가져와야함- 백 연동*/}
      <div className="absolute inset-0">
        <ProductViewer isCustomizing={isCustomizing} />
      </div>

      {/* UI */}
      <div className="pointer-events-none relative z-10 h-full">
        {/* 커스터마이징 화면 뒤로가기 */}
        {isCustomizing && (
          <button
            type="button"
            onClick={handleBack}
            className="
            pointer-events-auto
            absolute
            left-6
            top-8
            flex
            h-10
            w-10
            items-center
            justify-center
            "
          >
            <ChevronLeft className="size-6 text-[#757575]" />
          </button>
        )}
        {/* 커스터마이징 중이 아닐 때만 DPP 버튼 표시 */}
        {!isCustomizing && (
          <div className="pointer-events-auto flex justify-center pt-30">
            {/* dpp 버튼 */}
            <DPPButton />
          </div>
        )}

        {/* 커스터마이징 중이 아닐 때만 상품 정보 표시 */}
        {!isCustomizing && (
          <div className="mt-7 text-center">
            <h1 className="text-[20px] font-bold text-[#333]">Ottomar 비세토스 위켄더</h1>

            {/* todo- nfc랑 연동되서 해당 시리얼 넘버의 이름을 가져와야함 - 백 연동 */}
            <p className="mt-1 text-[14px] text-[#777]">50.5 cm (19.9 in)</p>
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div
          className={`
            pointer-events-auto
            absolute
            left-0
            right-0
            flex
            justify-center
            gap-4
            ${isCustomizing ? "bottom-80" : "bottom-55"}
          `}
        >
          {/* 기본 버튼 - 커스터마이징 클릭 즉시 사라짐 */}
          {!isCustomizing && (
            <>
              <CustomizeButton onClick={handleCustomize} />
              <OrderButton />
            </>
          )}

          {/* 500ms 후 패치 / 이니셜 버튼 등장 */}
          {showCustomType && (
            <div className="flex gap-4 animate-[customFadeUp_0.3s_ease-out_forwards]">
              <PatchButton />
              <InitialButton />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
