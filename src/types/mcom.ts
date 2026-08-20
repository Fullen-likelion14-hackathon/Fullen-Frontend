export type MCoMTab = "country" | "global";

export type MCoMScope = "GERMANY" | "GLOBAL";

export interface PostCardResponse {
  postId: number;
  thumbnailURL: string;
}

export interface PostPreviewResponse {
  postId: number;
  nationFlagURL: string;
  nationKRName: string;
  journeyType: string;
  date: string;
  thumbnailURL: string;
}

export interface MCoMArchiveResponse {
  success: boolean;
  code: number;
  message: string;
  data: PostCardResponse[];
}

export interface MCoMPreviewResponse {
  success: boolean;
  code: number;
  message: string;
  data: PostPreviewResponse;
}

// 게시물 상세 조회 사진
export interface PostPhotoResponse {
  photoId: number;
  imgURL: string;
}

// 게시물 상세 조회
export interface PostDetailResponse {
  postId: number;
  nationFlagURL: string;
  nationKRName: string;
  journeyType: string;
  date: string;
  photoList: PostPhotoResponse[];
  comment: string;
  photoCount: number;
  commentLength: number;
  isPublic: boolean;
}

// 게시물 상세 조회 API 응답
export interface MCoMDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: PostDetailResponse;
}
