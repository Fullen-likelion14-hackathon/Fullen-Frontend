import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";

import { useBag, useBags } from "@/hooks/queries/useBags";

import { useOrders } from "@/hooks/queries/useOrders";

// 주문 상세 가방 면 타입
type BagSide = "front" | "back";

export default function CustomOrderDetail() {
  // 현재 주문 상세 가방 면
  const [side, setSide] = useState<BagSide>("front");

  const { data: orders = [], isPending: isOrdersPending, isError: isOrdersError } = useOrders();

  const { data: bags = [], isPending: isBagsPending, isError: isBagsError } = useBags();

  const userBagId = bags[0]?.userBagId;

  const { data: bagDetail, isPending: isBagPending, isError: isBagError } = useBag(userBagId);

  // 최신 일반 커스텀 주문
  const latestCustomOrder = orders.find((order) => order.type === "REGULAR");

  const isPending = isOrdersPending || isBagsPending || isBagPending;

  const isError =
    isOrdersError || isBagsError || isBagError || userBagId === undefined || !latestCustomOrder;

  if (isPending) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 flex-col bg-[#F9F4F0]">
        <PageHeader title="나의 커스텀 주문내용 상세보기" backTo="/custom/order/complete" />

        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm font-semibold text-[#888D96]">주문 상세 정보를 불러오는 중입니다</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 flex-col bg-[#F9F4F0]">
        <PageHeader title="나의 커스텀 주문내용 상세보기" backTo="/custom" />

        <div className="flex flex-1 items-center justify-center px-8 text-center">
          <p className="text-sm font-semibold text-[#888D96]">
            주문 상세 정보를 불러올 수 없습니다
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      <PageHeader title="나의 커스텀 주문내용 상세보기" backTo="/custom/order/complete" />

      {/* 주문 가방 정보 */}
      <div className="pt-30 text-center">
        <h1 className="text-[1.5rem] font-bold text-[#242D41]">{bagDetail?.bagName}</h1>

        <p className="mt-1 text-[#888D96]">{bagDetail?.bagSize}</p>
      </div>

      {/* 앞면 / 뒷면 선택 */}
      <div className="mx-auto mt-4 flex w-fit rounded-full bg-[#D1D1D1] p-1">
        <button
          type="button"
          onClick={() => {
            setSide("front");
          }}
          className={`rounded-full px-4 py-1 text-[1rem] font-bold ${
            side === "front" ? "bg-white text-[#242D41] shadow-sm" : "text-[#888D96]"
          }`}
        >
          앞면
        </button>

        <button
          type="button"
          onClick={() => {
            setSide("back");
          }}
          className={`rounded-full px-4 py-1 text-[1rem] font-bold ${
            side === "back" ? "bg-white text-[#242D41] shadow-sm" : "text-[#888D96]"
          }`}
        >
          뒷면
        </button>
      </div>

      {/* 주문 당시 커스텀 이미지 */}
      <div className="mx-auto mt-5 flex h-68 w-82 items-center justify-center">
        <img
          src={side === "front" ? latestCustomOrder.frontImgUrl : latestCustomOrder.backImgUrl}
          alt={side === "front" ? "주문 커스텀 가방 앞면" : "주문 커스텀 가방 뒷면"}
          className="h-full w-full object-contain"
        />
      </div>
    </main>
  );
}
