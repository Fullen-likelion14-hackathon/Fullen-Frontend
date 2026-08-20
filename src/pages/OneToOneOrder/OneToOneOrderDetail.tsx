import { useParams } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import OrderDetailContent from "@/components/oneToOneOrder/OrderDetailContent";

import { usePremiumOrderDetail } from "@/hooks/queries/usePremiumOrderDetail";

export default function OneToOneOrderDetail() {
  const { premiumId } = useParams();

  const {
    data: orderDetail,
    isPending,
    isError,
  } = usePremiumOrderDetail(premiumId ? Number(premiumId) : undefined);

  // 주문 상세 정보 로딩
  if (isPending) {
    return <div>주문 정보를 불러오는 중입니다.</div>;
  }

  // 주문 상세 정보 조회 실패
  if (isError || !orderDetail) {
    return <div>주문 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0] text-[#192C44]">
      <PageHeader title="1:1 커스텀 주문내용 상세보기" />

      <section className="px-7 pb-12 pt-8">
        <OrderDetailContent
          selectedImage={orderDetail.photoImgUrl}
          artistName={orderDetail.artistName}
          artistImage={orderDetail.artistImgUrl}
          artistIntro={orderDetail.introSummary}
          requestText={orderDetail.requestDetail}
          previewX={orderDetail.previewX}
          previewY={orderDetail.previewY}
        />
      </section>
    </main>
  );
}
