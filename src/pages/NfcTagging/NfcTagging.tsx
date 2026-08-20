import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bagImage from "@/assets/images/bag.png";

const NfcTagging = () => {
  const navigate = useNavigate();
  const [isTagging, setIsTagging] = useState(false);

  const handleTag = () => {
    if (isTagging) return; // 연속 클릭 방지
    setIsTagging(true);
    // TODO: 실제 NFC API 연동 시 이 부분 교체
    setTimeout(() => {
      navigate("/passport");
    }, 1200);
  };

  return (
    <div className="relative w-96 h-211 min-h-dvh mx-auto bg-[#242D41] overflow-hidden">
      {/* 정적 배경 원형 레이어 */}
      <div className="size-125 left-74.5 top-21 absolute origin-top-left rotate-[61.78deg] bg-zinc-300/20 rounded-full" />
      <div className="size-150 left-10.75 top-4 absolute origin-top-left rotate-[61.78deg] bg-zinc-300/5 rounded-full" />
      <div className="size-96 left-10.75 top-51.75 absolute origin-top-left rotate-[9.76deg] bg-white/20 rounded-full" />
      <div className="size-80 left-10 top-66.75 absolute bg-zinc-300/20 rounded-full" />

      {/* 파동 애니메이션 링 (흰 원과 같은 중심, 순차적으로 퍼짐, 속도 완화) */}
      <span
        className="size-64 left-17.5 top-74.25 absolute rounded-full bg-white/30 animate-[ping_3.6s_ease-out_infinite]"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="size-64 left-17.5 top-74.25 absolute rounded-full bg-white/30 animate-[ping_3.6s_ease-out_infinite]"
        style={{ animationDelay: "1.2s" }}
      />
      <span
        className="size-64 left-17.5 top-74.25 absolute rounded-full bg-white/30 animate-[ping_3.6s_ease-out_infinite]"
        style={{ animationDelay: "2.4s" }}
      />

      {/* 흰 원(고정, 태깅 탭 영역) */}
      <button
        onClick={handleTag}
        disabled={isTagging}
        aria-label="NFC 태깅하기"
        className="size-64 left-17.5 top-74.25 absolute bg-stone-50 rounded-full active:scale-95 transition-transform disabled:opacity-90 z-10"
      />

      {/* 가방 이미지 (크기 추가 확대) */}
      <img
        className="w-80 h-96 left-10.5 top-72 absolute pointer-events-none object-contain z-20"
        src={bagImage}
        alt="MCM 가방"
      />

      {/* 안내 문구 */}
      <div className="left-0 right-0 top-159.25 absolute text-center text-neutral-50 text-2xl font-bold font-['Pretendard_Variable'] z-20">
        {isTagging ? "태깅 중..." : "NFC를 태깅해 주세요"}
      </div>
    </div>
  );
};

export default NfcTagging;
