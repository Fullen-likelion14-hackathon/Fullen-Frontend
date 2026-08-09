import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { mcomFeedMockData } from "@/components/mcom/mcomFeedData";

export default function MCoMDetail() {
  const navigate = useNavigate();
  const { feedId } = useParams();

  const feed = mcomFeedMockData.find((item) => item.feedId === Number(feedId));

  if (!feed) {
    return <div>피드 데이터 없음</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="mx-auto min-h-screen w-full max-w-97.5 bg-[#FEFEFE]">
        <header className="bg-[#FEFEFE] pb-1 pt-11">
          <div className="relative flex items-center justify-center px-5">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate(-1)}
              className="absolute left-5 text-[#A0A0A0]"
            >
              <ChevronLeft size={36} strokeWidth={2.5} />
            </button>
            <div className="text-center text-black">
              <h1 className="mt-1 text-[25px] font-bold">{feed.countryName}</h1>

              <p className="mt-1 text-[15px] font-bold">{feed.title}</p>
            </div>

            {/* 국기 */}
            <img
              src={feed.flagImage}
              alt={`${feed.countryName} 국기`}
              className="absolute right-5 w-10"
            />
          </div>
        </header>
        <p className=" text-[15px] text-center font-semibold pb-3 text-[#A0A0A0]">{feed.date}</p>
        <img
          src={feed.thumbnail}
          alt={feed.title}
          className="mx-auto my-2 w-97 h-106 object-cover"
        />
        <p className="mx-6 my-10 text-[13px]">{feed.content}</p>
      </div>
    </div>
  );
}
