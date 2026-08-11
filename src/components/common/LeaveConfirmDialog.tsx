// ============================================================
// LeaveConfirmDialog.tsx — 필수 항목 미입력 상태에서 이탈 시도 시 뜨는 확인 모달
// 카테고리 생성/수정, 게시물 생성/수정 등 폼 페이지에서 공통으로 사용
// ============================================================

import warningIcon from "@/assets/icons/warning.png";

interface LeaveConfirmDialogProps {
  onContinue: () => void; // "마저 입력하기"
  onLeave: () => void; // "저장하지 않고 나가기"
}

const LeaveConfirmDialog = ({ onContinue, onLeave }: LeaveConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-72 rounded-[20px] bg-stone-100 px-6 py-8">
        <div className="flex flex-col items-center gap-2.5">
          {/* 경고 아이콘 */}
          <img src={warningIcon} alt="" className="size-8" />
          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-base font-semibold leading-5 tracking-tight text-black"
          >
            모든항목을 입력해주세요
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onContinue}
            style={{ fontFamily: "Pretendard Variable" }}
            className="h-9 rounded-[10px] bg-slate-800 text-xs font-bold text-white"
          >
            마저 입력하기
          </button>
          <button
            type="button"
            onClick={onLeave}
            style={{ fontFamily: "Pretendard Variable" }}
            className="h-9 rounded-[10px] border border-stone-300 bg-stone-300 text-xs font-bold text-black"
          >
            저장하지 않고 나가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfirmDialog;
