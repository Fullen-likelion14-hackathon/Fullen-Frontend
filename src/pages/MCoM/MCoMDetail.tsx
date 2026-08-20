import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useMCoMPreviewQuery } from "@/hooks/queries/mcom/useMCoMPreviewQuery";

export default function MCoMDetail() {
  const navigate = useNavigate();
  const { feedId } = useParams();

  const postId = Number(feedId);
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  const { data: feed, isPending, isError } = useMCoMPreviewQuery(isValidPostId ? postId : 0);

  if (!isValidPostId) {
    return <div>잘못된 게시물입니다.</div>;
  }

  if (isPending) {
    return <div>게시물을 불러오는 중입니다.</div>;
  }

  if (isError || !feed) {
    return <div>피드 데이터를 불러올 수 없습니다.</div>;
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
              <h1 className="mt-1 text-[25px] font-bold">{feed.nationKRName}</h1>

              <p className="mt-1 text-[15px] font-bold">{feed.journeyType}</p>
            </div>

            <img
              src={feed.nationFlagURL}
              alt={`${feed.nationKRName} 국기`}
              className="absolute right-5 w-10"
            />
          </div>
        </header>

        <p className="pb-3 text-center text-[15px] font-semibold text-[#A0A0A0]">{feed.date}</p>

        <img
          src={feed.thumbnailURL}
          alt={feed.nationKRName}
          className="mx-auto my-2 h-106 w-97 object-cover"
        />
      </div>
    </div>
  );
}
