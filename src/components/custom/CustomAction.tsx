import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// 커스터마이징 버튼
export function CustomizeButton() {
  const navigate = useNavigate();

  const handleCustomize = () => {
    // TODO: 커스터마이징 페이지 생성 후 경로 수정
    navigate("/");
  };

  return (
    <Button
      onClick={handleCustomize}
      className="
        h-12
        w-40.5
        rounded-full
        bg-white/40
        text-[20px]
        font-semibold
        text-[#757575]
        shadow-[0_0_7.82px_0_rgba(94,140,136,0.25),inset_0_2.24px_2.24px_0_rgba(255,255,255,0.70)]
      "
    >
      커스터마이징
    </Button>
  );
}

// 주문하기 버튼
export function OrderButton() {
  const navigate = useNavigate();

  const handleOrder = () => {
    // TODO: 주문 페이지 생성 후 경로 수정
    navigate("/custom/request");
  };

  return (
    <Button
      onClick={handleOrder}
      className="
        h-12
        w-27.5
        rounded-full
        bg-white/40
        text-[20px]
        font-semibold
        text-[#C0C0C0]
        shadow-[0_0_7.82px_0_rgba(94,140,136,0.25),inset_0_2.24px_2.24px_0_rgba(255,255,255,0.70)]
      "
    >
      주문하기
    </Button>
  );
}

// 디지털 제품 여권 버튼
export function DPPButton() {
  const navigate = useNavigate();

  const handleDPP = () => {
    // TODO: 디지털 제품 여권 페이지 생성 후 경로 수정
    navigate("/");
  };

  return (
    <Button
      onClick={handleDPP}
      className="
        h-7
        w-30
        rounded-full
        bg-white/40
        text-[12px]
        font-semibold
        text-[#C0C0C0]
        shadow-[0_0_7.82px_0_rgba(94,140,136,0.25)]
      "
    >
      디지털 제품 여권
      <ChevronRight className="size-3" />
    </Button>
  );
}
