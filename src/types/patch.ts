import type { AIPatchApiType } from "@/types/ai";

// 패치 적용 면 타입
export type PatchSide = "FRONT" | "BACK";

// AI 패치 저장 요청 타입
export interface SavePatchRequest {
  type: AIPatchApiType;

  imgUrl: string;
}

// 서버 저장 패치 정보 타입
export interface SavedPatchData {
  patchId: number;

  type: AIPatchApiType;

  imgUrl: string;
}

// AI 패치 저장 응답 타입
export interface SavePatchResponse {
  success: boolean;

  code: number;

  message: string;

  data: SavedPatchData;
}

// 저장 패치 목록 조회 응답 타입
export interface GetPatchesResponse {
  success: boolean;

  code: number;

  message: string;

  data: SavedPatchData[];
}

// 가방 패치 적용 요청 타입
export interface SavePatchPositionRequest {
  userBagId: number;

  patchId: number;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  flipped: boolean;

  layer: number;
}

// 가방 적용 패치 정보 타입
export interface PatchPositionData {
  patchPositionId: number;

  userBagId: number;

  patchId: number;

  imgUrl: string;

  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  flipped: boolean;

  layer: number;

  isEditable?: boolean;
}

// 가방 패치 적용 응답 타입
export interface SavePatchPositionResponse {
  success: boolean;

  code: number;

  message: string;

  data: PatchPositionData;
}

// 가방 적용 패치 목록 조회 응답 타입
export interface GetPatchPositionsResponse {
  success: boolean;

  code: number;

  message: string;

  data: PatchPositionData[];
}

// 패치 위치 수정 요청 타입
export interface UpdatePatchPositionRequest {
  side: PatchSide;

  posX: number;

  posY: number;

  rotation: number;

  scale: number;

  flipped: boolean;

  layer: number;
}

// 패치 위치 수정 응답 타입
export interface UpdatePatchPositionResponse {
  success: boolean;

  code: number;

  message: string;

  data: PatchPositionData;
}

// 패치 위치 삭제 응답 타입
export interface DeletePatchPositionResponse {
  success: boolean;

  code: number;

  message: string;

  data: string;
}

// 저장 패치 삭제 응답 타입
export interface DeletePatchResponse {
  success: boolean;

  code: number;

  message: string;

  data: string;
}
