import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";

import PageHeader from "@/components/common/PageHeader";
import CustomRequestBox from "@/components/custom/CustomRequestBox";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-[#F9F4F0]">
      <PageHeader title="1:1 커스텀 신청" backTo="/custom" />

      <div className="flex flex-col items-center gap-5 py-10">
        <label htmlFor="custom-image" className="cursor-pointer">
          <CustomRequestBox className="my-5 h-82 w-61 flex-col gap-5 overflow-hidden">
            {image ? (
              <img src={image} alt="선택한 커스텀 이미지" className="h-full w-full object-cover" />
            ) : (
              <>
                <Upload className="size-15 text-[#C9C9C9]" />
                <p className="text-[18px] font-semibold text-[#C9C9C9]">커스텀할 사진을 고르세요</p>
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
          className="min-h-20 w-87 cursor-pointer"
          onClick={() => navigate("/custom/request/artist")}
        >
          <p className="text-[18px] font-semibold text-[#C9C9C9]">작가를 선택해주세요</p>
        </CustomRequestBox>

        <CustomRequestBox className="min-h-20 w-87">
          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="요청사항을 입력해주세요"
            rows={1}
            className="field-sizing-content min-h-20 w-full resize-none overflow-hidden bg-transparent px-4 py-5 text-left text-[18px] font-semibold outline-none placeholder:text-center placeholder:text-[#C9C9C9] focus:placeholder-transparent"
          />
        </CustomRequestBox>

        <Button
          className="h-14 w-87 rounded-2xl border-3 border-[#C9C9C9] bg-white text-[20px] text-[#727272]"
          onClick={() => navigate("/custom/request/complete")}
        >
          신청하기
        </Button>
      </div>
    </div>
  );
}
