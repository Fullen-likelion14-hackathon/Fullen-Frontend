import type { OrderData } from "@/components/myPage/MyPageData";

export default function OrderCard({ type, date, image }: OrderData) {
  return (
    <article className="pb-6">
      <img src={image} alt="커스텀 가방" className="mx-auto h-56 w-full object-contain" />
      <button
        type="button"
        className="mt-1 w-full rounded-full border-2 border-[#ac927c] bg-white py-3 text-[20px] font-bold text-[#192940]"
      >
        주문 내역 상세보기
      </button>
      <div className="mt-2 flex justify-around text-[17px] font-bold text-[#e5cfbb]">
        <span>{type}</span>
        <time>{date}</time>
      </div>
    </article>
  );
}
