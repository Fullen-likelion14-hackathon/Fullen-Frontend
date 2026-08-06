import type { MCoMTab } from "@/components/mcom/mcom";

type MCoMTabsProps = {
  MCoMTab: MCoMTab;
  setMCoM: (tab: MCoMTab) => void;
};

export default function MCoMTabs({ MCoMTab, setMCoM }: MCoMTabsProps) {
  return (
    <div className="flex">
      <div className={`w-1/2 ${MCoMTab === "country" ? "bg-[#AB6A37]" : "bg-[#F9F4F0]"}`}>
        <button
          type="button"
          onClick={() => setMCoM("country")}
          className={`w-full p-2.5 ${
            MCoMTab === "country"
              ? "rounded-tr-[25px] bg-[#F9F4F0] text-[#AB6A37] font-bold"
              : "rounded-br-[25px] bg-[#AB6A37] text-[#D5B49B]"
          }`}
        >
          현재 위치한 나라
        </button>
      </div>

      <div className={`w-1/2 ${MCoMTab === "global" ? "bg-[#AB6A37]" : "bg-[#F9F4F0]"}`}>
        <button
          type="button"
          onClick={() => setMCoM("global")}
          className={`w-full p-2.5 ${
            MCoMTab === "global"
              ? "rounded-tl-[25px] font-bold bg-[#F9F4F0] text-[#AB6A37]"
              : "rounded-bl-[25px] bg-[#AB6A37] text-[#D5B49B]"
          }`}
        >
          글로벌
        </button>
      </div>
    </div>
  );
}
