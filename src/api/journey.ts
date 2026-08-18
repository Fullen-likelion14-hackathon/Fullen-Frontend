// src/api/journey.ts
export type Continent =
  | "ASIA"
  | "EUROPE"
  | "NORTH_AMERICA"
  | "SOUTH_AMERICA"
  | "AFRICA"
  | "OCEANIA"
  | "ANTARCTICA";
  
import api from "@/api/axios";

interface JourneyRaw {
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
  journeys: JourneyRaw[];
}

interface JourneysResponse {
  continents: Record<string, ContinentGroupRaw>;
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