import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CustomGenerateProps {
  // 버튼에 들어갈 글자 받음
  text: string;

  // 페이지 이동 필요한 경우 경로 받음
  path?: string;

  // 페이지 이동 없이 다른 기능 실행할 경우 함수 받음
  onClick?: () => void;

  // 버튼 활성화 스타일 유지할지 받음
  active?: boolean;
}

export function CustomGenerateButton({ text, path, onClick, active = false }: CustomGenerateProps) {
  const navigate = useNavigate();

  const handleCustomGenerate = () => {
    // 클릭 함수 있으면 해당 기능 먼저 실행함
    if (onClick) {
      onClick();
      return;
    }

    // 이동 경로 있으면 해당 페이지로 이동함
    if (path) {
      navigate(path);
    }
  };

  return (
    <Button
      onClick={handleCustomGenerate}
      className={`
        h-9.5
        w-32.5
        rounded-full
        border-2
        border-[#AC917C]
        text-[14px]
        font-semibold
        text-[#6E3C27]
        active:bg-[#D2C3B7]!
        ${active ? "bg-[#D2C3B7]!" : "bg-[#F9F4F0] hover:bg-[#D2C3B7]!"}
      `}
    >
      {text}
    </Button>
  );
}
