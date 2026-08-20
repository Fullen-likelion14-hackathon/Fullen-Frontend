import patchResult1 from "@/assets/images/patchResult1.png";
import patchResult2 from "@/assets/images/patchResult2.png";
import patchResult3 from "@/assets/images/patchResult3.png";

// AI 패치 생성 결과 타입임
export interface AIPatchResultItem {
  id: number;
  image: string;
}

// TODO: 실제 AI 패치 생성 API 연결 후 응답 데이터로 변경 예정임
export const aiPatchResultMock: AIPatchResultItem[] = [
  {
    id: 1,
    image: patchResult1,
  },
  {
    id: 2,
    image: patchResult2,
  },
  {
    id: 3,
    image: patchResult3,
  },
];
