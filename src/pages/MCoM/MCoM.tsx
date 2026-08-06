import { useState } from "react";
import testImage1 from "@/assets/images/McoMTest.png";
import testImage2 from "@/assets/images/McoMTest2.png";
import countryImage from "@/assets/images/country.png";
import globalImage from "@/assets/images/global.png";

type MCoMTab = "country" | "global";

export default function MCoM() {
  const [MCoMTab, setMCoM] = useState<MCoMTab>("country");

  return (
    <main className="min-h-screen bg-gray-200">
      <div className="mx-auto min-h-screen w-full max-w-97.5 bg-[#F9F4F0]">
        <header className="bg-[#AB6A37] px-5 pb-6.25 pt-9.5">
          <h1 className="text-xl text-center font-semibold text-[#E9D8CB]">MCM 아카이브</h1>
        </header>
        {/* 탭 */}
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

        {/* 콘텐츠 영역 */}
        <section className="px-4">
          <div className="mt-4 flex gap-3">
            {/* 왼쪽 사진 열 */}
            <div className="flex w-1/2 flex-col gap-3">
              <img
                src={testImage1}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />

              <img
                src={testImage2}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />

              <img
                src={testImage2}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />
              <img
                src={testImage1}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />
            </div>

            {/* 오른쪽 사진 열 */}
            <div className="flex w-1/2 flex-col gap-3">
              <img
                src={MCoMTab === "country" ? countryImage : globalImage}
                alt={MCoMTab === "country" ? "현재 국가 아카이브" : "글로벌 아카이브"}
                className="block mx-auto  h-24 w-35 rounded-2xl "
              />

              <img
                src={testImage2}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />

              <img
                src={testImage2}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />

              <img
                src={testImage2}
                alt="MCM 아카이브 이미지"
                className="block h-auto w-full rounded-2xl"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
