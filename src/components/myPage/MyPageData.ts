import testBag from "@/assets/images/testBag.png";

export interface OrderData {
  id: number;
  type: string;
  date: string;
  image: string;
}
export interface DdpProductData {
  name: string;
  size: string;
  image: string;
  serialNumber: string;
  registeredAt: string;
}
export const orders: OrderData[] = [
  { id: 1, type: "나의 커스텀", date: "2026.08.16", image: testBag },
  { id: 2, type: "1:1 커스텀", date: "2026.07.06", image: testBag },
  { id: 3, type: "나의 커스텀", date: "2026.05.21", image: testBag },
];
export const ddpProduct: DdpProductData = {
  name: "Ottomar 비세토스 위켄더",
  size: "50.5 cm (19.9 in)",
  image: testBag,
  serialNumber: "MCM-26-KR-123456",
  registeredAt: "2026.08.03",
};
