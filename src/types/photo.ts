// 대륙 필터
export type PhotoScope =
  "ASIA" | "EUROPE" | "NORTH_AMERICA" | "SOUTH_AMERICA" | "AFRICA" | "OCEANIA" | "ANTARCTICA";

// 사진 전체 조회에서 사용하는 사진 정보
export interface Photo {
  photoId: number;
  imgURL: string;
}

// 사진 상세 정보
export interface PhotoDetail {
  photoId: number;
  imgURL: string;
  nationKRName: string;
  journeyType: string;
  date: string;
}

// 사진 전체 조회 응답
export interface PhotoListResponse {
  success: boolean;
  code: number;
  message: string;
  data: Photo[];
}

// 사진 상세 조회 응답
export interface PhotoDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: PhotoDetail;
}

// 사진 삭제 응답
export interface DeletePhotoResponse {
  success: boolean;
  code: number;
  message: string;
  data: string;
}
