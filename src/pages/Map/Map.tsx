// src/pages/Map/Map.tsx
//
// 라우팅: <Route path="/map" element={<Map />} />
// (RootLayout 밖에 배치 — 하단 네비게이션 없이 단독 페이지)

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Map as LeafletMapInstance } from "leaflet";
import PageHeader from "@/components/common/PageHeader";
import { MapLeaflet } from "./MapLeaflet";
import { flyToPin } from "../../utils/mapCamera";
import { PinCardCarousel } from "../../components/common/PinCardCarousel";
import { useLeafletMapSync } from "../../hooks/useLeafletMapSync";
import { useMapPins } from "../../hooks/useMapPins";
import type { MapPin } from "../../types/mapPin";

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
      {/* 팀 공용 PageHeader로 교체 (기존 자체 헤더 블록 제거) */}
      <PageHeader title="지도 위 나의 여정" backTo="/" />

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
        <div className="absolute inset-x-0 bottom-8 z-1000 flex flex-col items-center gap-3 px-6 pb-8">
          {/* "열기": 캐러셀에서 카드가 선택된 상태일 때만 노출, 활성 카드 클릭과 동일하게 상세 이동 */}
          {showCarousel && (
            <button
              type="button"
              onClick={() => {
                const activePin = pins[activeIndex];
                if (activePin) handleDetailClick(activePin);
              }}
              className="h-[48px] w-[250px] max-w-80 rounded-full bg-[#EDF2F4] font-['Paperlogy'] text-lg font-semibold tracking-tight text-slate-800 shadow-[0px_0px_5px_0px_rgba(25,39,60,0.30),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
            >
              열기
            </button>
          )}

          {!showCarousel ? (
            pins.length > 0 && (
              <button
                type="button"
                onClick={handleShowLatestTravel}
                className="h-[54px] w-[330px] max-w-80 rounded-[10px] bg-slate-800 text-xl font-bold text-white"
              >
                가장 최근 여행 보기
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleShowFullMap}
              className="h-[54px] w-[330px] max-w-80 rounded-[10px] bg-slate-800 text-xl font-bold text-white"
            >
              지도 한눈에 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
