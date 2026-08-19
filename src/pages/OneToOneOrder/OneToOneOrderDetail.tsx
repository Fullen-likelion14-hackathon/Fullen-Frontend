import { useLocation } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import OrderDetailContent from "@/components/oneToOneOrder/OrderDetailContent";

import { useArtist } from "@/hooks/queries/artist/useArtist";

import type { PatchLocation } from "@/types/patchLocation";

type OrderDetailLocationState = {
  selectedImage?: string;
  selectedArtistId?: number;
  selectedLocation?: PatchLocation;
  requestText?: string;
};

export default function OneToOneOrderDetail() {
  const location = useLocation();

  const locationState = location.state as OrderDetailLocationState | null;

  const selectedImage = locationState?.selectedImage;

  const selectedArtistId = locationState?.selectedArtistId;

  const selectedLocation = locationState?.selectedLocation;

  const requestText = locationState?.requestText ?? "";

  // 선택한 작가 상세 정보 조회
  const {
    data: selectedArtist,
    isPending: isArtistPending,
    isError: isArtistError,
  } = useArtist(selectedArtistId);

  // 작가 정보 로딩
  if (selectedArtistId !== undefined && isArtistPending) {
    return <div>작가 정보를 불러오는 중입니다.</div>;
  }

  // 작가 정보 조회 실패
  if (selectedArtistId !== undefined && isArtistError) {
    return <div>작가 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0] text-[#192C44]">
      <PageHeader title="1:1 커스텀 주문내용 상세보기" />

      <section className="px-7 pb-12 pt-8">
        <OrderDetailContent
          selectedImage={selectedImage}
          selectedArtist={selectedArtist ?? null}
          selectedLocation={selectedLocation}
          requestText={requestText}
        />
      </section>
    </main>
  );
}
