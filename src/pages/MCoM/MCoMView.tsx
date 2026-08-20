import { useLocation, useParams, useNavigate } from "react-router-dom";

import MCoMFeedSlider from "@/components/mcom/MCoMFeedSlider";
import PageHeader from "@/components/common/PageHeader";
import { useMCoMArchiveQuery } from "@/hooks/queries/mcom/useMCoMArchiveQuery";
import { useMCoMPreviewQuery } from "@/hooks/queries/mcom/useMCoMPreviewQuery";

import type { MCoMTab } from "@/types/mcom";

export default function MCoMView() {
  const { feedId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const postId = Number(feedId);
  const tab: MCoMTab = location.state?.tab ?? "country";

  // 현재 게시물
  const { data: feed, isPending, isError } = useMCoMPreviewQuery(postId);

  // 현재 탭의 게시물 전체 목록
  const { data: archive = [] } = useMCoMArchiveQuery(tab);

  const currentIndex = archive.findIndex((item) => item.postId === postId);

  const previousPostId = currentIndex > 0 ? archive[currentIndex - 1].postId : null;

  const nextPostId =
    currentIndex !== -1 && currentIndex < archive.length - 1
      ? archive[currentIndex + 1].postId
      : null;

  // 이전 게시물
  const { data: previousFeed } = useMCoMPreviewQuery(previousPostId ?? 0);

  // 다음 게시물
  const { data: nextFeed } = useMCoMPreviewQuery(nextPostId ?? 0);

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (isError || !feed) {
    return <div>피드 데이터 없음</div>;
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col bg-[#242D41] text-white">
        <PageHeader
          title={tab === "country" ? "현재 위치한 나라" : "글로벌"}
          onBackClick={() =>
            navigate("/mcom", {
              state: {
                tab,
              },
            })
          }
        />
        <MCoMFeedSlider
          feed={feed}
          previousFeed={previousFeed ?? null}
          nextFeed={nextFeed ?? null}
          tab={tab}
        />
      </div>
    </div>
  );
}
