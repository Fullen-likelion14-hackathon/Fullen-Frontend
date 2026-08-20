interface NoticeToastProps {
  // 생성 완료 / 적용 완료 구분함
  type: "created" | "applied";

  // 화면에 보여줄 문구 받음
  message: string;

  // 페이지별 토스트 위치 조절용 클래스임
  positionClassName?: string;
}

export default function NoticeToast({
  type,
  message,
  positionClassName = "top-24",
}: NoticeToastProps) {
  // 타입에 따라 배경색 정함
  const backgroundColor = type === "created" ? "#EBF7D5" : "#F7EBBF";

  // 타입에 따라 테두리색 정함
  const borderColor = type === "created" ? "#87928B" : "#CDA775";

  return (
    <div
      className={`
        pointer-events-none
        fixed
        left-1/2
        z-9999
        -translate-x-1/2
        ${positionClassName}
      `}
    >
      {/* 완료 안내창임 */}
      <div
        className="
          flex
          h-12
          w-75
          items-center
          gap-3
          rounded-lg
          border-2
          px-4
          py-3
          text-[max(12px,0.875rem)]
          font-semibold
          text-[#19273C]
          shadow-sm
        "
        style={{
          backgroundColor,
          borderColor,
        }}
      >
        {/* 완료 체크 아이콘임 */}
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
          "
        >
          ✓
        </div>

        {message}
      </div>
    </div>
  );
}
