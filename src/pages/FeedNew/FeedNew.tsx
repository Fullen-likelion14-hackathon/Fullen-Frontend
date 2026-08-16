// ============================================================
// FeedNew.tsx — 새로운 게시물 생성 페이지
// CategoryFeed(카테고리 내 피드 목록) 페이지의 "새 게시물 추가" 버튼에서 진입.
// 사진 업로드(최대 5장) + 코멘트 + 공개/비공개 토글 + 생성하기
// ============================================================

import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MCMWarningDialog from "@/components/common/MCMWarningDialog";
import backIcon from "@/assets/icons/back.png";
import uploadIcon from "@/assets/icons/Upload.png";
import eyeOpenIcon from "@/assets/icons/public.png";
import eyeClosedIcon from "@/assets/icons/private.png";

const MAX_IMAGES = 5;

const FeedNew = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const nextFiles = Array.from(files).slice(0, remainingSlots);
    const nextUrls = nextFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...nextUrls]);
    e.target.value = ""; // 같은 파일 재선택 가능하도록 초기화
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = images.length > 0 && comment.trim() !== "";

  // TODO: 실제 MCM 제품 판별 API 연동 시 이 함수 내부를 교체
  // 지금은 항상 통과(true)로 처리, 실패 케이스 테스트하려면 false로 바꿔서 확인
  const checkIsMcmProduct = async (_imageUrls: string[]): Promise<boolean> => {
    return true;
  };

  const handleCreate = async () => {
    if (!isFormValid || isCreating) return;

    setIsCreating(true);
    const isMcmProduct = await checkIsMcmProduct(images);

    if (!isMcmProduct) {
      setIsCreating(false);
      setIsWarningOpen(true);
      return;
    }

    // TODO: 실제 생성 API 연동 시 아래 setTimeout을 API 호출로 교체
    setTimeout(() => {
      navigate(`/passport/${categoryId}`);
    }, 1500);
  };

  // 경고 모달: 다시 선택하기 → 파일 선택창 재오픈
  const handleReselect = () => {
    setIsWarningOpen(false);
    fileInputRef.current?.click();
  };

  // 경고 모달: 해당 사진 삭제하기 → 마지막으로 추가된 사진 제거
  const handleDeleteOffendingPhoto = () => {
    setImages((prev) => prev.slice(0, -1));
    setIsWarningOpen(false);
  };

  return (
    <div className="relative min-h-dvh max-w-97.5 mx-auto flex flex-col overflow-hidden bg-linear-to-b from-[#EDE5DC] to-[#F9F4F0]">
      {/* 배경 장식: CategoryNew와 동일 */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-115 -translate-x-1/2 size-187.5 rounded-full bg-[#F9F4F0]"
      />

      {/* 헤더: CategoryNew와 동일 구조, 타이틀만 변경 */}
      <header className="relative z-10 w-full h-32 shrink-0 bg-slate-800">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          disabled={isCreating}
          className="absolute left-[34px] top-20.75 flex h-6 w-3.5 items-center justify-center text-stone-100"
        >
          <img src={backIcon} alt="" className="h-full w-full object-contain" />
        </button>

        <h1 className="absolute left-1/2 top-[81px] -translate-x-1/2 text-xl font-semibold tracking-tight text-stone-100 font-['Paperlogy']">
          게시물 생성
        </h1>

        <div className="absolute left-0 top-[125px] h-1.5 w-full bg-yellow-700" />
      </header>

      {/* 본문 */}
      <main className="relative z-10 flex flex-1 flex-col gap-5 px-7.5 pt-7.5 pb-10">
        <div className="flex flex-col items-center gap-3.5">
          {/* 사진 업로드 영역 */}
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
            // 빈 상태: CategoryNew 업로드 박스와 동일한 톤
            <label className="relative flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[10px] border-2 border-stone-300 bg-white text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={isCreating}
              />
              <img src={uploadIcon} alt="" className="size-10 object-contain" />
              <p className="text-sm font-semibold tracking-tight text-stone-300 font-['Paperlogy']">
                포스팅할 사진을 고르세요
                <br />
                (최대 5장)
              </p>
            </label>
          ) : (
            // 채워진 상태: 가로 스크롤 캐러셀 + 슬롯 남으면 추가 버튼
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
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    ×
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

          {/* 코멘트 입력 */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="코멘트를 입력해주세요."
            disabled={isCreating}
            style={{ fontFamily: "Paperlogy" }}
            className={`h-48 w-full resize-none rounded-[10px] border-2 bg-white p-3 text-sm font-normal leading-4 tracking-tight text-zinc-900 placeholder:font-semibold placeholder:text-stone-300 disabled:opacity-60 transition-colors placeholder-shown:pt-22 placeholder-shown:text-center ${
              comment ? "border-slate-800" : "border-stone-300"
            }`}
          />

          {/* 공개/비공개 토글 */}
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
              className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${
                isPublic ? "bg-slate-800" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-[3px] flex size-7 items-center justify-center rounded-full bg-white transition-all ${
                  isPublic ? "left-[calc(100%-31px)]" : "left-[3px]"
                }`}
              >
                <img
                  src={isPublic ? eyeOpenIcon : eyeClosedIcon}
                  alt=""
                  className="size-4 object-contain"
                />
              </span>
            </button>
          </div>
        </div>

        {/* 생성하기 버튼 */}
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

      {/* MCM 제품 미인식 경고 모달 */}
      {isWarningOpen && (
        <MCMWarningDialog onReselect={handleReselect} onDeletePhoto={handleDeleteOffendingPhoto} />
      )}
    </div>
  );
};

export default FeedNew;
