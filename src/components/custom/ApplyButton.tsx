import { Button } from "@/components/ui/button";

interface ApplyButtonProps {
  text: string;
  onApply: () => void;
}

export function ApplyButton({ text, onApply }: ApplyButtonProps) {
  return (
    <Button
      onClick={onApply}
      className="
        h-14
        w-82.5
        rounded-lg
        bg-[#242D41]
        text-[20px]
        font-semibold
        text-white
        shadow-[0_2px_8px_rgba(0,0,0,0.18)]
        hover:bg-[#202C46]
      "
    >
      {text}
    </Button>
  );
}
