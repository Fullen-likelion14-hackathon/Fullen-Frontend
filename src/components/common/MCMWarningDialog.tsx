// ============================================================
// MCMWarningDialog.tsx — 업로드 사진이 MCM 제품으로 인식되지 않을 때 노출되는 경고 모달
// type: "not-my-bag" (타사 제품 포함 / MCM 제품이지만 현재 NFC로 등록된 나의 가방이 아닌 경우)
//       "no-mcm-photo" (나의 가방 제품 사진이 아예 없는 경우)
// ============================================================

import warningIcon from "@/assets/icons/warning3.png";

export type MCMWarningType = "not-my-bag" | "no-mcm-photo";

type MCMWarningDialogProps = {
  type: MCMWarningType;
  onClose: () => void;
};

const WARNING_MESSAGES: Record<MCMWarningType, { title: React.ReactNode }> = {
  "not-my-bag": {
    title: (
      <>
        나의 MCM 제품이
        <br />
        아닌 사진은 올릴 수 없습니다
      </>
    ),
  },
  "no-mcm-photo": {
    title: (
      <>
        나의 MCM 제품이 포함되지
        <br />
        않은 사진은 올릴 수 없습니다
      </>
    ),
  },
};

const MCMWarningDialog = ({ type, onClose }: MCMWarningDialogProps) => {
  const { title } = WARNING_MESSAGES[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-9">
      <div className="flex w-72 h-57.5 flex-col items-center justify-center rounded-[14px] bg-[#F9F4F0] p-6">
        <div className="flex flex-col items-center">
          <img src={warningIcon} alt="" className="h-7.875 w-7.875 object-contain" />

          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-base font-semibold pt-[10px] leading-5 tracking-tight text-black"
          >
            {title}
          </p>
          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-xs font-semibold pt-[5px] tracking-tight text-[#888D96]"
          >
            사진을 다시 선택해주세요
          </p>
        </div>

        <div className="flex w-full flex-col items-center pt-[10px]">
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
