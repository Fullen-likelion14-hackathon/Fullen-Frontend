// 서버 AI 패치 프레임 타입
export type AIPatchApiType = "TICKET" | "STAMP" | "LABEL";

// AI 여행 분석 결과 타입
export interface AIAnalysis {
  // 로그인 사용자 이름
  username: string;

  // AI 분석 여행 스타일 이름
  travelStyle: string;

  // AI 분석 여행 스타일 상세 설명
  detail: string;

  // AI 추천 작가 id 목록
  artistIdList: number[];

  // AI 분석 해시태그 목록
  hashtagList: string[];
}

// AI 여행 분석 조회 응답 타입
export interface AIAnalysisResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // AI 여행 분석 결과
  data: AIAnalysis;
}

// AI 패치 생성 요청 타입
export interface GenerateAIPatchRequest {
  // 피드에 등록된 사진 id
  photoId: number;

  // AI 패치 생성용 여행 스타일 문구
  message: string;

  // 서버 전송용 패치 프레임 타입
  type: AIPatchApiType;

  // 사용자가 선택한 작가 id
  artistId: number;
}

// AI 패치 생성 결과 데이터 타입
export interface GenerateAIPatchData {
  // S3 AI 패치 이미지 URL 목록
  answer: string[];
}

// AI 패치 생성 응답 타입
export interface GenerateAIPatchResponse {
  // API 성공 여부
  success: boolean;

  // 서버 응답 코드
  code: number;

  // 서버 응답 메시지
  message: string;

  // AI 패치 생성 결과
  data: GenerateAIPatchData;
}
