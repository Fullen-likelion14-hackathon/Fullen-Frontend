import { useState } from "react";

interface InitialCreateModalProps {
  // 팝업 닫는 함수 받음
  onClose: () => void;

  // 생성된 이니셜 부모한테 전달함
  onCreate: (text: string) => void;
}

export default function InitialCreateModal({ onClose, onCreate }: InitialCreateModalProps) {
  // 입력한 이니셜 저장함
  const [text, setText] = useState("");

  // 14자 초과 안내문구 보여줄지 저장함
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // 14자 넘으면 더 이상 입력 안 되고 안내문구 보여줌
    if (value.length > 14) {
      setShowLimitMessage(true);
      setText(value.slice(0, 14));
      return;
    }

    setShowLimitMessage(false);
    setText(value);
  };

  const handleCreate = () => {
    // 공백만 있으면 생성 안 함
    if (!text.trim()) return;

    onCreate(text.trim());
  };

  return (
    <div
      className="
        pointer-events-auto
        absolute
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
      "
    >
      {/* 팝업 전체 영역임 */}
      <div className="relative w-85 rounded-xl bg-[#F9F4F0] p-3">
        {/* X 누르면 팝업 닫힘 */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            -top-9
            right-0
            text-[28px]
            text-white
          "
        >
          ×
        </button>

        {/* 14자 넘으면 안내문구 보여줌 */}
        {showLimitMessage && (
          <p
            className="
              absolute
              -top-8
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              text-[12px]
              text-white
            "
          >
            최대 14자까지 입력 가능합니다
          </p>
        )}

        {/* 이니셜 입력창임 */}
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="이니셜을 입력해주세요"
          className="
            h-12
            w-full
            rounded-lg
            border
            border-[#B7B7B7]
            bg-white
            px-4
            text-center
            outline-none
            focus:border-[#192D45]
          "
        />

        {/* 입력값 없으면 생성하기 비활성화됨 */}
        <button
          type="button"
          disabled={!text.trim()}
          onClick={handleCreate}
          className="
            mt-2
            h-12
            w-full
            rounded-lg
            bg-[#192D45]
            font-semibold
            text-white
            disabled:bg-[#D1D1D1]
          "
        >
          생성하기
        </button>
      </div>
    </div>
  );
}
