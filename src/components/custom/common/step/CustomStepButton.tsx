// AI 패치 생성 및 1:1 커스텀 주문에서 공통으로 사용하는 단계 이동 버튼

interface CustomStepButtonProps {
  // 다음 단계로 이동하는 함수
  onNext: () => void;

  // 이전 단계로 이동하는 함수
  onPrevious?: () => void;

  // 다음 단계 버튼 문구
  nextLabel?: string;

  // 이전 단계 버튼 문구
  previousLabel?: string;

  // 다음 단계 버튼 비활성화 여부
  disabled?: boolean;

  // 이전 단계 버튼 표시 여부
  showPrevious?: boolean;
}

const CustomStepButton = ({
  onNext,
  onPrevious,
  nextLabel = "다음 단계로 넘어가기",
  previousLabel = "이전 단계로 돌아가기",
  disabled = false,
  showPrevious = false,
}: CustomStepButtonProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {/* 다음 단계 이동 버튼 */}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={`h-14.5 w-full rounded-xl text-[1rem] font-bold shadow-md transition-opacity ${
          disabled
            ? "cursor-not-allowed bg-[#D1D1D1] text-white"
            : "bg-[#192C44] text-white hover:opacity-90"
        }`}
      >
        {nextLabel}
      </button>

      {/* 첫 번째 단계가 아닐 경우 이전 단계 버튼 표시 */}
      {showPrevious && (
        <button
          type="button"
          onClick={onPrevious}
          className="h-14.5 w-full rounded-xl border-2 border-[#B89B84] bg-transparent text-[1rem] font-bold text-[#B89B84]"
        >
          {previousLabel}
        </button>
      )}
    </div>
  );
};

export default CustomStepButton;
