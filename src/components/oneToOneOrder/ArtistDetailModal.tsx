import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import type { Artist } from "@/components/oneToOneOrder/ArtistData";

type ArtistDetailModalProps = {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 50;

export default function ArtistDetailModal({ artist, isOpen, onClose }: ArtistDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dragStartX = useRef<number | null>(null);

  // 다른 작가 상세를 열면 첫 번째 이미지부터 시작
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [artist?.id]);

  // 모달 열렸을 때 뒤 페이지 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !artist) return null;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? artist.detailImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === artist.detailImages.length - 1 ? 0 : prev + 1));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;

    if (distance > SWIPE_THRESHOLD) {
      handlePreviousImage();
    }

    if (distance < -SWIPE_THRESHOLD) {
      handleNextImage();
    }

    dragStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      {/* 모달 */}
      <div
        className="max-h-[80dvh] w-full max-w-[320px] overflow-y-auto rounded-xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="sticky top-0 z-20 flex h-12 items-center justify-between bg-white px-4">
          <div className="flex items-center gap-3">
            <img src={artist.flagImage} alt="" className="h-4 w-6 object-cover" />

            <p className="text-[14px] font-bold text-[#192A40]">{artist.name}</p>
          </div>

          <button type="button" onClick={onClose} aria-label="작가 상세 닫기">
            <X size={20} className="text-[#9CA3AF]" />
          </button>
        </div>

        {/* 작품 이미지 슬라이더 */}
        <div
          className="relative h-75 w-full select-none overflow-hidden touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <img
            src={artist.detailImages[currentImageIndex]}
            alt={`${artist.name} 작품 ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
            draggable={false}
          />

          {/* 이미지 위치 점 */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {artist.detailImages.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentImageIndex === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="px-5 py-4">
          {/* 짧은 설명 */}
          <p className="text-[12px] font-semibold leading-4 text-[#192A40]">
            {artist.detailSummary}
          </p>

          {/* 긴 설명 */}
          <div className="mt-4 flex flex-col gap-3">
            {artist.detailDescription.map((paragraph, index) => (
              <p key={index} className="text-[12px] leading-4.5 text-[#192A40]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
