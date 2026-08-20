import { useState } from "react";

import MCoMGallery from "@/components/mcom/MCoMGallery";
import MCoMTabs from "@/components/mcom/MCoMTabs";

import type { MCoMTab } from "@/types/mcom";
import { useLocation } from "react-router-dom";

export default function MCoM() {
  const location = useLocation();

  const initialTab: MCoMTab = location.state?.tab === "global" ? "global" : "country";

  const [MCoMTab, setMCoM] = useState<MCoMTab>(initialTab);

  return (
    <main className="min-h-dvh bg-gray-200">
      <div className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F9F4F0]">
        <header className="bg-[#AB6A37] px-5 pb-6.25 pt-[calc(2.75rem+env(safe-area-inset-top))]">
          <h1 className="text-xl text-center font-semibold text-[#E9D8CB]">MCM 아카이브</h1>
        </header>

        <MCoMTabs MCoMTab={MCoMTab} setMCoM={setMCoM} />

        <MCoMGallery MCoMTab={MCoMTab} />
      </div>
    </main>
  );
}
