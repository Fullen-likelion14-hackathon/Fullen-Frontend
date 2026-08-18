import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import editIcon from "@/assets/icons/edit2.png";
import deleteIcon from "@/assets/icons/delete2.png";
import { categoryFeedMockData } from "./categoryFeed.mock";
import { useJourney } from "@/hooks/queries/useJourney";
import { useDeleteJourney } from "@/hooks/queries/useDeleteJourney";

export default function CategoryFeed() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutateAsync: deleteJourney, isPending: isDeleting } = useDeleteJourney();

  // 실제 생성 시 업로드한 표지사진(coverImgUrl)을 가져오기 위한 단일 조회.
  // TODO: 피드 목록 자체는 아직 categoryFeedMockData 사용 중이라 헤더 정보는 목업, coverImgUrl만 실데이터로 보강
  const { data: journeyDetail } = useJourney(Number(categoryId));

  const category = categoryFeedMockData.find((item) => item.categoryId === Number(categoryId));

  if (!category) {
    return <div>카테고리 데이터 없음</div>;
  }

  const handleDeleteCategory = async () => {
    if (!categoryId || isDeleting) return;

    try {
      await deleteJourney(Number(categoryId));
      setIsDeleteOpen(false);
      navigate("/passport");
    } catch (error) {
      console.error(error);
      // TODO: 실패 시 사용자 안내(토스트 등) 추가 필요
    }
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
                  // journeyDetail(실제 API 응답)을 우선 사용, 아직 로딩 전이면 목업으로 임시 fallback
                  navigate(`/passport/${categoryId}/edit`, {
                    state: {
                      coverImageUrl: journeyDetail?.coverImgUrl ?? category.feeds[0]?.thumbnail,
                      country: journeyDetail?.nationKRName ?? category.countryName,
                      travelType: journeyDetail?.type ?? category.title,
                      startDate: journeyDetail?.startDate ?? category.startDate,
                      endDate: journeyDetail?.endDate ?? category.endDate,
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
