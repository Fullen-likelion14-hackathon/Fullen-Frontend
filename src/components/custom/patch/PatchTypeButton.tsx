import { useState } from "react";

interface PatchTypeButtonProps {
  // 버튼 종류
  type: "ticket" | "stamp" | "label";

  // 버튼에 들어갈 글자
  text: string;

  // 기본 이미지
  image: string;

  // 선택됐을 때 보여줄 이미지
  selectedImage: string;

  // 현재 선택된 버튼인지 여부
  selected: boolean;

  // 클릭했을 때 실행할 함수
  onClick: () => void;
}

export default function PatchTypeButton({
  type,
  text,
  image,
  selectedImage,
  selected,
  onClick,
}: PatchTypeButtonProps) {
  // 현재 버튼에 마우스가 올라가 있는지 여부
  const [isHovered, setIsHovered] = useState(false);

  // 선택됐거나 hover 중이면 활성화 상태로 봄
  const isActive = selected || isHovered;

  return (
    <button
      type="button"
      onClick={onClick}
      // 마우스가 버튼 위로 올라오면 hover 상태로 변경함
      onMouseEnter={() => setIsHovered(true)}
      // 마우스가 버튼에서 벗어나면 hover 상태 해제함
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {/* 기본 이미지 */}
      {/* 선택됐거나 hover 중이면 채워진 이미지로 변경함 */}
      {/* 이미지 크기 공통으로 줄임 */}
      <img src={isActive ? selectedImage : image} alt="" className="block w-28 object-contain" />

      {/* 이미지 위에 글자 겹쳐서 배치함 */}
      {/* 라벨은 오른쪽 꼬리 때문에 글자만 살짝 왼쪽으로 이동함 */}
      <span
        className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
          font-semibold
          text-[#693A25]
          hover:font-bold!
          active:font-bold!
          ${type === "label" ? "-translate-x-2" : ""}
        `}
      >
        {text}
      </span>
    </button>
  );
}
