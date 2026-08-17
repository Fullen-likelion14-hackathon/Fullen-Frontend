import PageHeader from "@/components/common/PageHeader";

export default function MyOrderList() {
  return (
    <div className="min-h-dvh bg-[#faf5f0] font-['Pretendard_Variable'] text-[#192940]">
      <PageHeader title="나의 주문 목록" backTo="/custom" />
      <main className="mx-auto max-w-107 px-16 "></main>
    </div>
  );
}
