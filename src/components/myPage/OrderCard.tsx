import { useNavigate } from "react-router-dom";

import type { Order } from "@/types/order";

export default function OrderCard({ type, orderId, createdAt, frontImgUrl }: Order) {
  const navigate = useNavigate();
  const formattedDate = createdAt.split("T")[0].replaceAll("-", ".");
  const orderTypeLabel = type === "PREMIUM" ? "1:1 커스텀" : type;
  const handleDetailClick = () => {
    navigate(`/onetooneorder/detail/${orderId}`);
  };

  return (
    <article className="pb-6">
      <img src={frontImgUrl} alt="커스텀 가방" className="mx-auto h-56 w-full object-contain" />

      <button
        type="button"
        onClick={handleDetailClick}
        className="mt-1 w-full rounded-full border-2 border-[#ac927c] bg-white py-2 text-[20px] font-bold text-[#192940]"
      >
        주문 내역 상세보기
      </button>
      <div className="mt-2 flex items-center justify-center gap-10 text-[16px] font-bold text-[#e5cfbb]">
        <span>{orderTypeLabel}</span>
        <time>{formattedDate}</time>
      </div>
    </article>
  );
}
