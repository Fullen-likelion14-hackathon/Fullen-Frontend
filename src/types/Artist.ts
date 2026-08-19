// GET /api/artists
// 작가 리스트 조회 데이터
export interface Artist {
  artistId: number;
  artistName: string;
  imgUrl: string;
}

// 작가 리스트 조회 API 응답
export interface ArtistListResponse {
  success: boolean;
  code: number;
  message: string;
  data: Artist[];
}

// GET /api/artists/{artist-id}
// 작가 상세 조회 데이터
export interface ArtistDetail {
  artistId: number;
  artistName: string;
  imgUrls: string[];
  introSummary: string;
  description: string;
  nationImgUrl: string;
}

// 작가 상세 조회 API 응답
export interface ArtistDetailResponse {
  success: boolean;
  code: number;
  message: string;
  data: ArtistDetail;
}
