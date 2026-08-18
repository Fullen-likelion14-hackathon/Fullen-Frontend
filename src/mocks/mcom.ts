export type MCoMTab = "country" | "global";

export type MCoMFeed = {
  feedId: number;
  countryName: string;
  countryCode: string;
  flagImage: string;
  title: string;
  date: string;
  thumbnail: string;
  imageCount: number;
  textCount: number;
  content: string;
};
