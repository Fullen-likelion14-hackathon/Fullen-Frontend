import { ChevronRight, Factory, Globe2, Leaf, RefreshCw } from "lucide-react";
import { ddpProduct } from "@/components/myPage/MyPageData";
import PageHeader from "@/components/common/PageHeader";
import { useBags } from "@/hooks/queries/useBags";

const infoItems = [
  { label: "소재 정보", icon: Factory, color: "bg-[#f8e7e9]" },
  { label: "생산 정보", icon: Leaf, color: "bg-[#fff4cd]" },
  { label: "제조 과정", icon: RefreshCw, color: "bg-[#def1f4]" },
  { label: "지속가능성", icon: Globe2, color: "bg-[#dfefdf]" },
];

export default function DigitalProductPassport() {
  const { data: bags = [], isPending, isError } = useBags();

  const bag = bags[0];

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (isError || !bag) {
    return <div>가방 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="min-h-dvh max-w-97 mx-auto bg-[#faf5f0] pb-16 font-['Pretendard_Variable'] text-[#192940]">
      <PageHeader title="제품 디지털 여권 (DDP)" backTo="/mypage" />

      <main className="mx-auto max-w-107 px-6 pt-8">
        <section className="text-center">
          <h2 className="text-[25px] font-bold">{bag.bagName}</h2>

          <p className="text-[17px] font-bold text-[#91949c]">{ddpProduct.size}</p>

          <img
            src={bag.bagFrontImgUrl}
            alt={bag.bagName}
            className="mx-auto h-52 w-full object-contain"
          />
        </section>

        <section className="flex items-center rounded-xl border-2 border-[#aa6829] bg-white px-4 py-3 mt-4">
          <div className="mr-3 flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#faf5f0] text-[17px] font-serif font-bold">
            MCM
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-bold">정품 인증 완료</h3>
            <p className="text-[11px] font-semibold text-[#ac927c]">
              이 제품은 MCM에서 정식 인증한 제품입니다.
            </p>
          </div>

          <ChevronRight className="size-6 text-[#ac927c]" />
        </section>

        <dl className="mt-6 text-[18px]">
          <div className="flex justify-between border-b border-[#c9c9c9] py-3">
            <dt className="font-bold">시리얼 번호</dt>
            <dd>{ddpProduct.serialNumber}</dd>
          </div>

          <div className="flex justify-between border-b border-[#c9c9c9] py-3">
            <dt className="font-bold">등록일</dt>
            <dd>{ddpProduct.registeredAt}</dd>
          </div>
        </dl>

        <div className="mt-8 grid grid-cols-4 gap-2">
          {infoItems.map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              type="button"
              className="rounded-xl border-2 border-[#9299a2] bg-white px-1 py-4"
            >
              <span
                className={`mx-auto mb-2 flex size-14 items-center justify-center rounded-lg ${color}`}
              >
                <Icon className="size-9 text-black" strokeWidth={1.7} />
              </span>

              <span className="whitespace-nowrap text-[13px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
