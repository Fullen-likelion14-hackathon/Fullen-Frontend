import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  backTo?: string;
};

export default function PageHeader({ title, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
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
