export type BagSide = "FRONT" | "BACK";

export interface PatchLocation {
  side: BagSide;

  // API 전송용 UV 좌표
  posX: number;
  posY: number;
  rotation: number;

  // 2D 미리보기용 좌표
  previewX: number;
  previewY: number;
}
