import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import OrderDetailContent from "@/components/oneToOneOrder/OrderDetailContent";

import { recommendedArtists, otherArtists } from "@/mocks/ArtistData";

import type { PatchLocation } from "@/components/custom/common/selection/LocationSelectBox";

type ConfirmLocationState = {
  selectedImage?: string;
  selectedArtistId?: number;
  selectedLocation?: PatchLocation;
  requestText?: string;
};

export default function CustomRequestConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as ConfirmLocationState | null;

  const selectedImage = locationState?.selectedImage;
  const selectedArtistId = locationState?.selectedArtistId;
  const selectedLocation = locationState?.selectedLocation;
  const requestText = locationState?.requestText ?? "";

  const allArtists = [...recommendedArtists, ...otherArtists];

  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 수정할 단계로 돌아가기
  const handleEdit = (step: number) => {
    navigate("/onetooneorder/request", {
      state: {
        selectedImage,
        selectedArtistId,
        selectedLocation,
        requestText,
        currentStep: step,
      },
    });
  };

  // 최종 주문
  const handleOrder = () => {
    navigate("/custom/order/complete", {
      state: {
        orderType: "onetoone",
        selectedImage,
        selectedArtistId,
        selectedLocation,
        requestText,
      },
    });

    // TODO: 주문 API 연결
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0] text-[#192C44]">
      <PageHeader title="1:1커스텀 주문" />

      <section className="px-7 pb-32 pt-8">
        {/* 안내 */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-extrabold">이대로 1:1 커스텀을 주문할까요?</h1>

          <p className="mt-2 text-[15px] font-bold text-[#B89B84]">
            선택한 사진, 작가, 위치, 요청사항을 확인해주세요.
          </p>
        </div>

        {/* 주문 내용 */}
        <OrderDetailContent
          selectedImage={selectedImage}
          selectedArtist={selectedArtist}
          selectedLocation={selectedLocation ?? undefined}
          requestText={requestText}
          onEdit={handleEdit}
        />
      </section>

      {/* 하단 고정 주문 버튼 */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-97.5 -translate-x-1/2 bg-[#F9F4F0] px-7 pb-6 pt-4">
        <button
          type="button"
          onClick={handleOrder}
          className="h-16 w-full rounded-xl bg-[#192C44] text-lg font-bold text-white shadow-md"
        >
          이대로 주문하기
        </button>
      </div>
    </main>
  );
}
