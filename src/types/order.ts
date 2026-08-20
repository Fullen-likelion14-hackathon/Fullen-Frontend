// 기존 주문 정보 타입
export interface Order {
  type: string;

  orderId: number;

  frontImgUrl: string;

  backImgUrl: string;

  createdAt: string;
}

// 커스텀 주문 생성 요청 타입
export interface CreateCustomOrderRequest {
  userBagId: number;

  customFrontImgUrl: string;

  customBackImgUrl: string;
}

// 커스텀 주문 생성 데이터 타입
export interface CustomOrderData {
  orderId: number;

  userBagId: number;

  orderStatus: string;

  bagName: string;

  bagSize: string;

  bagFrontImgUrl: string;

  bagBackImgUrl: string;

  customFrontImgUrl?: string;

  customBackImgUrl?: string;
}

// 커스텀 주문 생성 응답 타입
export interface CreateCustomOrderResponse {
  success: boolean;

  code: number;

  message: string;

  data: CustomOrderData;
}

// 주문 화면 패치 스냅샷 타입
export interface CustomOrderPatchSnapshot {
  patchPositionId: number;

  patchId: number;

  imgUrl: string;
}

// 커스텀 주문 화면 이동 상태 타입
export interface CustomOrderNavigationState {
  orderId: number;

  userBagId: number;

  orderStatus: string;

  bagName: string;

  bagSize: string;

  customFrontImgUrl: string;

  customBackImgUrl: string;

  patches: CustomOrderPatchSnapshot[];
}
