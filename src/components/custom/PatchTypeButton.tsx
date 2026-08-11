interface PatchTypeButtonProps {
  // 버튼에 들어갈 글자
  text: string;
  // 부모한테 받을 이미지 경로
  image: string;
  // 현재 선택된 버튼인지 여부
  selected: boolean;
  // 클릭했을 때 실행할 함수
  onClick: () => void;
}

export default function PatchTypeButton({ text, image, selected, onClick }: PatchTypeButtonProps) {
  return (
    <button type="button" onClick={onClick} className="relative">
      {/* 이미지 크기 그대로 버튼 크기 결정함 */}
      <img src={image} alt="" className="block" />

      {/* 이미지 위에 글자 겹쳐서 배치함 */}
      <span
        className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
          font-semibold
          ${selected ? "text-[#A7602E]" : "text-[#7A4930]"}
        `}
      >
        {text}
      </span>
    </button>
  );
}
