import warningIcon from "@/assets/icons/warning2.png";

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
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* 상단 브라운 패널: 화면 폭 꽉 채움, 카드 아님 */}
      <div className="bg-[#AB6A37] px-8 pb-8 pt-16 text-center">
        <img src={warningIcon} alt="" className="mx-auto mb-3 h-9 w-9" />

        <p className="text-xl font-bold text-white" style={{ fontFamily: "Paperlogy" }}>
          {title}
        </p>
        <p className="mt-1.5 text-sm font-medium text-stone-100/50">{description}</p>

        <div className="mx-auto mt-6 flex max-w-70 flex-col gap-2.5 items-center">
          <button
            type="button"
            onClick={onConfirm}
            className="w-50 h-10 rounded-[100px] bg-white/40 px-6 text-lg font-semibold text-[#45454E] shadow-[0px_0px_5px_0px_rgba(94,140,136,0.25)] shadow-[inset_0px_3px_3px_0px_rgba(255,255,255,0.25)] shadow-[inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
            style={{ fontFamily: "Paperlogy" }}
          >
            삭제하기
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-50 h-10 rounded-[100px] bg-white/40 px-6 text-lg font-semibold text-white shadow-[0px_0px_5px_0px_rgba(94,140,136,0.25)] shadow-[inset_0px_3px_3px_0px_rgba(255,255,255,0.25)] shadow-[inset_0px_-1.5px_1.5px_0px_rgba(159,159,159,0.25)]"
            style={{ fontFamily: "Paperlogy" }}
          >
            취소하기
          </button>
        </div>
      </div>

      {/* 하단: 남은 화면(그리드 등)이 딤 처리되어 비침 */}
      <button type="button" aria-label="닫기" onClick={onCancel} className="flex-1 bg-black/40" />
    </div>
  );
}
