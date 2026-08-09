// src/pages/Map/Map.tsx
//
// 라우팅 예시: <Route path="/map" element={<Map />} />
// (RootLayout 밖에 배치 — 기존 라우팅 컨벤션과 동일하게 하단 네비게이션 없이 단독 페이지로)

import { useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { MapGlobe } from "./MapGlobe";
import { flyToPin } from "@/utils/globeCamera";
import { PinCardCarousel } from "../../components/common/PinCardCarousel";
import { useGlobeCarouselSync } from "../../hooks/useGlobeCarouselSync";
import { mockCountryPins, latestPinId } from "../../mocks/countryPins.mock";
import type { CountryPin } from "../../types/globe";

export default function Map() {
  // useRef<T>()는 초기값 없이 호출하면 타입 에러가 남 -> undefined 명시
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const pins = mockCountryPins; // TODO: TanStack Query로 교체

  const [showCarousel, setShowCarousel] = useState(false);
  const { activeIndex, setActiveIndex } = useGlobeCarouselSync(globeRef, pins);

  // '가장 최근 여행 보기' 클릭 -> 해당 핀으로 확대 + 캐러셀 노출
  const handleShowLatestTravel = () => {
    const targetIndex = pins.findIndex((p) => p.id === latestPinId);
    if (targetIndex === -1) return;

    setShowCarousel(true);
    setActiveIndex(targetIndex);
  };

  // 지구본 위 핀을 직접 클릭했을 때도 동일하게 동작
  const handlePinClick = (pin: CountryPin) => {
    const index = pins.findIndex((p) => p.id === pin.id);
    if (index === -1) return;
    setShowCarousel(true);
    setActiveIndex(index);
  };

  const handleShowFullMap = () => {
    setShowCarousel(false);
    // 전체가 보이도록 카메라를 멀리 빼기 (altitude 값을 크게)
    flyToPin(globeRef, { lat: 20, lng: 0, altitude: 2.5 }, 800);
  };

  const handleDetailClick = (pin: CountryPin) => {
    // TODO: 카테고리 내 피드 목록 페이지로 이동
    // navigate(`/passport/${pin.id}`)
    console.log("go to feed list of", pin.id);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <MapGlobe
        pins={pins}
        activePinId={showCarousel ? (pins[activeIndex]?.id ?? null) : null}
        onPinClick={handlePinClick}
        globeRef={globeRef}
      />

      {!showCarousel && (
        <button
          onClick={handleShowLatestTravel}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 32,
            transform: "translateX(-50%)",
            padding: "12px 24px",
            borderRadius: 999,
            border: "none",
            background: "#1a1a1a",
            color: "#fff",
          }}
        >
          가장 최근 여행 보기
        </button>
      )}

      {showCarousel && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 24 }}>
          <PinCardCarousel
            pins={pins}
            activeIndex={activeIndex}
            onSlideChange={setActiveIndex}
            onDetailClick={handleDetailClick}
          />
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button
              onClick={handleShowFullMap}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                background: "#1a1a1a",
                color: "#fff",
              }}
            >
              지도 한눈에 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
