// ============================================================
// LeaveConfirmDialog.tsx — 필수 항목 미입력 상태에서 이탈 시도 시 뜨는 확인 모달
// 카테고리 생성/수정, 게시물 생성/수정 등 폼 페이지에서 공통으로 사용
// 문구는 페이지별로 다르므로 props로 전달받음
// ============================================================

import warningIcon from "@/assets/icons/warning3.png";

interface LeaveConfirmDialogProps {
  onContinue: () => void; // "이어서 ~하기"
  onLeave: () => void; // "~ 중단하기"
  title?: string;
  subtitle?: string;
  continueLabel?: string;
  leaveLabel?: string;
}

const LeaveConfirmDialog = ({
  onContinue,
  onLeave,
  title = "여행 생성을 중단하시겠습니까?",
  subtitle = "지금까지 선택한 사항들이 전부 삭제됩니다",
  continueLabel = "이어서 생성하기",
  leaveLabel = "여행 생성 중단하기",
}: LeaveConfirmDialogProps) => {
  return (
    <>
      {/* 오버레이: 가운데 앱 영역 + 헤더 아래만 덮음 */}
      <div
        className="
          fixed
          left-1/2
          top-[7.8125rem]
          bottom-0
          w-full
          max-w-97.5
          -translate-x-1/2
          z-50
          bg-black/50
        "
      />

      {/* 모달: 화면 전체 기준 정중앙 */}
      <div className="fixed inset-0 z-51 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto h-[14.375rem] w-[18rem] rounded-[1.25rem] bg-stone-100 px-6 py-8">
          <div className="flex flex-col items-center">
            {/* 경고 아이콘 */}
            <img src={warningIcon} alt="" className="size-8" />

            <p
              style={{ fontFamily: "Paperlogy" }}
              className="pt-[0.625rem] text-center text-base font-bold leading-5 tracking-tight text-[#19273C]"
            >
              {title}
            </p>

            <p
              style={{ fontFamily: "Paperlogy" }}
              className="pt-[0.3125rem] text-center text-xs font-semibold leading-5 text-[#888D96]"
            >
              {subtitle}
            </p>
          </div>

          <div className="mt-[0.625rem] flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={onContinue}
              style={{ fontFamily: "Paperlogy" }}
              className="h-[2.3125rem] w-[13.1875rem] rounded-[0.625rem] bg-[#19273C] text-xs font-bold tracking-tight text-[#F9F4F0]"
            >
              {continueLabel}
            </button>

            <button
              type="button"
              onClick={onLeave}
              style={{ fontFamily: "Paperlogy" }}
              className="
                h-9 w-[13.1875rem] overflow-hidden rounded-[0.625rem]
                bg-white
                text-xs font-bold tracking-tight text-stone-300
                outline outline-2 outline-offset-[-0.125rem] outline-stone-300
                transition-all duration-150
                hover:bg-[#CFCDCE] hover:text-[#737985]
              "
            >
              {leaveLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveConfirmDialog;
