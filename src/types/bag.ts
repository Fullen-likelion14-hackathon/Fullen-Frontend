// 소유한 가방 리스트
export interface BagListItem {
  userBagId: number;
  bagName: string;
  bagFrontImgUrl: string;
}

// 소유한 가방 상세
export interface BagDetail {
  userBagId: number;
  bagName: string;
  bagSize: string;
  bagFrontImgUrl: string;
  bagBackImgUrl: string;
}
