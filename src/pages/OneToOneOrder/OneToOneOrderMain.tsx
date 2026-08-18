import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@base-ui/react/button";

import floorBg from "@/assets/images/Floor.png";
import { ProductViewer } from "@/components/custom/viewer/ProductViewer";
import OrderCompleteModal from "@/components/custom/OrderCompleteModal";

export default function OneToOneOrderMain() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] = useState(
    location.state?.showOrderCompleteModal ?? false,
  );

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      {/* 배경 */}
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

      {/* 문구 */}
      <div className="relative z-10 pt-30 text-center">
        <p className="text-[20px] font-extrabold text-[#A3642B]">오직 나를 위한 단 하나의 커스텀</p>

        <p className="mt-0.5 text-[16px] font-bold text-[#242D41]">성주재단이 후원하는 작가가</p>

        <p className="text-[20px] font-extrabold text-[#242D41]">
          당신의 이야기를 직접 그려드립니다.
        </p>
      </div>

      {/* 제품 */}
      <div className="absolute inset-0">
        <ProductViewer />
      </div>

      {/* 주문 버튼 */}
      <Button
        onClick={() => navigate("/onetooneorder/request")}
        className="absolute inset-x-6 bottom-50 rounded-xl bg-[#242D41] py-4 text-[20px] font-bold text-white"
      >
        1:1 커스텀 주문하기
      </Button>

      {/* 주문 완료 모달 */}
      {isOrderCompleteModalOpen && (
        <OrderCompleteModal
          orderType="onetoone"
          onClose={() => setIsOrderCompleteModalOpen(false)}
        />
      )}
    </main>
  );
}
