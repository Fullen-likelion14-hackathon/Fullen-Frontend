import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AIGenerateProps {
  text: string;
  path: string;
}

export function AIGenerateButton({ text, path }: AIGenerateProps) {
  const navigate = useNavigate();

  const handleAIGenerate = () => {
    navigate(path);
  };

  return (
    <Button
      onClick={handleAIGenerate}
      className="
        h-9.5
        w-32.5
        rounded-full
        border-2
        border-[#AC917C]
        bg-[#F9F4F0]
        text-[14px]
        font-semibold
        text-[#6E3C27]
        hover:bg-[#D2C3B7]!
        active:bg-[#D2C3B7]!
      "
    >
      {text}
    </Button>
  );
}
