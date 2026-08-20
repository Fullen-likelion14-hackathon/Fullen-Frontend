import { Button } from "@/components/ui/button";

interface ApplyButtonProps {
  text: string;
  onApply: () => void;

  // 적용할 이니셜 없을 때 버튼 비활성화하기 위해 받음
  disabled?: boolean;
}

export function ApplyButton({ text, onApply, disabled = false }: ApplyButtonProps) {
  return (
    <Button
      onClick={onApply}
      disabled={disabled}
      className="
        h-14
        w-82.5
        rounded-lg
        bg-[#242D41]
        text-[1rem]
        font-semibold
        text-white
        shadow-[0_2px_8px_rgba(0,0,0,0.18)]
        hover:bg-[#202C46]
        disabled:bg-[#D1D1D1]
        disabled:text-white
      "
    >
      {text}
    </Button>
  );
}
