import api from "@/api/axios";

import type { AIPatchApiType } from "@/types/ai";

import type {
  DeletePatchPositionResponse,
  DeletePatchResponse,
  GetPatchPositionsResponse,
  GetPatchesResponse,
  SavePatchPositionRequest,
  SavePatchPositionResponse,
  SavePatchRequest,
  SavePatchResponse,
  UpdatePatchPositionRequest,
  UpdatePatchPositionResponse,
} from "@/types/patch";

// AI 생성 패치 서버 저장 API
export const savePatch = async (request: SavePatchRequest): Promise<SavePatchResponse> => {
  const response = await api.post<SavePatchResponse>("/api/patches", request);

  return response.data;
};

// 저장 패치 목록 조회 API
export const getPatches = async (type: AIPatchApiType): Promise<GetPatchesResponse> => {
  const response = await api.get<GetPatchesResponse>("/api/patches", {
    params: {
      type,
    },
  });

  return response.data;
};

// 가방 적용 패치 목록 조회 API
export const getPatchPositions = async (userBagId: number): Promise<GetPatchPositionsResponse> => {
  const response = await api.get<GetPatchPositionsResponse>("/api/patches/positions", {
    params: {
      userBagId,
    },
  });

  return response.data;
};

// 가방 패치 적용 API
export const savePatchPosition = async (
  request: SavePatchPositionRequest,
): Promise<SavePatchPositionResponse> => {
  const response = await api.post<SavePatchPositionResponse>("/api/patches/positions", request);

  return response.data;
};

// 가방 패치 위치 수정 API
export const updatePatchPosition = async (
  patchPositionId: number,
  request: UpdatePatchPositionRequest,
): Promise<UpdatePatchPositionResponse> => {
  const response = await api.put<UpdatePatchPositionResponse>(
    `/api/patches/positions/${patchPositionId}`,
    request,
  );

  return response.data;
};

// 가방 패치 위치 삭제 API
export const deletePatchPosition = async (
  patchPositionId: number,
): Promise<DeletePatchPositionResponse> => {
  const response = await api.delete<DeletePatchPositionResponse>(
    `/api/patches/positions/${patchPositionId}`,
  );

  return response.data;
};

// 저장 패치 삭제 API
export const deletePatch = async (patchId: number): Promise<DeletePatchResponse> => {
  const response = await api.delete<DeletePatchResponse>(`/api/patches/${patchId}`);

  return response.data;
};
