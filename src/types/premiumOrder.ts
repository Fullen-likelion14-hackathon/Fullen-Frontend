import type { BagSide } from "@/types/patchLocation";

// 1:1 커스텀 주문 요청
export interface PremiumOrderRequest {
  userBagId: number;
  photoId: number;
  artistId: number;
  requestDetail: string;

  side: BagSide;

  // 3D 가방 부착 위치
  posX: number;
  posY: number;
  rotation: number;

  // 2D 상세보기 위치 표시용 좌표
  previewX: number;
  previewY: number;
}

// 1:1 커스텀 주문 생성 결과
export interface PremiumOrder {
  premiumOrderId: number;
  userBagId: number;
  photoId: number;
  artistId: number;
  requestDetail: string;

  side: BagSide;

  posX: number;
  posY: number;
  rotation: number;

  previewX: number;
  previewY: number;

  orderStatus: string;
}

// 1:1 커스텀 주문 API 응답
export interface PremiumOrderResponse {
  success: boolean;
  code: number;
  message: string;
  data: PremiumOrder;
}

// 1:1 상세 주문내역
export interface PremiumOrderDetail {
  premiumOrderId: number;
  photoImgUrl: string;
  artistName: string;
  artistImgUrl: string;
  introSummary: string;
  requestDetail: string;

  // 2D 위치 표시용
  previewX: number;
  previewY: number;
}
