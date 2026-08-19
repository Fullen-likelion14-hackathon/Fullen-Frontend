import api from "@/api/axios";

import type {
  DeletePhotoResponse,
  PhotoDetailResponse,
  PhotoListResponse,
  PhotoScope,
} from "@/types/photo";

// 유저별 사진 전체 조회
export const getPhotos = async (scope?: PhotoScope): Promise<PhotoListResponse> => {
  const response = await api.get<PhotoListResponse>("/api/photos", {
    params: scope ? { scope } : undefined,
  });

  return response.data;
};

// 사진 상세 조회
export const getPhoto = async (photoId: number): Promise<PhotoDetailResponse> => {
  const response = await api.get<PhotoDetailResponse>(`/api/photos/${photoId}`);

  return response.data;
};

// 사진 삭제
export const deletePhoto = async (photoId: number): Promise<DeletePhotoResponse> => {
  const response = await api.delete<DeletePhotoResponse>(`/api/photos/${photoId}`);

  return response.data;
};
