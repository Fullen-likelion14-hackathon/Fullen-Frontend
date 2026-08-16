import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface MyPageMenuItemProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function MyPageMenuItem({ label, icon, onClick }: MyPageMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center border-b-2 border-[#e2cdb9] px-2 py-3 text-left"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#aa6829] [&_svg]:size-6">
        {icon}
      </span>
      <span className="ml-4 flex-1 text-[23px] font-bold">{label}</span>
      <ChevronRight className="size-7 text-[#90959d]" strokeWidth={2.6} />
    </button>
  );
}
