import { useEffect, useState } from "react";

import BGDetail from "@/assets/images/BG_detail.png";

import loading1 from "@/assets/icons/loading/loading1.png";
import loading2 from "@/assets/icons/loading/loading2.png";
import loading3 from "@/assets/icons/loading/loading3.png";
import loading4 from "@/assets/icons/loading/loading4.png";
import loading5 from "@/assets/icons/loading/loading5.png";
import loading6 from "@/assets/icons/loading/loading6.png";

export default function CustomLoading() {
  const loadingFrames = [loading1, loading2, loading3, loading4, loading5, loading6];

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % loadingFrames.length);
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="relative mx-auto flex h-dvh w-full max-w-97.5 flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BGDetail})` }}
    >
      <div className="flex -translate-y-12 flex-col items-center">
        <p className=" text-sm font-semibold text-[#192C44]">잠시만 기다려주세요</p>

        <div className="flex h-28 w-36 items-center justify-center">
          <img src={loadingFrames[frameIndex]} alt="로딩 중" className="w-60 object-contain" />
        </div>
      </div>
    </main>
  );
}
