import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import bag from "@/assets/images/testBag.png";
import bagback from "@/assets/images/testBag.png";
import { ApplyButton } from "@/components/custom/ApplyButton";

export default function MyOrderList() {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      <PageHeader title="나의 커스텀 주문" backTo="/custom" />

      <div className="pt-10 text-center">
        <h1 className="text-2xl font-bold">Ottomar 비세토스 위켄더</h1>
        <p className="text-[#888D96]">50.5 cm (19.9in)</p>
      </div>

      {/* 앞면 / 뒷면 선택 */}
      <div className="mx-auto mt-4 flex w-fit rounded-full bg-[#D1D1D1] p-1">
        <button
          type="button"
          onClick={() => setSide("front")}
          className={`rounded-full px-4 py-1 text-m font-bold ${
            side === "front" ? "bg-white font-bold text-[#242D41] shadow-sm" : "text-[#888D96]"
          }`}
        >
          앞면
        </button>

        <button
          type="button"
          onClick={() => setSide("back")}
          className={`rounded-full px-4 py-1 text-m font-bold ${
            side === "back" ? "bg-white font-bold text-[#242D41] shadow-sm" : "text-[#888D96]"
          }`}
        >
          뒷면
        </button>
      </div>

      {/* 가방 이미지 */}
      <img
        src={side === "front" ? bag : bagback}
        alt={
          side === "front"
            ? "Ottomar 비세토스 위켄더 가방 앞면"
            : "Ottomar 비세토스 위켄더 가방 뒷면"
        }
        className="mx-auto mt-8 w-72"
      />

      <div className="mx-auto mt-8 h-23 w-82 rounded-2xl border-2 border-[#AC917C] bg-white">
        <p className="pt-1 text-center font-bold text-[#AC917C]">주문 커스텀 항목</p>

        <div className="ml-5 mt-2 flex gap-2 overflow-hidden">
          <div className="h-10 w-10 bg-blue-500">패치</div>
          <div className="h-10 w-10 bg-blue-500"></div>
          <div className="h-10 w-10 bg-blue-500"></div>
          <div className="h-10 w-10 bg-blue-500"></div>
          <div className="h-10 w-10 bg-blue-500"></div>
          <div className="h-10 w-10 bg-blue-500"></div>
        </div>
      </div>

      <p className="pt-13 text-center font-bold text-[#888D96]">커스텀을 주문하시겠습니까?</p>

      <div className="pointer-events-auto absolute inset-x-0 bottom-25 flex justify-center">
        <ApplyButton text="주문하기" onApply={() => {}} disabled={false} />
      </div>

      <div className="pointer-events-auto absolute inset-x-0 bottom-17 flex justify-center gap-2 font-bold text-[#B6B7BA]">
        <p>다시 꾸미겠습니까?</p>
        <button>수정하러 가기</button>
      </div>
    </div>
  );
}
