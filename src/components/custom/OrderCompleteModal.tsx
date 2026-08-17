import { Check, X } from "lucide-react";

type OrderCompleteModalProps = {
  onClose: () => void;
};

export default function OrderCompleteModal({ onClose }: OrderCompleteModalProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-28 z-50 flex justify-center">
      <div className="pointer-events-auto relative w-82 rounded-[20px] border-2 border-[#CCA774] bg-[#F7EBBF] px-4 pb-3 pt-3 shadow-lg">
        {/* X */}
        <button type="button" onClick={onClose} className="absolute right-3 top-3 text-[#CCA774]">
          <X size={26} strokeWidth={2.5} />
        </button>

        {/* 체크 */}
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <Check size={30} strokeWidth={3} className="text-[#6E3C27]" />
        </div>

        {/* 문구 */}
        <p className="mt-2 text-center text-[15px] font-bold leading-[1.45] text-[#6E3C27]">
          커스텀 배송이 완료되었습니다.
          <br />
          주문하신 디자인을 가방에 <span className="font-extrabold">영구 적용</span>했습니다.
        </p>
      </div>
    </div>
  );
}
