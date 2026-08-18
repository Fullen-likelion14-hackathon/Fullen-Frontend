import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import ConfirmStep from "@/components/custom/common/step/ConfirmStep";

import bagImage from "@/assets/images/testBag.png";

import { recommendedArtists, otherArtists } from "@/components/oneToOneOrder/ArtistData";

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
      },
    });
    // TODO: 주문 API 연결
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0] text-[#192C44]">
      <PageHeader title="1:1커스텀 주문" />

      <section className="px-7 pb-12 pt-8">
        {/* 안내 */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-extrabold">이대로 1:1 커스텀을 주문할까요?</h1>

          <p className="mt-2 text-[15px] font-bold text-[#B89B84]">
            선택한 사진, 작가, 위치, 요청사항을 확인해주세요.
          </p>
        </div>

        {/* 1. 사진 선택 */}
        <ConfirmStep step={1} title="사진 선택" onEdit={() => handleEdit(1)}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="선택한 사진"
              className="h-72 w-full rounded-xl border-2 border-[#192C44] object-cover"
            />
          )}
        </ConfirmStep>

        {/* 2. 작가 선택 */}
        <ConfirmStep step={2} title="작가 선택" onEdit={() => handleEdit(2)}>
          {selectedArtist && (
            <div className="flex h-24 overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
              <img
                src={selectedArtist.image}
                alt={selectedArtist.name}
                className="w-24 object-cover"
              />

              <div className="flex flex-1 flex-col justify-center px-3">
                <img src={selectedArtist.flagImage} alt="" className="mb-1 h-4 w-6 object-cover" />

                <p className="font-bold">{selectedArtist.name}</p>

                <p className="mt-1 line-clamp-2 text-xs text-[#515C6C]">
                  {selectedArtist.description}
                </p>
              </div>
            </div>
          )}
        </ConfirmStep>

        {/* 3. 위치 선택 */}
        <ConfirmStep step={3} title="위치 선택" onEdit={() => handleEdit(3)}>
          {selectedLocation && (
            <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-xl border-2 border-[#192C44] bg-white">
              <img src={bagImage} alt="커스텀 가방" className="w-[90%] object-contain" />

              <div
                className="absolute h-14 w-14 border-2 border-[#192C44] bg-white"
                style={{
                  left: `${selectedLocation.x}%`,
                  top: `${selectedLocation.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )}
        </ConfirmStep>

        {/* 4. 요청사항 */}
        <ConfirmStep step={4} title="요청사항 작성" onEdit={() => handleEdit(4)}>
          <div className="min-h-52 whitespace-pre-wrap rounded-xl border-2 border-[#192C44] bg-white p-4 text-sm leading-7">
            {requestText}
          </div>
        </ConfirmStep>
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
