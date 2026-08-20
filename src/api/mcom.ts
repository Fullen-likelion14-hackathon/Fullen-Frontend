import api from "@/api/axios";

import type {
  MCoMArchiveResponse,
  MCoMPreviewResponse,
  MCoMDetailResponse,
  MCoMScope,
} from "@/types/mcom";

// MCoM 게시물 아카이브 조회
export const getMCoMArchive = async (scope: MCoMScope): Promise<MCoMArchiveResponse> => {
  const response = await api.get<MCoMArchiveResponse>("/api/posts/archive", {
    params: {
      scope,
    },
  });

  return response.data;
};

// MCoM 게시물 미리보기 조회
export const getMCoMPreview = async (postId: number): Promise<MCoMPreviewResponse> => {
  const response = await api.get<MCoMPreviewResponse>(`/api/posts/${postId}/preview`);

  return response.data;
};
// 게시물 상세 조회
export const getMCoMDetail = async (postId: number) => {
  const response = await api.get<MCoMDetailResponse>(`/api/posts/${postId}`);

  return response.data.data;
};
