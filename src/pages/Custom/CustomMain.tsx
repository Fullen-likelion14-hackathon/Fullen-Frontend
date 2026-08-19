import { useLocation } from "react-router-dom";
import { useState } from "react";

import { CustomizeButton, OrderButton, DPPButton } from "@/components/custom/CustomActionButton";

import { ProductViewer } from "@/components/custom/viewer/ProductViewer";

import OrderCompleteModal from "@/components/custom/OrderCompleteModal";

import floorBg from "@/assets/images/Floor.png";

export default function CustomMain() {
  const location = useLocation();

  // 주문 완료 모달 상태임
  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] = useState(
    location.state?.showOrderCompleteModal ?? false,
  );

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      {/* 고정 배경 이미지임 */}
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

      {/* 마지막으로 적용 완료된 가방 상태만 보여주는 3D 영역임 */}
      <div className="absolute inset-0">
        <ProductViewer mode="applied" />
      </div>

      {/* 화면 UI 영역임 */}
      <div className="pointer-events-none relative z-10 h-full">
        {/* DPP 버튼 영역임 */}
        <div className="pointer-events-auto flex justify-center pt-30">
          <DPPButton />
        </div>

        {/* 가방 정보 영역임 */}
        <div className="mt-7 text-center">
          <h1 className="text-[20px] font-bold text-[#333]">Ottomar 비세토스 위켄더</h1>

          {/* TODO: NFC 기반 실제 가방 정보 연동 예정임 */}
          <p className="mt-1 text-[14px] text-[#777]">50.5 cm (19.9 in)</p>
        </div>

        {/* 하단 액션 버튼 영역임 */}
        <div className="pointer-events-auto absolute bottom-45 left-0 right-0 flex flex-col items-center gap-4">
          <CustomizeButton />

          <OrderButton />
        </div>
      </div>

      {/* 주문 완료 모달임 */}
      {isOrderCompleteModalOpen && (
        <OrderCompleteModal orderType="custom" onClose={() => setIsOrderCompleteModalOpen(false)} />
      )}
    </main>
  );
}
