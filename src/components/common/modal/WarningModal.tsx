import warningIcon from "@/assets/icons/warningIcon.png";

interface WarningModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

const WarningModal = ({
  isOpen,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}: WarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[calc(100%-52px)] max-w-[452px] rounded-[28px] bg-[#FFFBF8] px-8 pb-12 pt-10">
        {/* 경고 아이콘 영역임. */}
        <div className="mb-4 flex justify-center">
          <img src={warningIcon} alt="" className="h-12 w-12 object-contain" />
        </div>

        {/* 모달 내용 영역임. */}
        <div className="text-center">
          <h2 className="text-[22px] font-bold leading-[1.4] text-[#152A42]">{title}</h2>

          <p className="mt-1 text-[16px] font-medium leading-[1.5] text-[#8D9299]">{description}</p>
        </div>

        {/* 버튼 영역임. */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onPrimaryClick}
            className="h-14 w-full rounded-xl bg-[#152A42] text-[17px] font-bold text-white"
          >
            {primaryButtonText}
          </button>

          <button
            type="button"
            onClick={onSecondaryClick}
            className="h-14 w-full rounded-xl border-2 border-[#D5D5D5] bg-white text-[17px] font-bold text-[#BFC1C4] transition-colors hover:bg-[#D9D9D9] hover:text-[#747B85]"
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
