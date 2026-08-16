import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { orders } from "@/components/myPage/MyPageData";
import OrderCard from "@/components/myPage/OrderCard";

export default function MyOrderList() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-[#faf5f0] font-['Pretendard_Variable'] text-[#192940]">
      <header className="sticky top-0 z-10 flex h-32 items-end border-b-[7px] border-[#aa6829] bg-[#192940] px-7 pb-6 text-white">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <ChevronLeft className="size-10" strokeWidth={2} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[26px] font-bold">
          나의 주문 목록
        </h1>
      </header>
      <main className="mx-auto max-w-107 px-16 py-7">
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </main>
    </div>
  );
}
