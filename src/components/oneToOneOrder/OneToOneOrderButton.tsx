import { Button } from "@/components/ui/button";

type OneToOneOrderButtonProps = {
  onClick: () => void;
  label: string;
};

export default function OneToOneOrderButton({ onClick, label }: OneToOneOrderButtonProps) {
  return (
    <Button
      className="h-14 w-85 rounded-xl border-3 border-[#C9C9C9] bg-[#CFCDCE] text-[20px] text-[#727272]"
      onClick={onClick}
    >
      <p className="text-[#F9F4F0]">{label}</p>
    </Button>
  );
}
