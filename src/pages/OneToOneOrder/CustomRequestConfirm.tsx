import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import OrderDetailContent from "@/components/oneToOneOrder/OrderDetailContent";

import { useBags } from "@/hooks/queries/useBags";
import { useArtists } from "@/hooks/queries/artist/useArtists";
import { useCreatePremiumOrder } from "@/hooks/mutations/useCreatePremiumOrder";

import type { PatchLocation } from "@/types/patchLocation";

type ConfirmLocationState = {
  // 주문 API에 전달할 사진 id
  selectedPhotoId?: number;

  // 화면에 보여줄 사진 URL
  selectedImage?: string;

  // 선택한 작가 id
  selectedArtistId?: number;

  // 선택한 패치 위치
  selectedLocation?: PatchLocation;

  // 요청사항
  requestText?: string;
};

export default function CustomRequestConfirm() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as ConfirmLocationState | null;

  const selectedPhotoId = locationState?.selectedPhotoId;
  const selectedImage = locationState?.selectedImage;
  const selectedArtistId = locationState?.selectedArtistId;
  const selectedLocation = locationState?.selectedLocation;
  const requestText = locationState?.requestText ?? "";

  // 사용자 소유 가방 조회
  const { data: bags = [], isPending: isBagsPending, isError: isBagsError } = useBags();

  // 현재 사용하는 가방 id
  const userBagId = bags[0]?.userBagId;

  // 작가 리스트 조회
  // 대표 이미지가 필요한 화면이므로 상세 API가 아닌 리스트 API 사용
  const { data: artists = [], isPending: isArtistsPending, isError: isArtistsError } = useArtists();

  // 선택한 작가 id와 일치하는 작가 찾기
  const selectedArtist = artists.find((artist) => artist.artistId === selectedArtistId) ?? null;

  // 1:1 커스텀 주문 생성 mutation
  const { mutate: createPremiumOrder, isPending: isOrderPending } = useCreatePremiumOrder();

  // 수정할 단계로 돌아가기
  const handleEdit = (step: number) => {
    navigate("/onetooneorder/request", {
      state: {
        selectedPhotoId,
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
    // 주문에 필요한 값이 없는 경우 요청하지 않음
    if (
      userBagId === undefined ||
      selectedPhotoId === undefined ||
      selectedArtistId === undefined ||
      !selectedLocation ||
      !requestText.trim()
    ) {
      return;
    }

    createPremiumOrder(
      {
        userBagId,
        photoId: selectedPhotoId,
        artistId: selectedArtistId,
        requestDetail: requestText,
        side: selectedLocation.side,
        posX: selectedLocation.posX,
        posY: selectedLocation.posY,
        rotation: selectedLocation.rotation,
        previewX: selectedLocation.previewX,
        previewY: selectedLocation.previewY,
      },
      {
        // 주문 생성 성공
        onSuccess: (response) => {
          console.log("주문 생성 응답:", response);
          console.log("premiumOrderId:", response.data?.premiumOrderId);

          navigate("/custom/order/complete", {
            state: {
              orderType: "onetoone",
              premiumOrderId: response.data?.premiumOrderId,
            },
          });
        },

        // 주문 생성 실패
        onError: (error) => {
          console.error("1:1 커스텀 주문 생성 실패:", error);
        },
      },
    );
  };

  // 가방 정보 로딩
  if (isBagsPending) {
    return <div>가방 정보를 불러오는 중입니다.</div>;
  }

  // 가방 정보 에러
  if (isBagsError || userBagId === undefined) {
    return <div>가방 정보를 불러오지 못했습니다.</div>;
  }

  // 작가 리스트 로딩
  if (selectedArtistId !== undefined && isArtistsPending) {
    return <div>작가 정보를 불러오는 중입니다.</div>;
  }

  // 작가 리스트 에러
  if (selectedArtistId !== undefined && isArtistsError) {
    return <div>작가 정보를 불러오지 못했습니다.</div>;
  }

  // 선택한 작가를 찾지 못한 경우
  if (selectedArtistId !== undefined && !selectedArtist) {
    return <div>선택한 작가 정보를 찾을 수 없습니다.</div>;
  }

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
          selectedLocation={selectedLocation}
          requestText={requestText}
          onEdit={handleEdit}
        />
      </section>

      {/* 하단 고정 주문 버튼 */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-97.5 -translate-x-1/2 bg-[#F9F4F0] px-7 pb-6 pt-4">
        <button
          type="button"
          onClick={handleOrder}
          disabled={isOrderPending}
          className={`h-16 w-full rounded-xl text-lg font-bold text-white shadow-md ${
            isOrderPending ? "cursor-not-allowed bg-[#D9D9D9]" : "bg-[#192C44]"
          }`}
        >
          {isOrderPending ? "주문 중..." : "이대로 주문하기"}
        </button>
      </div>
    </main>
  );
}
