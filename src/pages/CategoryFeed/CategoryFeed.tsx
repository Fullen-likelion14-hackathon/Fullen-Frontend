import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import editIcon from "@/assets/icons/edit.png";
import deleteIcon from "@/assets/icons/delete.png";
import { categoryFeedMockData } from "./categoryFeed.mock";
import { feedDetailMockData } from "@/pages/FeedDetail/feedDetail.mock";

export default function CategoryFeed() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const category = categoryFeedMockData.find((item) => item.categoryId === Number(categoryId));

  if (!category) {
    return <div>카테고리 데이터 없음</div>;
  }

  const handleDeleteCategory = () => {
    // TODO: 카테고리 삭제 API 연동 (지금은 목업 배열에서 직접 제거)
    const categoryIndex = categoryFeedMockData.findIndex(
      (item) => item.categoryId === Number(categoryId),
    );
    if (categoryIndex !== -1) {
      categoryFeedMockData.splice(categoryIndex, 1);
    }

    // 이 카테고리에 속한 피드 상세 데이터도 함께 제거
    for (let i = feedDetailMockData.length - 1; i >= 0; i--) {
      if (feedDetailMockData[i].categoryId === Number(categoryId)) {
        feedDetailMockData.splice(i, 1);
      }
    }

    setIsDeleteOpen(false);
    navigate("/passport");
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="relative mx-auto min-h-screen w-full max-w-97.5 overflow-hidden bg-white">
        {/* 헤더 */}
        <header className="relative bg-stone-100 pb-6 pt-9">
          <div className="flex flex-col items-center gap-2.5">
            <div className="h-7 w-11 overflow-hidden outline outline-[0.75px] outline-stone-100">
              <img
                src={category.flagImage}
                alt={`${category.countryName} 국기`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="text-center">
              <h1
                className="text-3xl font-bold tracking-wide text-slate-800"
                style={{ fontFamily: "Paperlogy" }}
              >
                {category.countryName}
              </h1>
              <p
                className="mt-1 text-lg font-semibold tracking-tight text-slate-800"
                style={{ fontFamily: "Paperlogy" }}
              >
                {category.title}
              </p>
              <div
                className="mt-1 flex items-center justify-center gap-0.5 text-base font-semibold text-slate-800/50"
                style={{ fontFamily: "Paperlogy" }}
              >
                <span>{category.startDate}</span>
                <span className="text-lg">~</span>
                <span>{category.endDate}</span>
              </div>
            </div>
          </div>

          {/* 뒤로가기 버튼: 아이콘 이미지가 저해상도(14x24)라 작게 쓰면 뭉개져 보여서
              같은 색상(#CFCDCE)의 CSS 화살표로 대체 */}
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => navigate("/passport")}
            className="absolute left-5 top-9 flex h-6 w-6 items-center justify-center"
          >
            <span className="block h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 border-[#CFCDCE]" />
          </button>

          {/* 수정 / 삭제 버튼 */}
          <div className="absolute right-5 top-9 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="카테고리 수정"
              onClick={() => navigate(`/passport/${categoryId}/edit`)}
              className="flex size-9 items-center justify-center rounded-md bg-white"
            >
              <img src={editIcon} alt="" className="size-8 object-contain" />
            </button>
            <button
              type="button"
              aria-label="카테고리 삭제"
              onClick={() => setIsDeleteOpen(true)}
              className="flex size-9 items-center justify-center rounded-md bg-white"
            >
              <img src={deleteIcon} alt="" className="size-8 object-contain" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-yellow-700" />
        </header>

        {/* 피드 그리드 */}
        <div className="mt-0.75 grid grid-cols-3 gap-0.75 pb-32">
          {category.feeds.map((feed) => (
            <button
              key={feed.feedId}
              type="button"
              onClick={() => navigate(`/passport/${categoryId}/${feed.feedId}`)}
              className="aspect-[131/144] w-full overflow-hidden bg-stone-300"
            >
              <img src={feed.thumbnail} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {/* 새 게시물 추가 */}
        <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-97.5">
          <div className="flex justify-center pb-9 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/passport/${categoryId}/new`)}
              className="rounded-full bg-white/40 px-6 py-2 shadow-[0px_0px_5px_0px_rgba(94,140,136,0.25)]"
            >
              <span
                className="text-xl font-semibold tracking-tight text-slate-800/80"
                style={{ fontFamily: "Paperlogy" }}
              >
                새 게시물 추가
              </span>
            </button>
          </div>
        </div>

        <DeleteConfirmDialog
          open={isDeleteOpen}
          title="해당 여행을 삭제하시겠습니까?"
          description="삭제한 여행은 복구할 수 없습니다."
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteCategory}
        />
      </div>
    </div>
  );
}