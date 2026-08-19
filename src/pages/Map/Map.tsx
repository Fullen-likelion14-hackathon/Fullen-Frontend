import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Map as LeafletMapInstance } from "leaflet";
import PageHeader from "@/components/common/PageHeader";
import { MapLeaflet } from "./MapLeaflet";
import { flyToPin } from "../../utils/mapCamera";
import { PinCardCarousel } from "../../components/common/PinCardCarousel";
import { useLeafletMapSync } from "../../hooks/useLeafletMapSync";
import { useMapPins } from "../../hooks/queries/useMapPins";
import { useNearbyJourneys } from "../../hooks/queries/useNearbyJourneys";
import { useRecentJourneyId } from "../../hooks/queries/useRecentJourneyId";
import type { MapPin } from "../../types/mapPin";

export default function Map() {
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMapInstance | null>(null);

  const { data: pins = [] } = useMapPins();
  const { data: recentJourneyId } = useRecentJourneyId();

  const [centerJourneyId, setCenterJourneyId] = useState<number | null>(null);
  const [showCarousel, setShowCarousel] = useState(false);

  const { data: nearby } = useNearbyJourneys(centerJourneyId);

  // center 좌표가 바뀔 때마다 지도 카메라 이동 (좌표 null이면 이동 자체를 스킵)
  const centerCoords =
    nearby && nearby.centerJourney.latitude != null && nearby.centerJourney.longitude != null
      ? { lat: nearby.centerJourney.latitude, lng: nearby.centerJourney.longitude }
      : null;

  useLeafletMapSync(mapRef, centerCoords);

  const handlePinClick = (pin: MapPin) => {
    setCenterJourneyId(pin.journeyId);
    setShowCarousel(true);
  };

  const handleSelectJourney = (journeyId: number) => {
    setCenterJourneyId(journeyId);
  };

  const handleShowLatestTravel = () => {
    if (recentJourneyId === undefined) return;
    setCenterJourneyId(recentJourneyId);
    setShowCarousel(true);
  };

  const handleShowFullMap = () => {
    setShowCarousel(false);
    flyToPin(mapRef, 20, 0, 1.5, 0.8);
  };

  const handleDetailClick = (journeyId: number) => {
    navigate(`/passport/${journeyId}`);
  };

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-97.5 flex-col overflow-hidden">
      <PageHeader title="지도 위 나의 여정" backTo="/" />

      <div className="relative flex-1 overflow-hidden">
        <MapLeaflet
          pins={pins}
          activeJourneyId={showCarousel ? centerJourneyId : null}
          onPinClick={handlePinClick}
          mapRef={mapRef}
        />

        {showCarousel && nearby && (
          <div className="absolute inset-x-0 top-6 z-1000">
            <PinCardCarousel
              nearby={nearby}
              onSelectJourney={handleSelectJourney}
              onDetailClick={handleDetailClick}
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-8 z-1000 flex flex-col items-center gap-3 px-6 pb-8">
          {showCarousel && (
            <button
              type="button"
              onClick={() => {
                if (centerJourneyId !== null) handleDetailClick(centerJourneyId);
              }}
              className="h-[48px] w-[250px] max-w-80 rounded-full bg-[#EDF2F4] font-['Paperlogy'] text-lg font-semibold tracking-tight text-slate-800 shadow-[0px_0px_5px_0px_rgba(25,39,60,0.30),inset_0px_3px_3px_0px_rgba(255,255,255,0.25),inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
            >
              열기
            </button>
          )}

          {!showCarousel && (
            <button
              type="button"
              onClick={handleShowLatestTravel}
              className="h-[54px] w-[330px] max-w-80 rounded-[10px] bg-slate-800 text-xl font-bold text-white"
            >
              가장 최근 여행 보기
            </button>
          )}

          {showCarousel && (
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