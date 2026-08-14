// ============================================================
// MCMWarningDialog.tsx — 업로드 사진이 MCM 제품으로 인식되지 않을 때 노출되는 경고 모달
// ============================================================

import warningIcon from "@/assets/icons/warning.png";

interface MCMWarningDialogProps {
  onReselect: () => void;
  onDeletePhoto: () => void;
}

const MCMWarningDialog = ({ onReselect, onDeletePhoto }: MCMWarningDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-9">
      <div className="flex w-72 h-57.5 flex-col items-center justify-center gap-6 rounded-[14px] bg-[#F9F4F0] p-6">
        <div className="flex flex-col items-center gap-2.5">
          <img src={warningIcon} alt="" className="h-7.875 w-7.875 object-contain" />

          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-base font-semibold leading-5 tracking-tight text-black"
          >
            나의 MCM 제품이
            <br />
            아닌 사진은 올릴 수 없습니다
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3.25">
          <button
            type="button"
            onClick={onReselect}
            style={{ fontFamily: "Paperlogy" }}
            className="flex h-9.25 w-52.75 items-center justify-center rounded-[10px] bg-slate-800 text-base font-semibold text-white"
          >
            다시 선택하기
          </button>
          <button
            type="button"
            onClick={onDeletePhoto}
            style={{ fontFamily: "Paperlogy" }}
            className="flex h-9.25 w-52.75 items-center justify-center rounded-[10px] bg-[#C5C0BC] text-base font-semibold text-slate-800"
          >
            해당 사진 삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCMWarningDialog;
