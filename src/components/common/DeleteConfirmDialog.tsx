// ============================================================
// DeleteConfirmDialog.tsx — 카테고리/게시물 삭제 확인 모달
// 문구만 다르고(카테고리: "여행", 게시물: "게시물") 디자인은 공용
// LeaveConfirmDialog/MCMWarningDialog와 동일한 가운데 정렬 카드형 모달 패턴
// ============================================================

import warningIcon from "@/assets/icons/warning3.png";

interface DeleteConfirmDialogProps {
  open: boolean;
  /** 예: "해당 여행을 삭제하시겠습니까?", "해당 게시물을 삭제하시겠습니까?" */
  title: string;
  /** 예: "삭제한 여행은 복구할 수 없습니다." */
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  title,
  description = "삭제한 내용은 복구할 수 없습니다.",
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* 오버레이: 배경 클릭 시 취소와 동일하게 닫힘 */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onCancel} aria-hidden="true" />

      {/* 모달: 화면 전체 기준 정중앙, w-72 h-56 */}
      <div className="fixed inset-0 z-51 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto relative h-56 w-72 overflow-hidden rounded-[20px] bg-stone-100">
          <div className="absolute left-[39px] top-[32px] flex w-52 flex-col items-center gap-2.5">
            <div className="flex w-full flex-col items-center gap-2.5">
              <img src={warningIcon} alt="" className="h-7 w-8 object-contain" />

              <div className="flex w-full flex-col items-center gap-[5px]">
                <p
                  style={{ fontFamily: "Paperlogy" }}
                  className="w-full text-center text-base font-bold tracking-tight text-slate-800"
                >
                  {title}
                </p>
                <p
                  style={{ fontFamily: "Paperlogy" }}
                  className="w-full text-center text-xs font-semibold tracking-tight text-slate-800/50"
                >
                  {description}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-[5px]">
              <button
                type="button"
                onClick={onCancel}
                style={{ fontFamily: "Paperlogy" }}
                className="h-9 w-full rounded-[10px] bg-slate-800 text-center text-xs font-bold tracking-tight text-stone-100"
              >
                유지하기
              </button>
              <button
                type="button"
                onClick={onConfirm}
                style={{ fontFamily: "Paperlogy" }}
                className="h-9 w-full rounded-[10px] bg-stone-300 text-center text-xs font-bold tracking-tight text-slate-800/50"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
