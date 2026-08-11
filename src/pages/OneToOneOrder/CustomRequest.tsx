import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";

import PageHeader from "@/components/common/PageHeader";
import CustomRequestBox from "@/components/oneToOneOrder/CustomRequestBox";
import OneToOneOrderButton from "@/components/oneToOneOrder/OneToOneOrderButton";

export default function CustomRequest() {
  const navigate = useNavigate();

  const [image, setImage] = useState<string | null>(null);
  // state에 문자열(string)이나 null만 들어갈 수 있음, 처음 값은 null

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 이 함수에 들어오는 e는 input에서 발생한 change 이벤트임.
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
  };
  const [requestText, setRequestText] = useState("");

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#EEE4D8]">
      {/* 배경 곡선 */}
      <div className="pointer-events-none absolute top-105 left-1/2 h-80 w-150 -translate-x-1/2 rounded-[50%] bg-[#F9F4F0]" />
      {/* 아래 배경 */}
      <div className="pointer-events-none absolute top-135 bottom-0 left-0 w-full bg-[#F9F4F0]" />
      {/* 실제 페이지 내용 */}
      <div className="relative">
        <PageHeader title="1:1 커스텀 신청" backTo="/onetooneorder" />

        <div className="flex flex-col items-center gap-5 py-8">
          <label htmlFor="custom-image" className="cursor-pointer">
            <CustomRequestBox isFilled={!!image} className="h-90 flex-col gap-3 overflow-hidden">
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

          <input
            id="custom-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <CustomRequestBox
            className="min-h-30 cursor-pointer"
            onClick={() => navigate("/onetooneorder/artist")}
          >
            <p className="text-[18px] font-semibold text-[#C9C9C9]">작가를 선택해주세요</p>
          </CustomRequestBox>

          <CustomRequestBox isFilled={requestText.trim().length > 0}>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="요청사항을 입력해주세요"
              rows={1}
              className="field-sizing-content w-full resize-none overflow-hidden bg-transparent px-4 py-5 text-left text-[18px] font-semibold outline-none placeholder:text-center placeholder:text-[#C9C9C9] focus:placeholder-transparent"
            />
          </CustomRequestBox>

          <OneToOneOrderButton label="다음" onClick={() => navigate("/onetooneorder/")} />
        </div>
      </div>
    </main>
  );
}
