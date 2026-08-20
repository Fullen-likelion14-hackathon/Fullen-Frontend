import type { PatchSide } from "@/types/patch";

// 이니셜 서버 정보 타입
export interface InitialData {
  initialId: number;

  userBagId: number;

  initialPhrase: string;

  color: string;

  isBold: boolean;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  layer: number;
}

// 이니셜 목록 조회 응답 타입
export interface GetInitialsResponse {
  success: boolean;

  code: number;

  message: string;

  data: InitialData[];
}

// 이니셜 적용 요청 타입
export interface SaveInitialRequest {
  userBagId: number;

  initialPhrase: string;

  color: string;

  isBold: boolean;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  layer: number;
}

// 이니셜 적용 응답 타입
export interface SaveInitialResponse {
  success: boolean;

  code: number;

  message: string;

  data: InitialData;
}

// 이니셜 수정 요청 타입
export interface UpdateInitialRequest {
  color: string;

  isBold: boolean;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  layer: number;
}

// 이니셜 수정 응답 타입
export interface UpdateInitialResponse {
  success: boolean;

  code: number;

  message: string;

  data: InitialData;
}

// 이니셜 삭제 응답 타입
export interface DeleteInitialResponse {
  success: boolean;

  code: number;

  message: string;

  data: string;
}
