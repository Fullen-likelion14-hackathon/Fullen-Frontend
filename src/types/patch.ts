import type { AIPatchApiType } from "@/types/ai";

// 패치 적용 면 타입
export type PatchSide = "FRONT" | "BACK";

// AI 패치 저장 요청 타입
export interface SavePatchRequest {
  // 서버 전송용 패치 프레임 타입
  type: AIPatchApiType;

  // 저장 대상 AI 패치 S3 이미지 URL
  imgUrl: string;
}

// 서버 저장 패치 정보 타입
export interface SavedPatchData {
  // 서버 발급 패치 id
  patchId: number;

  // 저장 패치 프레임 타입
  type: AIPatchApiType;

  // 저장 패치 이미지 URL
  imgUrl: string;
}

// AI 패치 저장 응답 타입
export interface SavePatchResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 서버 저장 패치 정보
  data: SavedPatchData;
}

// 저장 패치 목록 조회 응답 타입
export interface GetPatchesResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 서버 저장 패치 목록
  data: SavedPatchData[];
}

// 가방 패치 적용 요청 타입
export interface SavePatchPositionRequest {
  // 사용자 가방 id
  userBagId: number;

  // 적용 대상 패치 id
  patchId: number;

  // 패치 적용 면
  side: PatchSide;

  // 패치 X 좌표
  posX: number;

  // 패치 Y 좌표
  posY: number;

  // 패치 회전 각도
  rotation: number;
}

// 가방 적용 패치 정보 타입
export interface PatchPositionData {
  // 서버 발급 패치 위치 id
  patchPositionId: number;

  // 사용자 가방 id
  userBagId: number;

  // 저장 패치 id
  patchId: number;

  // 패치 이미지 URL
  imgUrl: string;

  // 패치 적용 면
  side: PatchSide;

  // 패치 X 좌표
  posX: number;

  // 패치 Y 좌표
  posY: number;

  // 패치 회전 각도
  rotation: number;
}

// 가방 패치 적용 응답 타입
export interface SavePatchPositionResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 가방 적용 패치 정보
  data: PatchPositionData;
}

// 가방 적용 패치 목록 조회 응답 타입
export interface GetPatchPositionsResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 가방 적용 패치 목록
  data: PatchPositionData[];
}

// 패치 위치 수정 요청 타입
export interface UpdatePatchPositionRequest {
  // 패치 적용 면
  side: PatchSide;

  // 패치 X 좌표
  posX: number;

  // 패치 Y 좌표
  posY: number;

  // 패치 회전 각도
  rotation: number;
}

// 패치 위치 수정 응답 타입
export interface UpdatePatchPositionResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 수정 패치 위치 정보
  data: PatchPositionData;
}

// 패치 위치 삭제 응답 타입
export interface DeletePatchPositionResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 삭제 결과 정보
  data: string;
}

// 저장 패치 삭제 응답 타입
export interface DeletePatchResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // 삭제 결과 정보
  data: string;
}
