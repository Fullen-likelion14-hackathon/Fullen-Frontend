import OrderCard from "@/components/myPage/OrderCard";
import PageHeader from "@/components/common/PageHeader";

import { useOrders } from "@/hooks/queries/useOrders";

export default function MyOrderList() {
  const { data: orders = [], isPending, isError } = useOrders();

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>주문 목록을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="min-h-dvh max-w-97 mx-auto bg-[#faf5f0] font-['Pretendard_Variable'] text-[#192940]">
      <PageHeader title="나의 주문 목록" backTo="/mypage" />

      <main className="mx-auto max-w-107 ">
        {orders.map((order) => (
          <OrderCard key={order.orderId} {...order} />
        ))}
      </main>
    </div>
  );
}
