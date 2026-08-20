import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import editIcon from "@/assets/icons/edit2.png";
import deleteIcon from "@/assets/icons/delete2.png";
import { useJourney } from "@/hooks/queries/useJourney";
import { useDeleteJourney } from "@/hooks/queries/useDeleteJourney";
import { usePosts } from "@/hooks/queries/usePosts";

export default function CategoryFeed() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutateAsync: deleteJourney, isPending: isDeleting } = useDeleteJourney();

  const { data: journeyDetail, isLoading: isJourneyLoading } = useJourney(Number(categoryId));
  const { data: posts, isLoading: isPostsLoading } = usePosts(Number(categoryId));

  const handleDeleteCategory = async () => {
    if (!categoryId || isDeleting) return;

    try {
      await deleteJourney(Number(categoryId));
      setIsDeleteOpen(false);
      navigate("/passport", { replace: true });
    } catch (error) {
      console.error(error);
      // TODO: 실패 시 사용자 안내(토스트 등) 추가 필요
    }
  };

  if (isJourneyLoading || !journeyDetail) {
    return <div>불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="relative mx-auto min-h-screen w-full max-w-97.5 overflow-hidden bg-white">
        {/* 헤더 */}
        <header className="relative h-52.5 bg-[#F9F4F0] pb-6 pt-9">
          <div className="mt-[23px]">
            <div className="flex flex-col items-center gap-2.5">
              <div className="h-7 w-11 overflow-hidden outline outline-[0.75px] outline-stone-100">
                <img
                  src={journeyDetail.flagImgUrl}
                  alt={`${journeyDetail.nationKRName} 국기`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="text-center">
                <h1
                  className="text-3xl font-bold tracking-wide text-slate-800"
                  style={{ fontFamily: "Paperlogy" }}
                >
                  {journeyDetail.nationKRName}
                </h1>
                <p
                  className="mt-1 text-lg font-semibold tracking-tight text-slate-800"
                  style={{ fontFamily: "Paperlogy" }}
                >
                  {journeyDetail.type}
                </p>
                <div
                  className="flex items-center justify-center gap-0.5 text-base font-semibold text-slate-800/50"
                  style={{ fontFamily: "Paperlogy" }}
                >
                  <span>{journeyDetail.startDate}</span>
                  <span className="text-lg">~</span>
                  <span>{journeyDetail.endDate}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate(-1)}
              className="mt-[23px] absolute left-5 top-9 flex h-8 w-8 items-center justify-center"
            >
              <span className="block h-4.5 w-4.5 rotate-45 border-b-[3px] border-l-[3px] border-[#CFCDCE]" />
            </button>

            <div className="mt-[23px] absolute right-5 top-9 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="카테고리 수정"
                onClick={() =>
                  navigate(`/passport/${categoryId}/edit`, {
                    state: {
                      coverImageUrl: journeyDetail.coverImgUrl,
                      country: journeyDetail.nationKRName,
                      travelType: journeyDetail.type,
                      startDate: journeyDetail.startDate,
                      endDate: journeyDetail.endDate,
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
        {isPostsLoading ? (
          <div className="py-10 text-center text-sm text-stone-400">불러오는 중...</div>
        ) : !posts || posts.length === 0 ? (
          <div className="py-10 text-center text-sm text-stone-400">
            아직 등록된 게시물이 없어요
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.75 pb-32">
            {posts.map((post) => (
              <button
                key={post.postId}
                type="button"
                onClick={() => navigate(`/passport/${categoryId}/${post.postId}`)}
                className="aspect-[131/144] w-full overflow-hidden bg-stone-300"
              >
                <img src={post.thumbnailURL} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

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
