import { useLocation, useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import floorBg from "@/assets/images/Floor.png";
import { ProductViewer } from "@/components/custom/viewer/ProductViewer";

import type { PatchLocation } from "@/components/custom/common/selection/LocationSelectBox";

type LocationSelectState = {
  selectedImage?: string;
  selectedArtistId?: number;
  requestText?: string;
  returnTo?: string;
};

export default function LocationSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationSelectState | null;

  // TODO: 실제 프레임 드래그 기능 구현 후 좌표값으로 변경
  const selectedLocation: PatchLocation = {
    x: 72,
    y: 62,
  };

  // 위치 선택 완료
  const handleLocationSelect = () => {
    navigate(locationState?.returnTo ?? "/onetooneorder/request", {
      state: {
        // 기존에 선택한 값 유지
        selectedImage: locationState?.selectedImage,
        selectedArtistId: locationState?.selectedArtistId,
        requestText: locationState?.requestText,

        // 선택한 위치 전달
        selectedLocation,

        // 위치 선택 단계로 돌아감
        currentStep: 3,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      {/* 헤더 */}
      <div className="relative z-20">
        <PageHeader title="위치 선택" backTo="/onetooneorder/request" />
      </div>

      {/* 배경 */}
      <img
        src={floorBg}
        alt=""
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-0
          h-auto
          w-155
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          opacity-60
        "
      />

      {/* 본문 */}
      <section className="relative z-10 flex h-[calc(100dvh-126px)] flex-col px-6 pt-12">
        {/* 제품 정보 */}
        <div className="text-center">
          <h2 className="text-[24px] font-extrabold text-[#192C44]">Ottomar 비세토스 위켄더</h2>

          <p className=" text-[18px] font-bold text-[#9197A0]">50.5 cm (19.9 in)</p>
        </div>

        {/* 제품 */}
        <div className="absolute inset-0">
          <ProductViewer />
        </div>

        {/* 안내 문구 */}
        <p className="mt-100 text-center text-[20px] font-bold leading-8 text-[#9197A0]">
          커스텀 받고싶은 위치에
          <br />
          흰색 프레임을 올려놓아주세요
        </p>

        {/* 위치 선택 버튼 */}
        <button
          type="button"
          onClick={handleLocationSelect}
          className="absolute bottom-8 left-6 right-6 h-16 rounded-xl bg-[#192C44] text-[20px] font-bold text-white shadow-md"
        >
          위치 선택하기
        </button>
      </section>
    </main>
  );
}
