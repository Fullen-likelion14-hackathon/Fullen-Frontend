import { Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent } from "react";

import PageHeader from "@/components/common/PageHeader";

import ArtistSelectBox from "@/components/custom/common/selection/ArtistSelectBox";

import CustomRequestBox from "@/components/oneToOneOrder/CustomRequestBox";
import OneToOneOrderButton from "@/components/oneToOneOrder/OneToOneOrderButton";

import { recommendedArtists, otherArtists } from "@/components/oneToOneOrder/ArtistData";

// 작가 선택 페이지에서 전달받는 state 타입임
type CustomRequestLocationState = {
  selectedArtistId?: number;
};

export default function CustomRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  // 작가 선택 페이지에서 전달받은 state임
  const locationState = location.state as CustomRequestLocationState | null;

  // 업로드한 이미지 미리보기 URL임
  const [image, setImage] = useState<string | null>(null);

  // 사용자가 입력한 요청사항임
  const [requestText, setRequestText] = useState("");

  // 현재 선택된 작가 id임
  // 작가 선택 페이지에서 돌아온 경우 전달받은 id를 초기값으로 사용함
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(
    locationState?.selectedArtistId ?? null,
  );

  // 추천 작가와 다른 작가 데이터를 하나로 합쳐줌
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 선택된 id와 일치하는 실제 작가 정보를 찾음
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId) ?? null;

  // 이미지 파일을 선택하면 미리보기 URL을 만들어줌
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
  };

  // 공통 작가 선택 페이지로 이동함
  const handleArtistSelect = () => {
    navigate("/onetooneorder/artist", {
      state: {
        source: "onetoone",
        returnTo: "/onetooneorder/request",
      },
    });
  };

  // 선택된 작가를 해제함
  const handleArtistRemove = () => {
    setSelectedArtistId(null);
  };

  // 다음 단계로 이동함
  const handleNext = () => {
    // TODO: 다음 1:1 주문 단계 경로 연결 예정임
    navigate("/onetooneorder/");
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#EEE4D8]">
      {/* 상단 배경 곡선 */}
      <div className="pointer-events-none absolute top-105 left-1/2 h-80 w-150 -translate-x-1/2 rounded-[50%] bg-[#F9F4F0]" />

      {/* 하단 배경 */}
      <div className="pointer-events-none absolute top-135 bottom-0 left-0 w-full bg-[#F9F4F0]" />

      {/* 페이지 내용 */}
      <div className="relative">
        <PageHeader title="1:1 커스텀 신청" backTo="/onetooneorder" />

        <div className="flex flex-col items-center gap-5 py-8">
          {/* 사진 업로드 영역 */}
          <label htmlFor="custom-image" className="cursor-pointer">
            <CustomRequestBox isFilled={!!image} className="h-90 flex-col gap-3 overflow-hidden">
              {image ? (
                // 사진이 선택된 경우
                <img
                  src={image}
                  alt="선택한 커스텀 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                // 아직 사진을 선택하지 않은 경우
                <>
                  <Upload className="size-15 text-[#C9C9C9]" />

                  <p className="text-[18px] font-semibold text-[#C9C9C9]">
                    커스텀할 사진을 고르세요
                  </p>
                </>
              )}
            </CustomRequestBox>
          </label>

          {/* 실제 사진 선택 input */}
          <input
            id="custom-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* 작가 선택 영역 */}
          {/* AI 패치 생성 페이지와 공통으로 사용하는 컴포넌트임 */}
          <div className="w-85">
            <ArtistSelectBox
              selectedArtist={selectedArtist}
              onSelect={handleArtistSelect}
              onRemove={handleArtistRemove}
            />
          </div>

          {/* 요청사항 입력 영역 */}
          <CustomRequestBox isFilled={requestText.trim().length > 0}>
            <textarea
              value={requestText}
              onChange={(event) => setRequestText(event.target.value)}
              placeholder="요청사항을 입력해주세요"
              rows={1}
              className="field-sizing-content w-full resize-none overflow-hidden bg-transparent px-4 py-5 text-left text-[18px] font-semibold outline-none placeholder:text-center placeholder:text-[#C9C9C9] focus:placeholder-transparent"
            />
          </CustomRequestBox>

          {/* 다음 단계 버튼 */}
          <OneToOneOrderButton label="다음" onClick={handleNext} />
        </div>
      </div>
    </main>
  );
}
