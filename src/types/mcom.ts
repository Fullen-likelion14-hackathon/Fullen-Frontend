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
