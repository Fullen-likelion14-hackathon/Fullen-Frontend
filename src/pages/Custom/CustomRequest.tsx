import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import CustomRequestBox from "@/components/custom/CustomRequestBox";
import { Button } from "@/components/ui/button";

export default function CustomRequest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F4F0]">
      <PageHeader title="1:1 커스텀 신청" backTo="/custom" />

      <div className="flex flex-col items-center gap-5 py-10">
        <CustomRequestBox className="my-5 h-82 w-61 flex-col gap-5">
          <Upload className="size-15 text-[#C9C9C9]" />
          <p className="text-[18px] font-semibold text-[#C9C9C9]">커스텀할 사진을 고르세요</p>
        </CustomRequestBox>

        <CustomRequestBox className="min-h-20 w-87">
          <p className="text-[18px] font-semibold text-[#C9C9C9]">작가를 선택해주세요</p>
        </CustomRequestBox>

        <CustomRequestBox className="min-h-15 w-87">
          <p className="text-[18px] font-semibold text-[#C9C9C9]">요청사항을 입력해주세요</p>
        </CustomRequestBox>

        <Button
          className="h-14 w-87 rounded-2xl border-3 border-[#C9C9C9] bg-white"
          onClick={() => {
            navigate("/custom/request/complate");
          }}
        >
          <p className="text-center text-[20px] text-[#727272]">신청하기</p>
        </Button>
      </div>
    </div>
  );
}
