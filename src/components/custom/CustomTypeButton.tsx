import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// 패치 커스터마이징 버튼
export function PatchButton() {
  const navigate = useNavigate();

  const handlePatch = () => {
    // TODO: 패치 커스터마이징 생성후 루트 수정
    navigate("/custom/patch");
  };

  return (
    <Button
      onClick={handlePatch}
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
      패치
    </Button>
  );
}

// 이니셜 커스터마이징 버튼
export function InitialButton() {
  const navigate = useNavigate();

  const handleOrder = () => {
    // TODO: 이니셜 커스터마이징 생성 후 경로 수정
    navigate("/custom/initials");
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
      이니셜
    </Button>
  );
}
