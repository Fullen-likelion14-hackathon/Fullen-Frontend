import {
  BadgeCheck,
  Check,
  ChevronRight,
  Hand,
  PackageCheck,
  ReceiptText,
  Stamp,
  Truck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

export default function MyOrderList() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderType = location.state?.orderType;

  const orderSteps = [
    { icon: <ReceiptText size={28} strokeWidth={2.5} />, active: true },
    { icon: <Hand size={28} strokeWidth={2.5} />, active: false },
    { icon: <Stamp size={28} strokeWidth={2.5} />, active: false },
    { icon: <Stamp size={27} strokeWidth={2.5} />, active: false },
    { icon: <Truck size={28} strokeWidth={2.5} />, active: false },
    { icon: <PackageCheck size={28} strokeWidth={2.5} />, active: false },
  ];

  return (
    <div className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      <PageHeader title="나의 커스텀 주문" backTo="/custom/order" />

      <div className="flex flex-col items-center">
        {/* 주문 완료 체크 */}
        <div className="mt-28 flex h-17 w-17 items-center justify-center rounded-full border-2 border-[#AC917C] bg-white">
          <Check size={42} strokeWidth={4} className="text-[#AD6929]" />
        </div>

        {/* 주문 완료 문구 */}
        <h1 className="mt-4 text-center text-[28px] font-extrabold leading-[1.35] text-[#192940]">
          나의 {orderType === "onetoone" ? "1:1 커스텀" : "커스텀"}
          <br />
          주문이 완료되었습니다.
        </h1>

        {/* 주문내용 상세보기 */}
        <button
          type="button"
          onClick={() => navigate("/custom/order/detail")}
          className="mt-6 flex h-10 w-51 items-center justify-center gap-1 rounded-full border-3 border-[#D1D1D1] bg-white font-bold  text-[#969BA3]"
        >
          주문내용 상세보기
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>

        {/* 상태 설명 */}
        <p className="mt-14 text-[18px]  text-[#B59A85]">가방을 MCM 측에 전달해주세요</p>
        <div className="relative mt-5 flex w-83 items-center justify-between">
          <div className="absolute left-5 right-5 top-1/2 h-1 -translate-y-1/2 bg-[#D6D6D6]" />

          {orderSteps.map((step, index) => (
            <div
              key={index}
              className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-white ${
                step.active ? "bg-[#192940]" : "bg-[#D6D6D8]"
              }`}
            >
              {step.icon}

              {index === 0 && (
                <BadgeCheck
                  size={14}
                  fill="white"
                  className="absolute bottom-1 right-1 text-[#192940]"
                />
              )}

              {index === 3 && (
                <Check size={13} strokeWidth={3} className="absolute bottom-1 right-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 메인 화면 버튼 */}
      <button
        type="button"
        onClick={() => {
          if (orderType === "onetoone") {
            navigate("/onetooneorder", {
              state: {
                showOrderCompleteModal: true,
                orderType: "onetoone",
              },
            });
          } else {
            navigate("/custom", {
              state: {
                showOrderCompleteModal: true,
                orderType: "custom",
              },
            });
          }
        }}
        className="absolute bottom-25 left-1/2 h-14 w-83 -translate-x-1/2 rounded-xl border-2 border-[#A9672A] bg-[#F9F4F0] text-[18px] font-bold text-[#A9672A] shadow-lg"
      >
        메인 화면으로 이동하기
      </button>
    </div>
  );
}
