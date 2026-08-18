import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

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
    console.log({
      selectedImage,
      selectedArtistId,
      selectedLocation,
      requestText,
    });

    // TODO: 주문 API 연결
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0] text-[#192C44]">
      <PageHeader title="1:1커스텀 주문" />

      <section className="px-7 pb-12 pt-8">
        {/* 안내 */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold">이대로 1:1 커스텀을 주문할까요?</h1>

          <p className="mt-2 text-sm font-semibold text-[#B89B84]">
            선택한 사진, 작가, 위치, 요청사항을 확인해주세요.
          </p>
        </div>

        {/* 1. 사진 선택 */}
        <div className="border-t-2 border-[#DEC5AE] py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#192C44] text-2xl font-semibold text-[#A3642B]">
                1
              </span>

              <h2 className="text-xl font-bold">사진 선택</h2>
            </div>

            <button
              type="button"
              onClick={() => handleEdit(1)}
              className="rounded-md border border-[#B89B84] px-3 py-1.5 text-sm font-bold"
            >
              수정하기
            </button>
          </div>

          {selectedImage && (
            <img
              src={selectedImage}
              alt="선택한 사진"
              className="h-72 w-full rounded-xl border-2 border-[#192C44] object-cover"
            />
          )}
        </div>

        {/* 2. 작가 선택 */}
        <div className="border-t-2 border-[#DEC5AE] py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#192C44] text-2xl font-semibold text-[#A3642B]">
                2
              </span>

              <h2 className="text-xl font-bold">작가 선택</h2>
            </div>

            <button
              type="button"
              onClick={() => handleEdit(2)}
              className="rounded-md border border-[#B89B84] px-3 py-1.5 text-sm font-bold"
            >
              수정하기
            </button>
          </div>

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
        </div>

        {/* 3. 위치 선택 */}
        <div className="border-t-2 border-[#DEC5AE] py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#192C44] text-2xl font-semibold text-[#A3642B]">
                3
              </span>

              <h2 className="text-xl font-bold">위치 선택</h2>
            </div>

            <button
              type="button"
              onClick={() => handleEdit(3)}
              className="rounded-md border border-[#B89B84] px-3 py-1.5 text-sm font-bold"
            >
              수정하기
            </button>
          </div>

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
        </div>

        {/* 4. 요청사항 */}
        <div className="border-y-2 border-[#DEC5AE] py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#192C44] text-2xl font-semibold text-[#A3642B]">
                4
              </span>

              <h2 className="text-xl font-bold">요청사항 작성</h2>
            </div>

            <button
              type="button"
              onClick={() => handleEdit(4)}
              className="rounded-md border border-[#B89B84] px-3 py-1.5 text-sm font-bold"
            >
              수정하기
            </button>
          </div>

          <div className="min-h-52 whitespace-pre-wrap rounded-xl border-2 border-[#192C44] bg-white p-4 text-sm leading-7">
            {requestText}
          </div>
        </div>

        {/* 최종 주문 */}
        <button
          type="button"
          onClick={handleOrder}
          className="mt-10 h-16 w-full rounded-xl bg-[#192C44] text-lg font-bold text-white shadow-md"
        >
          이대로 주문하기
        </button>
      </section>
    </main>
  );
}
