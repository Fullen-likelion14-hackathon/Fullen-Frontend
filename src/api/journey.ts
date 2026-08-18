// src/api/journey.ts
import api from "@/api/axios";

export type Continent =
  "ASIA" | "EUROPE" | "NORTH_AMERICA" | "SOUTH_AMERICA" | "AFRICA" | "OCEANIA" | "ANTARCTICA";

export interface JourneyItem {
  journeyId: number;
  nationKRName: string;
  nationENName: string;
  type: string;
  coverImgUrl: string;
  startDate: string;
  endDate: string;
  flagImgUrl: string;
}

interface ContinentGroupRaw {
  count: number;
  journeys: JourneyItem[];
}

interface JourneysResponse {
  continents: Partial<Record<Continent, ContinentGroupRaw>>;
}

export const getJourneys = async () => {
  const response = await api.get<{
    success: boolean;
    code: number;
    message: string;
    data: JourneysResponse;
  }>("/api/journeys");

  return response.data.data.continents;
};

export interface JourneyDetail extends JourneyItem {
  postCount: number;
}

export const getJourney = async (journeyId: number) => {
  const response = await api.get<{
    success: boolean;
    code: number;
    message: string;
    data: JourneyDetail;
  }>(`/api/journeys/${journeyId}`);

  return response.data.data;
};

export interface CreateJourneyRequest {
  imgUrl: string;
  nationName: string;
  type: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
}

export const createJourney = async (payload: CreateJourneyRequest) => {
  const response = await api.post<{
    success: boolean;
    code: number;
    message: string;
    data: JourneyDetail;
  }>("/api/journeys", payload);

  return response.data.data;
};

export const deleteJourney = async (journeyId: number) => {
  const response = await api.delete<{
    success: boolean;
    code: number;
    message: string;
    data: string;
  }>(`/api/journeys/${journeyId}`);

  return response.data.data;
};

export interface UpdateJourneyRequest {
  imgUrl: string;
  type: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;
}

export const updateJourney = async (journeyId: number, payload: UpdateJourneyRequest) => {
  const response = await api.put<{
    success: boolean;
    code: number;
    message: string;
    data: JourneyDetail;
  }>(`/api/journeys/${journeyId}`, payload);

  return response.data.data;
};
