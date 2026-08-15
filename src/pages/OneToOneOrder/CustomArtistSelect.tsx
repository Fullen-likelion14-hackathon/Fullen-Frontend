import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ArtistSlider from "@/components/oneToOneOrder/ArtistSlider";

import artistImage1 from "@/assets/images/artist1.png";
import artistImage2 from "@/assets/images/artist1.png";
import artistImage3 from "@/assets/images/artist1.png";

const artists = [
  {
    id: 1,
    image: artistImage1,
    name: "빈센트 반 고흐",
  },
  {
    id: 2,
    image: artistImage2,
    name: "작가 2",
  },
  {
    id: 3,
    image: artistImage3,
    name: "작가 3",
  },
];

export default function CustomArtistSelect() {
  const navigate = useNavigate();

  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSelectButtonClick = () => {
    if (selectedArtistId === null) return;

    navigate("/onetooneorder/request", {
      state: {
        selectedArtistId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F4F0]">
      <PageHeader title="작가 선택" />

      <ArtistSlider
        artists={artists}
        selectedArtistId={selectedArtistId}
        onSelectArtist={setSelectedArtistId}
      />

      <div className="px-6 pb-10 pt-6">
        {/* 다른 작가 더보기 */}
        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className="flex w-full items-center justify-between py-4"
        >
          <span className="text-[18px] font-bold text-[#192A40]">다른 작가 더보기</span>

          <ChevronDown
            className={`transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
            size={30}
            color="#192A40"
          />
        </button>

        {/* 작가 선택 버튼 */}
        <button
          type="button"
          disabled={selectedArtistId === null}
          onClick={handleSelectButtonClick}
          className={`mt-8 h-16 w-full rounded-[20px] text-[18px] font-bold shadow-md transition ${
            selectedArtistId === null
              ? "cursor-not-allowed bg-[#D9D9D9] text-white"
              : "bg-[#162B47] text-white"
          }`}
        >
          해당 작가 선택하기
        </button>
      </div>
    </div>
  );
}
