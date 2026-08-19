import api from "@/api/axios";

import type { SavePatchRequest, SavePatchResponse } from "@/types/patch";

// AI 생성 패치 서버 저장 API
export const savePatch = async (request: SavePatchRequest): Promise<SavePatchResponse> => {
  const response = await api.post<SavePatchResponse>("/api/patches", request);

  return response.data;
};
