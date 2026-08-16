import { Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";

import PageHeader from "@/components/common/PageHeader";
import CustomRequestBox from "@/components/oneToOneOrder/CustomRequestBox";
import OneToOneOrderButton from "@/components/oneToOneOrder/OneToOneOrderButton";

import { recommendedArtists, otherArtists } from "@/components/oneToOneOrder/ArtistData";

// 작가 선택 페이지에서 전달받는 state 타입
type CustomRequestLocationState = {
  selectedArtistId?: number;
};

export default function CustomRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  // 업로드한 이미지 미리보기 URL
  const [image, setImage] = useState<string | null>(null);

  // 사용자가 입력한 요청사항
  const [requestText, setRequestText] = useState("");

  // 작가 선택 페이지에서 전달받은 selectedArtistId 가져오기
  const locationState = location.state as CustomRequestLocationState | null;

  const selectedArtistId = locationState?.selectedArtistId ?? null;

  // 추천 작가와 다른 작가 데이터를 하나의 배열로 합치기
  const allArtists = [...recommendedArtists, ...otherArtists];

  // 전달받은 id와 일치하는 작가 찾기
  const selectedArtist = allArtists.find((artist) => artist.id === selectedArtistId);

  // 이미지 파일 선택 시 미리보기 URL 생성
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
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
          {/* 커스텀 이미지 업로드 영역 */}
          <label htmlFor="custom-image" className="cursor-pointer">
            <CustomRequestBox isFilled={!!image} className="h-90 flex-col gap-3 overflow-hidden">
              {/* 이미지가 선택되면 미리보기 표시 */}
              {image ? (
                <img
                  src={image}
                  alt="선택한 커스텀 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <Upload className="size-15 text-[#C9C9C9]" />

                  <p className="text-[18px] font-semibold text-[#C9C9C9]">
                    커스텀할 사진을 고르세요
                  </p>
                </>
              )}
            </CustomRequestBox>
          </label>

          {/* 실제 이미지 파일을 선택하는 input */}
          <input
            id="custom-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* 작가 선택 영역 */}
          <CustomRequestBox
            isFilled={!!selectedArtist}
            className="min-h-30 cursor-pointer"
            onClick={() => navigate("/onetooneorder/artist")}
          >
            {/* 선택된 작가가 있으면 작가 정보 표시 */}
            {selectedArtist ? (
              <div className="flex w-full items-center gap-4 px-4">
                {/* 작가 대표 이미지 */}
                <img
                  src={selectedArtist.image}
                  alt={selectedArtist.name}
                  className="h-18 w-18 shrink-0 rounded-lg object-cover"
                />

                {/* 작가 정보 */}
                <div className="min-w-0 flex-1">
                  {/* 작가 국가 */}
                  <img
                    src={selectedArtist.flagImage}
                    alt=""
                    className="mb-1 h-4 w-6 object-cover"
                  />

                  {/* 작가 이름 */}
                  <p className="text-[18px] font-bold text-[#192A40]">{selectedArtist.name}</p>

                  {/* 작가 간단 설명 */}
                  <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-[#727272]">
                    {selectedArtist.description}
                  </p>
                </div>
              </div>
            ) : (
              // 아직 작가를 선택하지 않은 경우
              <p className="text-[18px] font-semibold text-[#C9C9C9]">작가를 선택해주세요</p>
            )}
          </CustomRequestBox>

          {/* 요청사항 입력 영역 */}
          <CustomRequestBox isFilled={requestText.trim().length > 0}>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="요청사항을 입력해주세요"
              rows={1}
              className="field-sizing-content w-full resize-none overflow-hidden bg-transparent px-4 py-5 text-left text-[18px] font-semibold outline-none placeholder:text-center placeholder:text-[#C9C9C9] focus:placeholder-transparent"
            />
          </CustomRequestBox>

          {/* 다음 단계로 이동 */}
          <OneToOneOrderButton label="다음" onClick={() => navigate("/onetooneorder/")} />
        </div>
      </div>
    </main>
  );
}
