interface InitialEditorProps {
  // 현재 선택된 글자 굵기 받음
  fontWeight: "normal" | "bold";

  // 글자 굵기 변경 함수 받음
  onFontWeightChange: (weight: "normal" | "bold") => void;

  // 현재 선택된 색상 받음
  selectedColor: string;

  // 색상 변경 함수 받음
  onColorChange: (color: string) => void;
}

// 선택 가능한 이니셜 색상 목록임
const colors = [
  "#038FBE",
  "#29292B",
  "#2C3B22",
  "#303077",
  "#782C13",
  "#A8A098",
  "#AB247E",
  "#B4D4CB",
  "#B8835B",
  "#C84B25",
  "#CCC2DB",
];

export default function InitialEditor({
  fontWeight,
  onFontWeightChange,
  selectedColor,
  onColorChange,
}: InitialEditorProps) {
  // 현재 선택된 색상이 몇 번째인지 찾음
  const selectedIndex = colors.indexOf(selectedColor);

  // 선택된 색상이 항상 가운데 오도록 색상 순서 돌려줌
  const visibleColors = colors.map((_, index) => {
    const centerIndex = Math.floor(colors.length / 2);

    const rotatedIndex = (selectedIndex - centerIndex + index + colors.length) % colors.length;

    return colors[rotatedIndex];
  });

  return (
    <div
      className="
        pointer-events-auto
        absolute
        inset-x-0
        bottom-55
        flex
        flex-col
        items-center
        gap-6
      "
    >
      {/* 기본 / 볼드 선택 영역임 */}
      <div
        className="
          flex
          rounded-full
          bg-white
          p-1
          shadow-sm
        "
      >
        {/* 기본 버튼임 */}
        <button
          type="button"
          onClick={() => onFontWeightChange("normal")}
          className={`
            rounded-full
            px-5
            py-2
            text-[16px]
            transition-colors
            ${fontWeight === "normal" ? "bg-[#969CA7] text-white" : "text-[#B1B1B1]"}
          `}
        >
          기본
        </button>

        {/* 볼드 버튼임 */}
        <button
          type="button"
          onClick={() => onFontWeightChange("bold")}
          className={`
            rounded-full
            px-5
            py-2
            text-[16px]
            transition-colors
            ${fontWeight === "bold" ? "bg-[#969CA7] text-white" : "text-[#B1B1B1]"}
          `}
        >
          볼드
        </button>
      </div>

      {/* 색상 선택 영역임 */}
      {/* 양쪽은 잘리고 선택된 색상은 가운데로 오게 함 */}
      <div
        className="
          flex
          w-full
          items-center
          justify-center
          gap-3
          overflow-hidden
        "
      >
        {visibleColors.map((color, index) => {
          // 현재 선택된 색상인지 확인함
          const isSelected = color === selectedColor;

          return (
            <button
              key={`${color}-${index}`}
              type="button"
              onClick={() => onColorChange(color)}
              style={{ backgroundColor: color }}
              className={`
                shrink-0
                rounded-xl
                transition-all
                duration-300
                ${isSelected ? "h-14 w-14 shadow-md" : "h-11 w-11"}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
