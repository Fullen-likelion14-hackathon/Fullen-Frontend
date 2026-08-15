// src/utils/extractPhotoGps.ts
//
// 설치 필요: npm install exifr
//
// 사진 파일(File 객체)의 EXIF 메타데이터에서 GPS 좌표를 추출합니다.
// 사용 위치: 피드 업로드 화면(PostForm 등)에서 사진을 선택/업로드하는 시점.
//
// 주의: 모든 사진에 GPS 정보가 있는 게 아닙니다.
// - 카메라 위치 서비스가 꺼져 있었으면 애초에 EXIF에 좌표가 없음
// - 카카오톡/인스타그램 등으로 전달받은 사진은 대부분 EXIF가 삭제된 상태
// - 스크린샷은 GPS 정보 없음
// 따라서 null이 반환되는 경우가 흔하다는 걸 전제로 UI/로직을 짜야 합니다.

import exifr from "exifr";

export interface PhotoGps {
  lat: number;
  lng: number;
}

/**
 * 사진 파일에서 GPS 좌표를 추출합니다.
 * @param file 업로드된 이미지 파일 (input type="file"에서 받은 File 객체)
 * @returns 좌표가 있으면 { lat, lng }, 없거나 추출 실패 시 null
 */
export async function extractPhotoGps(file: File): Promise<PhotoGps | null> {
  try {
    const gps = await exifr.gps(file);
    if (!gps || typeof gps.latitude !== "number" || typeof gps.longitude !== "number") {
      return null;
    }
    return { lat: gps.latitude, lng: gps.longitude };
  } catch {
    // 손상된 파일, 지원하지 않는 포맷 등 -> 에러 대신 조용히 null 반환
    // (업로드 자체를 막으면 안 되므로 UX상 실패를 티내지 않음)
    return null;
  }
}

/**
 * 여러 장(최대 5장) 업로드 시 각 파일의 GPS를 병렬로 추출합니다.
 * PostForm에서 사진 여러 장을 한 번에 처리할 때 사용하세요.
 */
export async function extractPhotosGps(files: File[]): Promise<(PhotoGps | null)[]> {
  return Promise.all(files.map(extractPhotoGps));
}

/*
사용 예시 (피드 업로드 폼 안에서):

  const handlePhotoSelect = async (files: File[]) => {
    const gpsList = await extractPhotosGps(files);
    // gpsList[i]가 null이 아니면 files[i]에 위치 정보가 있었다는 뜻.
    // 대표로 첫 번째 유효 좌표를 이 피드의 gps로 저장해서
    // 피드 생성 API 요청 body에 함께 보내면 됩니다.
    const representativeGps = gpsList.find((g) => g !== null) ?? null;

    await createFeed({
      photos: files,
      gps: representativeGps, // 백엔드 Feed 테이블에 gps 컬럼(lat, lng, nullable) 필요
      // ...기타 필드
    });
  };
*/
