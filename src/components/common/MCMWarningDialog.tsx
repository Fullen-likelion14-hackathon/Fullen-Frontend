// ============================================================
// MCMWarningDialog.tsx — 업로드 사진에 나의 MCM 제품이 포함되지 않았을 때 노출되는 경고 모달
// ============================================================

import warningIcon from "@/assets/icons/warning3.png";

type MCMWarningDialogProps = {
  onClose: () => void;
};

const MCMWarningDialog = ({ onClose }: MCMWarningDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-9">
      <div className="flex w-72 h-57.5 flex-col items-center justify-center rounded-[14px] bg-[#F9F4F0] p-6">
        <div className="flex flex-col items-center">
          <img src={warningIcon} alt="" className="h-7.875 w-7.875 object-contain" />

          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-base font-semibold pt-[0.625rem] leading-5 tracking-tight text-black"
          >
            MCM 제품이 포함되지 않은
            <br />
            사진은 등록할 수 없습니다
          </p>
          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-xs font-semibold pt-[0.3125rem] tracking-tight text-[#888D96]"
          >
            MCM 제품이 포함된 사진을 선택해주세요
          </p>
        </div>

        <div className="flex w-full flex-col items-center pt-[0.625rem]">
          <button
            type="button"
            onClick={onClose}
            style={{ fontFamily: "Paperlogy" }}
            className="flex h-9.25 w-52.75 items-center justify-center rounded-[10px] bg-[#19273C] text-xs font-bold text-white"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCMWarningDialog;
