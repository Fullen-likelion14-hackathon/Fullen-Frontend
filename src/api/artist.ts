import api from "@/api/axios";

import type { ArtistDetailResponse, ArtistListResponse } from "@/types/artist";

// 전체 작가 목록 조회
export const getArtists = async (): Promise<ArtistListResponse> => {
  const response = await api.get<ArtistListResponse>("/api/artists");

  return response.data;
};

// 작가 단건 조회
export const getArtist = async (artistId: number): Promise<ArtistDetailResponse> => {
  const response = await api.get<ArtistDetailResponse>(`/api/artists/${artistId}`);

  return response.data;
};
