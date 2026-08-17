// ============================================================
// FeedNew.tsx — 새로운 게시물 생성 페이지
// CategoryFeed(카테고리 내 피드 목록) 페이지의 "새 게시물 추가" 버튼에서 진입.
// 사진 업로드(최대 5장) + 코멘트 + 공개/비공개 토글 + 생성하기
// ============================================================

import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import MCMWarningDialog, { type MCMWarningType } from "@/components/common/MCMWarningDialog";
import LeaveConfirmDialog from "@/components/common/LeaveConfirmDialog";
import uploadIcon from "@/assets/icons/Upload.png";
import eyeOpenIcon from "@/assets/icons/public.png";
import eyeClosedIcon from "@/assets/icons/private.png";
import deletePhotoIcon from "@/assets/icons/deletephoto.png";

const MAX_IMAGES = 5;

type McmCheckResult = "valid" | MCMWarningType;

const FeedNew = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningType, setWarningType] = useState<MCMWarningType>("no-mcm-photo");
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const nextFiles = Array.from(files).slice(0, remainingSlots);
    const nextUrls = nextFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...nextUrls]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = images.length > 0 && comment.trim() !== "";
  const hasAnyInput = images.length > 0 || comment.trim() !== "";

  const checkIsMcmProduct = async (_imageUrls: string[]): Promise<McmCheckResult> => {
    return "no-mcm-photo";
  };

  const handleCreate = async () => {
    if (!isFormValid || isCreating) return;

    setIsCreating(true);
    const result = await checkIsMcmProduct(images);

    if (result !== "valid") {
      setIsCreating(false);
      setWarningType(result);
      setIsWarningOpen(true);
      return;
    }

    setTimeout(() => {
      navigate(`/passport/${categoryId}`);
    }, 1500);
  };

  const handleCloseWarning = () => {
    setIsWarningOpen(false);
  };

  // 뒤로가기: 일부만 입력된 상태(전부 입력도 전부 공백도 아님)에서 나가려 하면 확인 모달 노출
  const handleBack = () => {
    if (hasAnyInput && !isFormValid) {
      setIsLeaveDialogOpen(true);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="relative min-h-dvh max-w-97.5 mx-auto flex flex-col overflow-hidden bg-linear-to-b from-[#EDE5DC] to-[#F9F4F0]">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-115 -translate-x-1/2 size-187.5 rounded-full bg-[#F9F4F0]"
      />

      {/* 공용 PageHeader 사용. 일부입력 상태 이탈 확인 로직 때문에 onBackClick으로 커스텀 */}
      <PageHeader title="게시물 생성" onBackClick={handleBack} />

      <main className="relative z-10 flex flex-1 flex-col gap-5 px-7.5 pt-7.5 pb-10">
        <div className="flex flex-col items-center gap-3.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={isCreating || images.length >= MAX_IMAGES}
          />

          {images.length === 0 ? (
            <label className="relative flex h-[301px] w-[330px] cursor-pointer flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[10px] border-2 border-stone-300 bg-white text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={isCreating}
              />
              <img src={uploadIcon} alt="" className="size-10 object-contain" />
              <p className="text-sm font-semibold tracking-tight text-[#AC917C] font-['Paperlogy']">
                포스팅할 사진을 고르세요
                <br />
                (최대 5장)
              </p>
            </label>
          ) : (
            <div className="flex h-72 w-full gap-2 overflow-x-auto rounded-[10px]">
              {images.map((url, index) => (
                <div
                  key={url}
                  className="relative h-72 w-64 shrink-0 snap-start overflow-hidden rounded-[10px] border-2 border-stone-300"
                >
                  <img
                    src={url}
                    alt={`업로드 사진 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isCreating}
                    aria-label="사진 삭제"
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full text-white"
                  >
                    <img src={deletePhotoIcon} alt="" className="size-4 object-contain" />
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCreating}
                  className="flex h-72 w-24 shrink-0 items-center justify-center rounded-[10px] border-2 border-dashed border-stone-300 bg-white text-stone-300"
                >
                  <img src={uploadIcon} alt="사진 추가" className="size-8 object-contain" />
                </button>
              )}
            </div>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="코멘트를 입력해주세요."
            disabled={isCreating}
            style={{ fontFamily: "Paperlogy" }}
            className={`h-[162px] w-full resize-none rounded-[10px] border-2 bg-white p-3 text-sm font-normal leading-4 tracking-tight text-zinc-900 placeholder:font-semibold placeholder:text-[#AC917C] disabled:opacity-60 transition-colors placeholder-shown:pt-[70px] placeholder-shown:text-center ${
              comment ? "border-slate-800" : "border-stone-300"
            }`}
          />

          <div className="flex h-14 w-full items-center justify-between gap-6 rounded-[10px] bg-white px-3.5">
            <p
              style={{ fontFamily: "Paperlogy" }}
              className="text-xs font-semibold leading-4 text-stone-300"
            >
              해당 게시물을 공개여부를 설정해주세요.
              <br />
              공개 설정 시 MCM 아카이브에 등록됩니다.
            </p>
            <button
              type="button"
              onClick={() => setIsPublic((prev) => !prev)}
              disabled={isCreating}
              aria-pressed={isPublic}
              aria-label="공개 여부 토글"
              className="relative h-9 w-16 shrink-0 rounded-full bg-stone-300 transition-colors"
            >
              <span
                className={`absolute top-[3px] flex size-7 items-center justify-center rounded-full bg-white transition-all ${
                  isPublic ? "left-[calc(100%-31px)]" : "left-[3px]"
                }`}
              >
                <img
                  src={isPublic ? eyeOpenIcon : eyeClosedIcon}
                  alt=""
                  className="size-6.5 object-contain"
                />
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!isFormValid || isCreating}
          onClick={handleCreate}
          style={{ fontFamily: "Paperlogy" }}
          className={`h-14 rounded-[10px] px-6 text-xl font-semibold tracking-tight transition-colors ${
            isFormValid
              ? "cursor-pointer bg-slate-800 text-white shadow-[0px_0px_10px_0px_rgba(81,66,54,0.20)]"
              : "cursor-not-allowed bg-stone-300 text-stone-100 shadow-[1px_1px_1px_0px_rgba(81,66,54,0.30),inset_0px_2px_2px_0px_rgba(255,255,255,0.6),inset_0px_-2px_2px_0px_rgba(120,100,80,0.2)]"
          }`}
        >
          생성하기
        </button>
      </main>

      {isWarningOpen && <MCMWarningDialog type={warningType} onClose={handleCloseWarning} />}

      {isLeaveDialogOpen && (
        <LeaveConfirmDialog
          onContinue={() => setIsLeaveDialogOpen(false)}
          onLeave={() => navigate(-1)}
          title="게시물 생성을 중단하시겠습니까?"
          subtitle="지금까지 선택한 사항들이 전부 삭제됩니다"
          continueLabel="이어서 생성하기"
          leaveLabel="게시물 생성 중단하기"
        />
      )}
    </div>
  );
};

export default FeedNew;
