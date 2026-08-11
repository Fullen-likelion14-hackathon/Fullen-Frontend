import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import ArtistSlider from "@/components/oneToOneOrder/ArtistSlider";
import { Button } from "@/components/ui/button";

import artistImage1 from "@/assets/images/artist1.png";
import artistImage2 from "@/assets/images/artist1.png";
import artistImage3 from "@/assets/images/artist1.png";

const artists = [
  {
    id: 1,
    image: artistImage1,
    name: "빈센트 반 고흐",
    description: "Seohu님의 Travel Style에 어울리는 성주재단 후원 아티스트를 추천합니다.",
  },
  {
    id: 2,
    image: artistImage2,
    name: "작가 2",
    description: "Seohu님의 Travel Style에 어울리는 성주재단 후원 아티스트를 추천합니다.",
  },
  {
    id: 3,
    image: artistImage3,
    name: "작가 3",
    description: "Seohu님의 Travel Style에 어울리는 성주재단 후원 아티스트를 추천합니다.",
  },
];

export default function CustomArtistSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F4F0]">
      <PageHeader title="작가 선택" />

      <ArtistSlider artists={artists} />

      <div className="flex flex-col items-center gap-3 py-10">
        <Button className="h-14 w-87 rounded-2xl border-3 border-[#C9C9C9] bg-white text-[20px] text-[#727272]">
          다른 작가 더보기
        </Button>

        <Button
          className="h-14 w-87 rounded-2xl border-3 border-[#C9C9C9] bg-white text-[20px] text-[#727272]"
          onClick={() => navigate("/custom/request")}
        >
          선택하기
        </Button>
      </div>
    </div>
  );
}
