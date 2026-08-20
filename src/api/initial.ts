import api from "@/api/axios";

import type {
  DeleteInitialResponse,
  GetInitialsResponse,
  SaveInitialRequest,
  SaveInitialResponse,
  UpdateInitialRequest,
  UpdateInitialResponse,
} from "@/types/initial";

// 적용 이니셜 목록 조회 API
export const getInitials = async (userBagId: number): Promise<GetInitialsResponse> => {
  const response = await api.get<GetInitialsResponse>("/api/orders/initials", {
    params: {
      userBagId,
    },
  });

  return response.data;
};

// 이니셜 적용 API
export const saveInitial = async (request: SaveInitialRequest): Promise<SaveInitialResponse> => {
  const response = await api.post<SaveInitialResponse>("/api/orders/initials", request);

  return response.data;
};

// 이니셜 수정 API
export const updateInitial = async (
  initialId: number,
  request: UpdateInitialRequest,
): Promise<UpdateInitialResponse> => {
  const response = await api.put<UpdateInitialResponse>(
    `/api/orders/initials/${initialId}`,
    request,
  );

  return response.data;
};

// 이니셜 삭제 API
export const deleteInitial = async (initialId: number): Promise<DeleteInitialResponse> => {
  const response = await api.delete<DeleteInitialResponse>(`/api/orders/initials/${initialId}`);

  return response.data;
};
