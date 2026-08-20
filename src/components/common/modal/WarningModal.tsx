import warningIcon from "@/assets/icons/warningIcon.png";

interface WarningModalProps {
  // 모달 열림 여부임
  isOpen: boolean;

  // 모달 제목임
  title: string;

  // 모달 설명 문구임
  description: string;

  // 첫 번째 버튼 문구임
  primaryButtonText: string;

  // 두 번째 버튼 문구임
  secondaryButtonText: string;

  // 첫 번째 버튼 클릭 함수임
  onPrimaryClick: () => void;

  // 두 번째 버튼 클릭 함수임
  onSecondaryClick: () => void;

  // 외부 영역 클릭 시 모달 닫기 함수임
  onClose?: () => void;

  // 삭제 대상 이미지임
  // 이미지가 필요한 모달에서만 전달함
  imageUrl?: string;
}

const WarningModal = ({
  isOpen,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  onClose,
  imageUrl,
}: WarningModalProps) => {
  // 닫힌 상태에서는 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      // 부모의 pointer-events-none 영향을 받지 않도록 auto 지정함
      // 모달이 열려있는 동안 뒤쪽 UI 클릭 차단함
      className="
        pointer-events-auto
        fixed
        inset-0
        z-9999
        flex
        items-center
        justify-center
        bg-black/40
        px-6
      "
      // dim 영역 클릭 시 모달 닫음
      // click 이벤트가 끝난 뒤 닫히므로 뒤쪽 버튼으로 클릭이 전달되지 않음
      onClick={() => {
        onClose?.();
      }}
    >
      {/* 390px 모바일 화면 기준 경고 모달임 */}
      <div
        className="
          w-full
          max-w-84.5
          rounded-2xl
          bg-[#FFFBF8]
          px-6
          pb-7
          pt-6
          shadow-lg
        "
        // 모달 내부 클릭이 dim 영역 클릭으로 전달되지 않도록 막음
        onClick={(event) => {
          event.stopPropagation();
        }}
        // 포인터 이벤트도 모달 내부에서 종료함
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* 경고 아이콘 영역임 */}
        <div className="mb-3 flex justify-center">
          <img
            src={warningIcon}
            alt=""
            className="
              h-10
              w-10
              object-contain
            "
          />
        </div>

        {/* 모달 문구 영역임 */}
        <div className="text-center">
          <h2
            className="
              whitespace-pre-line
              text-[16px]
              font-bold
              leading-[1.4]
              text-[#152A42]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              whitespace-pre-line
              text-[13px]
              font-medium
              leading-[1.45]
              text-[#8D9299]
            "
          >
            {description}
          </p>
        </div>

        {/* 삭제 대상 이미지 영역임 */}
        {imageUrl && (
          <div className="mt-5 flex justify-center">
            <img
              src={imageUrl}
              alt="삭제할 패치"
              className="
                h-26
                w-26
                object-contain
              "
            />
          </div>
        )}

        {/* 버튼 영역임 */}
        <div className="mt-5 flex flex-col gap-2">
          {/* 첫 번째 액션 버튼임 */}
          <button
            type="button"
            onClick={(event) => {
              // dim 영역 클릭으로 전달되지 않도록 처리함
              event.stopPropagation();

              onPrimaryClick();
            }}
            className="
              h-11
              w-full
              rounded-lg
              bg-[#152A42]
              text-[14px]
              font-bold
              text-white
            "
          >
            {primaryButtonText}
          </button>

          {/* 두 번째 액션 버튼임 */}
          <button
            type="button"
            onClick={(event) => {
              // dim 영역 클릭으로 전달되지 않도록 처리함
              event.stopPropagation();

              onSecondaryClick();
            }}
            className="
              h-11
              w-full
              rounded-lg
              border-2
              border-[#D5D5D5]
              bg-white
              text-[14px]
              font-bold
              text-[#BFC1C4]
              transition-colors
              hover:bg-[#D9D9D9]
              hover:text-[#747B85]
            "
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
