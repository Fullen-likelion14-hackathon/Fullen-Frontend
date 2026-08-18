import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import type { Artist } from "@/mocks/ArtistData";

type ArtistDetailModalProps = {
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
};

const SWIPE_THRESHOLD = 50;

export default function ArtistDetailModal({ artist, isOpen, onClose }: ArtistDetailModalProps) {
  // 현재 보여주고 있는 작품 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 스와이프 시작 위치
  const dragStartX = useRef<number | null>(null);

  // 모달이 열렸을 때 뒤 페이지 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;

    // 기존 body overflow 값 저장
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    // 모달이 닫히면 기존 값으로 복원
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !artist) return null;

  // 이전 작품 이미지
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? artist.detailImages.length - 1 : prev - 1));
  };

  // 다음 작품 이미지
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === artist.detailImages.length - 1 ? 0 : prev + 1));
  };

  // 스와이프 시작
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  // 스와이프 종료
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;

    // 오른쪽으로 스와이프 → 이전 이미지
    if (distance > SWIPE_THRESHOLD) {
      handlePreviousImage();
    }

    // 왼쪽으로 스와이프 → 다음 이미지
    if (distance < -SWIPE_THRESHOLD) {
      handleNextImage();
    }

    dragStartX.current = null;
  };

  // 포인터 이벤트가 중간에 취소된 경우 초기화
  const handlePointerCancel = () => {
    dragStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${artist.name} 상세 정보`}
    >
      {/* 모달 */}
      <div
        className="max-h-[80dvh] w-full max-w-[320px] overflow-y-auto rounded-xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="sticky z-20 flex h-15 items-center justify-between bg-white px-5">
          {/* 작가 국가 */}
          <img src={artist.flagImage} className="h-6 w-10 object-cover border-2" />

          {/* 작가 이름 */}
          <p className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pt-1 text-[18px] font-bold text-[#192A40]">
            {artist.name}
          </p>

          {/* 모달 닫기 */}
          <button type="button" onClick={onClose} aria-label="작가 상세 닫기">
            <X size={20} className="text-[#9CA3AF]" />
          </button>
        </div>

        {/* 작품 이미지 슬라이더 */}
        <div
          className="relative h-75 w-full select-none overflow-hidden touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <img
            src={artist.detailImages[currentImageIndex]}
            alt={`${artist.name} 작품 ${currentImageIndex + 1}`}
            className="h-full w-full object-cover"
            draggable={false}
          />

          {/* 현재 이미지 위치 */}
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
        <div className="px-8 py-4">
          {/* 짧은 화풍 설명 */}
          <p className="text-[12px] font-semibold leading-4 text-[#192A40]">
            {artist.detailSummary}
          </p>

          {/* 상세 설명 */}
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
