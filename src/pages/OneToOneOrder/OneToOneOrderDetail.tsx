import { useLocation } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import OrderDetailContent from "@/components/oneToOneOrder/OrderDetailContent";

import { recommendedArtists, otherArtists } from "@/components/oneToOneOrder/ArtistData";

import type { PatchLocation } from "@/components/custom/common/selection/LocationSelectBox";

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

  const allArtists = [...recommendedArtists, ...otherArtists];

  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0] text-[#192C44]">
      <PageHeader title="1:1 커스텀 주문내용 상세보기" />

      <section className="px-7 pb-12 pt-8">
        <OrderDetailContent
          selectedImage={selectedImage}
          selectedArtist={selectedArtist}
          selectedLocation={selectedLocation}
          requestText={requestText}
        />
      </section>
    </main>
  );
}
