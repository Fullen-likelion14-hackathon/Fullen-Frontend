import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  backTo?: string;
  onBackClick?: () => void;

  // 기본 헤더 / 배경·하단선 없는 헤더
  variant?: "default" | "plain";
};

export default function PageHeader({
  title,
  backTo,
  onBackClick,
  variant = "default",
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    if (backTo) {
      navigate(backTo, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={`
        relative z-50
        pb-6.25 pt-[calc(2.75rem+env(safe-area-inset-top))]
        ${variant === "default" ? "border-b-[0.4375rem] border-[#AB6A37] bg-[#242D41]" : "bg-transparent"}
      `}
    >
      <div className="relative flex items-center justify-center px-5">
        <button
          type="button"
          onClick={handleBack}
          className={`absolute left-4 z-10 text-xl cursor-pointer ${
            variant === "default" ? "text-[#F7F7F7]" : "text-[#192C44]"
          }`}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={36} strokeWidth={2.5} />
        </button>

        <h1
          className={`text-center text-xl font-semibold ${
            variant === "default" ? "text-[#F7F7F7]" : "text-[#192C44]"
          }`}
        >
          {title}
        </h1>
      </div>
    </header>
  );
}
