import type { AIPatchApiType } from "@/types/ai";

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
