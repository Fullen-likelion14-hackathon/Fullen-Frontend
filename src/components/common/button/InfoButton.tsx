import { Info } from "lucide-react";

interface InfoButtonProps {
  content: string; // 부모한테 안내 내용 받음
}

export default function InfoButton({ content }: InfoButtonProps) {
  const handleClick = () => {
    alert(content);
  };

  return (
    <button type="button" onClick={handleClick}>
      <Info className="h-9.5 w-9.5 text-[#D5C6BA]" />
    </button>
  );
}
