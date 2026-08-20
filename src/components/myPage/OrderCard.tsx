import { CalendarDays, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Order } from "@/types/order";

export default function OrderCard({ type, orderId, createdAt, frontImgUrl }: Order) {
  const navigate = useNavigate();

  const formattedDate = createdAt.split("T")[0].replaceAll("-", ".");

  // 주문 종류 표시
  const orderTypeLabel =
    type === "PREMIUM" ? "1:1 커스텀" : type === "REGULAR" ? "나만의 가방 꾸미기" : type;

  // 주문 상세 화면 이동
  const handleDetailClick = () => {
    // 일반 커스텀 주문 상세 이동
    if (type === "REGULAR") {
      navigate("/custom/order/detail", {
        state: {
          orderId,
        },
      });

      return;
    }

    // 1:1 커스텀 주문 상세 이동
    if (type === "PREMIUM") {
      navigate(`/onetooneorder/detail/${orderId}`);
    }
  };

  return (
    <article className="mx-auto my-4 w-90 rounded-2xl border border-[#dfd2c5] bg-[#fffdf9] p-4 shadow-[0_0.25rem_0.875rem_rgba(25,41,64,0.06)]">
      <div className="flex items-center gap-4">
        {/* 가방 이미지 */}
        <div className="flex h-32 w-[43%] shrink-0 items-center justify-center rounded-xl bg-[#f5efe9]">
          <img src={frontImgUrl} alt="커스텀 가방" className="h-full w-full object-contain p-2" />
        </div>

        {/* 주문 정보 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 주문 타입 */}
          <span className="w-fit rounded-lg bg-[#eadbc9] px-3 py-1 text-[max(12px,0.875rem)] font-bold text-[#70482d]">
            {orderTypeLabel}
          </span>

          <div className="my-3 h-px w-full bg-[#e8ddd2]" />

          {/* 주문 날짜 */}
          <div className="flex items-center gap-2 text-[#192940]">
            <CalendarDays size={18} strokeWidth={1.8} className="text-[#8a5a34]" />

            <time className="text-[0.9375rem] font-semibold">{formattedDate}</time>
          </div>

          {/* 상세보기 */}
          <button
            type="button"
            onClick={handleDetailClick}
            className="
              mt-3
              flex
              w-full
              cursor-pointer
              items-center
              justify-between
              rounded-xl
              border
              border-[#8a5a34]
              bg-white
              px-4
              py-2
              text-[0.9375rem]
              font-bold
              text-[#55321f]
              transition-colors
              hover:bg-[#f7f0e9]
            "
          >
            <span>주문 내역 상세보기</span>

            <ChevronRight size={19} strokeWidth={2} className="text-[#8a5a34]" />
          </button>
        </div>
      </div>
    </article>
  );
}
