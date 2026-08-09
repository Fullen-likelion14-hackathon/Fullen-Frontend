// src/components/common/PinCardCarousel.tsx
//
// 설치 필요:
//   npm install embla-carousel-react
//
// 국가 카드 3장을 옆으로 스와이프하는 캐러셀.
// 슬라이드가 바뀌면 onSlideChange(index)를 호출해서 지구본과 동기화.

import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { CountryPin } from '../../types/globe';

interface PinCardCarouselProps {
  pins: CountryPin[];
  activeIndex: number;
  onSlideChange: (index: number) => void;
  onDetailClick?: (pin: CountryPin) => void;
}

export function PinCardCarousel({
  pins,
  activeIndex,
  onSlideChange,
  onDetailClick,
}: PinCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    startIndex: activeIndex,
  });

  // 사용자가 캐러셀을 직접 스와이프했을 때 -> 지구본에 알림
  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => onSlideChange(emblaApi.selectedScrollSnap());
    emblaApi.on('select', handleSelect);
    return () => {
      emblaApi.off('select', handleSelect);
    };
  }, [emblaApi, onSlideChange]);

  // 외부(예: '가장 최근 여행 보기' 클릭)에서 activeIndex가 바뀌면 캐러셀도 따라가게
  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== activeIndex) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [activeIndex, emblaApi]);

  const handleDetailClick = useCallback(
    (pin: CountryPin) => onDetailClick?.(pin),
    [onDetailClick]
  );

  return (
    <div className="embla" ref={emblaRef} style={{ overflow: 'hidden' }}>
      <div className="embla__container" style={{ display: 'flex', gap: 12 }}>
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="embla__slide"
            style={{ flex: '0 0 80%', minWidth: 0 }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
                background: '#fff',
              }}
            >
              <img
                src={pin.thumbnailUrl}
                alt={pin.countryName}
                style={{ width: '100%', height: 220, objectFit: 'cover' }}
              />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700 }}>{pin.countryName}</div>
                <div style={{ fontSize: 13, color: '#666' }}>{pin.travelTitle}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{pin.period}</div>
              </div>
              <button
                onClick={() => handleDetailClick(pin)}
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                }}
              >
                자세히 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}