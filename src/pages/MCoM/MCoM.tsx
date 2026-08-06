import { useState } from "react";

type MCoMTab = "country" | "global";

export default function MCoM() {
  const [MCoMTab, setMCoM] = useState<MCoMTab>("country");

  return (
    <main className="min-h-screen bg-gray-200">
      <div className="mx-auto min-h-screen w-full max-w-97.5 bg-[#F9F4F0]">
        <header className="bg-[#AB6A37] px-5 pb-6.25 pt-9.5">
          <h1 className="text-xl text-center font-semibold text-[#E9D8CB]">MCM 아카이브</h1>
        </header>

        <div className=" flex">
          <div className={`w-1/2 ${MCoMTab === "country" ? "bg-[#AB6A37]" : "bg-[#F9F4F0]"}`}>
            <button
              type="button"
              onClick={() => setMCoM("country")}
              className={`w-full p-2.5 
              ${
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
              className={`w-full  p-2.5
              ${
                MCoMTab === "global"
                  ? "rounded-tl-[25px] font-bold bg-[#F9F4F0] text-[#AB6A37]"
                  : "rounded-bl-[25px] bg-[#AB6A37] text-[#D5B49B]"
              }`}
            >
              글로벌
            </button>
          </div>
        </div>

        <h1>McoM사진들</h1>
      </div>
    </main>
  );
}
