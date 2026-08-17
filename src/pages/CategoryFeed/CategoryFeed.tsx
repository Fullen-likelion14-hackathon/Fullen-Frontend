import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import editIcon from "@/assets/icons/edit2.png";
import deleteIcon from "@/assets/icons/delete2.png";
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
        <header className="relative h-52.5 bg-[#F9F4F0] pb-6 pt-9">
          <div className="mt-[23px]">
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
                  className="flex items-center justify-center gap-0.5 text-base font-semibold text-slate-800/50"
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
              onClick={() => navigate(-1)}
              className="mt-[23px] absolute left-5 top-9 flex h-8 w-8 items-center justify-center"
            >
              <span className="block h-4.5 w-4.5 rotate-45 border-b-[3px] border-l-[3px] border-[#CFCDCE]" />
            </button>

            {/* 수정 / 삭제 버튼 */}
            <div className="mt-[23px] absolute right-5 top-9 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="카테고리 수정"
                onClick={() =>
                  // CategoryEdit이 location.state로 기존 값을 초기화하므로 함께 전달
                  // ⚠️ CategoryFeedData에 별도 표지사진(coverImage) 필드가 없어서
                  // 임시로 feeds[0] 사진을 표지사진 자리에 사용 중. 추후 coverImage 필드
                  // 자체를 CategoryFeedData/생성 로직에 추가하는 걸 권장
                  navigate(`/passport/${categoryId}/edit`, {
                    state: {
                      coverImageUrl: category.feeds[0]?.thumbnail,
                      country: category.countryName,
                      travelType: category.title,
                      startDate: category.startDate,
                      endDate: category.endDate,
                    },
                  })
                }
                className="flex size-9 items-center justify-center rounded-md bg-white"
              >
                <img src={editIcon} alt="" className="size-9 object-contain" />
              </button>
              <button
                type="button"
                aria-label="카테고리 삭제"
                onClick={() => setIsDeleteOpen(true)}
                className="flex size-9 items-center justify-center rounded-md bg-white"
              >
                <img src={deleteIcon} alt="" className="size-9 object-contain" />
              </button>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[7px] bg-[#A3642B]" />
        </header>

        {/* 피드 그리드 */}
        <div className="grid grid-cols-3 gap-0.75 pb-32">
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
          <div className="flex justify-center pb-[60px] pt-6">
            <button
              type="button"
              onClick={() => navigate(`/passport/${categoryId}/new`)}
              className="flex h-12 w-62.5 items-center justify-center gap-2.5 overflow-hidden rounded-[100px] bg-white/80 shadow-[0px_0px_5px_0px_rgba(25,39,60,0.30),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
            >
              <span
                className="text-xl font-semibold tracking-tight text-slate-800"
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
