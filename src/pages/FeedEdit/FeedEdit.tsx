// ============================================================
// FeedEdit.tsx — 게시물 수정 페이지
// FeedNew.tsx 기반, 기존 값으로 초기화 + 수정 로직 + 헤더만 변경
// ============================================================

import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "@/components/common/PageHeader";
import MCMWarningDialog from "@/components/common/MCMWarningDialog";
import LeaveConfirmDialog from "@/components/common/LeaveConfirmDialog";
import { uploadImage } from "@/api/image";
import { useUpdatePost } from "@/hooks/queries/useUpdatePost";
import uploadIcon from "@/assets/icons/Upload.png";
import eyeOpenIcon from "@/assets/icons/public.png";
import eyeClosedIcon from "@/assets/icons/private.png";
import deletePhotoIcon from "@/assets/icons/deletephoto.png";

const MAX_IMAGES = 5;

type FeedEditState = {
  images?: string[];
  comment?: string;
  isPublic?: boolean;
};

// 기존 업로드된 이미지(url만 있음)와 새로 추가한 이미지(file 있음, 저장 시 업로드 필요)를 구분
interface ImageItem {
  previewUrl: string;
  file?: File;
}

const FeedEdit = () => {
  const navigate = useNavigate();
  const { categoryId, feedId } = useParams();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: updatePost } = useUpdatePost(Number(feedId));

  const initialFeed = (location.state as FeedEditState | null) ?? null;

  const initialValues = useMemo(
    () => ({
      images: (initialFeed?.images ?? []).map((url): ImageItem => ({ previewUrl: url })),
      comment: initialFeed?.comment ?? "",
      isPublic: initialFeed?.isPublic ?? false,
    }),
    [initialFeed],
  );
  const [initialSnapshot] = useState(initialValues);

  const [images, setImages] = useState<ImageItem[]>(initialValues.images);
  const [comment, setComment] = useState(initialValues.comment);
  const [isPublic, setIsPublic] = useState(initialValues.isPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const nextFiles = Array.from(files).slice(0, remainingSlots);
    const nextItems = nextFiles.map((file): ImageItem => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...nextItems]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = images.length > 0 && comment.trim() !== "";

  // 최초 로드 값 대비 하나라도 바뀌었는지 (뒤로가기 시 경고모달 노출 조건)
  const hasChanges =
    images.length !== initialSnapshot.images.length ||
    images.some((item, i) => item.previewUrl !== initialSnapshot.images[i]?.previewUrl) ||
    comment !== initialSnapshot.comment ||
    isPublic !== initialSnapshot.isPublic;

  const handleSave = async () => {
    if (!isFormValid || isSaving || !feedId) return;

    setIsSaving(true);

    try {
      // 기존 이미지는 url 그대로, 새로 추가한 이미지만 업로드해서 url 획득 (순서 유지)
      const imgUrlList = await Promise.all(
        images.map((item) => (item.file ? uploadImage(item.file, "FEED") : item.previewUrl)),
      );

      await updatePost({
        comment,
        isPublic,
        imgUrlList,
      });

      navigate(`/passport/${categoryId}/${feedId}`, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === "S4003") {
        setIsWarningOpen(true);
        return;
      }
      console.error(error);
      // TODO: MCM 판별 실패가 아닌 그 외 에러(네트워크/인증 등) 사용자 안내 추가 필요
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseWarning = () => {
    setIsWarningOpen(false);
  };

  // 뒤로가기: 변경사항이 하나라도 있으면 확인 모달 노출
  const handleBack = () => {
    if (hasChanges) {
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

      {/* 공용 PageHeader 사용, 뒤로가기 시 변경사항 확인 로직을 위해 onBackClick으로 커스텀 */}
      <PageHeader title="게시물 수정" onBackClick={handleBack} />

      <main className="relative z-10 flex flex-1 flex-col gap-5 px-7.5 pt-7.5 pb-10">
        <div className="flex flex-col items-center gap-3.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={isSaving || images.length >= MAX_IMAGES}
          />

          {images.length === 0 ? (
            <label className="relative flex h-[301px] w-[330px] cursor-pointer flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[10px] border-2 border-stone-300 bg-white text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={isSaving}
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
              {images.map((item, index) => (
                <div
                  key={item.previewUrl}
                  className="relative h-72 w-64 shrink-0 snap-start overflow-hidden rounded-[10px] border-2 border-stone-300"
                >
                  <img
                    src={item.previewUrl}
                    alt={`업로드 사진 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSaving}
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
                  disabled={isSaving}
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
            disabled={isSaving}
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
              disabled={isSaving}
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
          disabled={!isFormValid || isSaving}
          onClick={handleSave}
          style={{ fontFamily: "Paperlogy" }}
          className={`h-14 rounded-[10px] px-6 text-xl font-semibold tracking-tight transition-colors ${
            isFormValid
              ? "cursor-pointer bg-slate-800 text-white shadow-[0px_0px_10px_0px_rgba(81,66,54,0.20)]"
              : "cursor-not-allowed bg-stone-300 text-stone-100 shadow-[1px_1px_1px_0px_rgba(81,66,54,0.30),inset_0px_2px_2px_0px_rgba(255,255,255,0.6),inset_0px_-2px_2px_0px_rgba(120,100,80,0.2)]"
          }`}
        >
          저장하기
        </button>
      </main>

      {isWarningOpen && <MCMWarningDialog onClose={handleCloseWarning} />}

      {isLeaveDialogOpen && (
        <LeaveConfirmDialog
          onContinue={() => setIsLeaveDialogOpen(false)}
          onLeave={() => navigate(-1)}
          title="수정을 중단하시겠습니까?"
          subtitle="기존 입력사항으로 유지됩니다."
          continueLabel="이어서 수정하기"
          leaveLabel="수정 중단하기"
        />
      )}
    </div>
  );
};

export default FeedEdit;
