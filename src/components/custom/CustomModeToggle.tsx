interface CustomModeToggleProps {
  // 현재 선택된 모드 받음
  mode: "initial" | "patch";

  onChange: (mode: "initial" | "patch") => void;
}

export function CustomModeToggle({ mode, onChange }: CustomModeToggleProps) {
  return (
    // 토글 전체 영역임
    // relative: 움직이는 흰색 배경의 위치 기준이 됨
    // flex: 이니셜/패치 버튼 가로 배치함
    <div
      className="
        relative
        flex
        h-12
        w-47.5
        rounded-full
        bg-[#CFCDCE]
        p-1
      "
    >
      {/* 선택된 메뉴 뒤에서 움직이는 흰색 배경임 */}
      {/* absolute로 부모 기준 위치 잡음 */}
      {/* w-1/2로 전체 토글의 절반 크기 사용함 */}
      {/* mode에 따라 왼쪽/오른쪽으로 이동함 */}
      <div
        className={`
          absolute
          left-1
          top-1
          h-10
          w-[calc(50%-4px)]
          rounded-full
          bg-white
          transition-transform
          duration-300
          ease-in-out
          ${mode === "patch" ? "translate-x-full" : "translate-x-0"}
        `}
      />

      {/* 이니셜 버튼임 */}
      {/* z-10으로 움직이는 흰색 배경보다 위에 표시함 */}
      {/* flex-1로 전체 영역의 절반 차지함 */}
      <button
        type="button"
        onClick={() => onChange("initial")}
        className={`
          relative
          z-10
          flex-1
          rounded-full
          text-[16px]
          font-semibold
          transition-colors
          ${mode === "initial" ? "text-[#757575]" : "text-[#8E8E93]"}
        `}
      >
        이니셜 Aa
      </button>

      {/* 패치 버튼임 */}
      {/* 클릭하면 부모의 mode를 patch로 변경함 */}
      <button
        type="button"
        onClick={() => onChange("patch")}
        className={`
          relative
          z-10
          flex-1
          rounded-full
          text-[16px]
          font-semibold
          transition-colors
          ${mode === "patch" ? "text-[#757575]" : "text-[#8E8E93]"}
        `}
      >
        패치 ★
      </button>
    </div>
  );
}
