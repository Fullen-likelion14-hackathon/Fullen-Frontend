import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  backTo?: string;
  // 뒤로가기 전에 커스텀 로직(예: 미저장 변경사항 확인모달)이 필요한 페이지용.
  // 넘기지 않으면 기존과 동일하게 backTo 이동 또는 navigate(-1) 실행됨 (하위호환).
  onBackClick?: () => void;
};

export default function PageHeader({ title, backTo, onBackClick }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="border-b-[7px] border-[#AB6A37] bg-[#242D41] pb-6.25 pt-11">
      <div className="relative flex items-center justify-center px-5">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-4 text-xl text-[#F7F7F7]"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={36} strokeWidth={2.5} />
        </button>

        <h1 className="text-center text-xl font-semibold text-[#F7F7F7]">{title}</h1>
      </div>
    </header>
  );
}
