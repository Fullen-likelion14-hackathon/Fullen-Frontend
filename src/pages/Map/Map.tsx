// src/pages/Map/Map.tsx
//
// 라우팅: <Route path="/map" element={<Map />} />
// (RootLayout 밖에 배치 — 하단 네비게이션 없이 단독 페이지)

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Map as LeafletMapInstance } from "leaflet";
import { MapLeaflet } from "./MapLeaflet";
import { flyToPin } from "../../utils/mapCamera";
import { PinCardCarousel } from "../../components/common/PinCardCarousel";
import { useLeafletMapSync } from "../../hooks/useLeafletMapSync";
import { useMapPins } from "../../hooks/useMapPins";
import type { MapPin } from "../../types/mapPin";
import backIcon from "@/assets/icons/back.png";

export default function Map() {
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMapInstance | null>(null);

  const { pins } = useMapPins();

  const [showCarousel, setShowCarousel] = useState(false);
  const { activeIndex, setActiveIndex } = useLeafletMapSync(mapRef, pins);

  const handleShowLatestTravel = () => {
    if (pins.length === 0) return;
    setShowCarousel(true);
    setActiveIndex(0);
  };

  const handlePinClick = (pin: MapPin) => {
    const index = pins.findIndex((p) => p.id === pin.id);
    if (index === -1) return;
    setShowCarousel(true);
    setActiveIndex(index);
  };

  const handleShowFullMap = () => {
    setShowCarousel(false);
    flyToPin(mapRef, 20, 0, 1.5, 0.8);
  };

  // 카드/핀 클릭 시 카테고리 내 피드 목록 페이지로 이동
  const handleDetailClick = (pin: MapPin) => {
    navigate(`/passport/${pin.id}`);
  };

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-97.5 flex-col overflow-hidden">
      {/* 헤더: 다른 페이지(CategoryNew 등)와 동일한 패턴 재사용 */}
      <header className="relative h-32 shrink-0 overflow-hidden bg-slate-800">
        <div className="relative flex h-full items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute left-6 top-1/2 -translate-y-1/2"
            aria-label="메인으로 돌아가기"
          >
            <img src={backIcon} alt="" className="h-6 w-3.5" />
          </button>
          <h1 className="font-['Pretendard_Variable'] text-xl font-bold text-white">
            지도 위 나의 여정
          </h1>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-yellow-700" />
      </header>

      {/* 지도 + 오버레이(캐러셀/버튼) 영역 */}
      <div className="relative flex-1 overflow-hidden">
        <MapLeaflet
          pins={pins}
          activePinId={showCarousel ? (pins[activeIndex]?.id ?? null) : null}
          onPinClick={handlePinClick}
          mapRef={mapRef}
        />

        {/* 캐러셀은 화면 상단(헤더 바로 아래)에 위치 */}
        {showCarousel && (
          <div className="absolute inset-x-0 top-6 z-1000">
            <PinCardCarousel
              pins={pins}
              activeIndex={activeIndex}
              onSlideChange={setActiveIndex}
              onDetailClick={handleDetailClick}
            />
          </div>
        )}

        {/* 하단 버튼: 캐러셀 노출 여부와 무관하게 항상 화면 하단에 고정 */}
        <div className="absolute inset-x-0 bottom-8 z-1000 flex justify-center px-6">
          {!showCarousel ? (
            pins.length > 0 && (
              <button
                type="button"
                onClick={handleShowLatestTravel}
                className="h-14 w-full max-w-80 rounded-[10px] bg-slate-800 text-xl font-bold text-white"
              >
                가장 최근 여행 보기
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleShowFullMap}
              className="h-14 w-full max-w-80 rounded-[10px] bg-slate-800 text-xl font-bold text-white"
            >
              지도 한눈에 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
