import testImage1 from "@/assets/images/McoMTest.png";
import testImage2 from "@/assets/images/McoMTest2.png";
import countryImage from "@/assets/images/country.png";
import globalImage from "@/assets/images/global.png";

import type { MCoMTab } from "@/components/mcom/mcom";

type MCoMGalleryProps = {
  MCoMTab: MCoMTab;
};

export default function MCoMGallery({ MCoMTab }: MCoMGalleryProps) {
  return (
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
            className="block mx-auto h-24 w-35 rounded-2xl"
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
  );
}
