import { orders } from "@/components/myPage/MyPageData";
import OrderCard from "@/components/myPage/OrderCard";

import PageHeader from "@/components/common/PageHeader";

export default function MyOrderList() {
  return (
    <div className="min-h-dvh bg-[#faf5f0] font-['Pretendard_Variable'] text-[#192940]">
      <PageHeader title="나의 주문 목록" backTo="/mypage" />
      <main className="mx-auto max-w-107 px-16 ">
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </main>
    </div>
  );
}
