// ============================================================
// CategoryFeed.tsx — 카테고리 내 피드 목록 페이지
// Passport 페이지에서 카테고리 카드 클릭 시 진입. 디자인 작업 전 임시 뼈대.
// ============================================================

import { useParams } from "react-router-dom";

const CategoryFeed = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <p className="text-sm text-muted-foreground">
        카테고리 피드 목록 페이지 (디자인 예정) — categoryId: {categoryId}
      </p>
    </div>
  );
};

export default CategoryFeed;
