// src/mocks/countryFlags.mock.ts
//
// 국가명 -> 국기 이미지 URL. flagcdn.com은 무료 국기 이미지 CDN(가입 불필요).
// 실제 서비스에서는 팀이 확보한 국기 에셋(파일)으로 교체하면 됨 -
// 그때는 이 파일의 getCountryFlagUrl 반환값만 로컬 경로로 바꾸면 나머지 코드는 안 건드려도 됨.

const countryCodeMap: Record<string, string> = {
  독일: "de",
  포르투갈: "pt",
  폴란드: "pl",
  프랑스: "fr",
  이탈리아: "it",
  스페인: "es",
  일본: "jp",
  대한민국: "kr",
  리스본: "pt", // 카테고리명이 도시명으로 들어올 수도 있어서 별도 매핑

  // Passport(3번)/PassportDetail(4번)에서는 countryName이 영문 대문자로 저장되어 있어 추가
  GERMANY: "de",
  JAPAN: "jp",
  PORTUGAL: "pt",
  POLAND: "pl",
  FRANCE: "fr",
  ITALY: "it",
  SPAIN: "es",
  KOREA: "kr",
  LISBON: "pt",
};

export function getCountryFlagUrl(countryName: string): string | undefined {
  const code = countryCodeMap[countryName];
  if (!code) return undefined;
  return `https://flagcdn.com/h80/${code}.png`;
}

// 영문 countryName -> 한글 표시명 (DetailCard 등에서 카드에 국가명 한글로 표시할 때 사용)
export const countryNameKoMap: Record<string, string> = {
  GERMANY: "독일",
  JAPAN: "일본",
  PORTUGAL: "포르투갈",
  POLAND: "폴란드",
  FRANCE: "프랑스",
  ITALY: "이탈리아",
  SPAIN: "스페인",
  KOREA: "대한민국",
  LISBON: "리스본",
};
