// ============================================================
// CategoryNew.tsx — 카테고리(여행) 생성 페이지
// Passport 페이지의 "카테고리 추가하기" 버튼에서 진입.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/PageHeader";
import CountryAutocomplete from "@/components/common/CountryAutocomplete";
import DateRangeField from "@/components/common/DateRangeField";
import LeaveConfirmDialog from "@/components/common/LeaveConfirmDialog";
import uploadIcon from "@/assets/icons/Upload.png";
import { uploadImage } from "@/api/image";
import { useCreateJourney } from "@/hooks/queries/useCreateJourney";

// Date -> "YYYY-MM-DD" (요청 body 포맷, 화면 표시용 점포맷과 다름)
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const CategoryNew = () => {
  const navigate = useNavigate();
  const { mutateAsync: createJourney } = useCreateJourney();

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [travelType, setTravelType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverImage(URL.createObjectURL(file));
  };

  // 모든 필수 항목이 채워졌는지 여부 (생성하기 버튼 활성화 조건)
  const isFormValid = Boolean(coverImage && country && travelType && startDate && endDate);
  const hasAnyInput = Boolean(coverImage || country || travelType || startDate || endDate);
  const [isCreating, setIsCreating] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const handleBack = () => {
    // 일부만 입력된 상태(전부 입력도 전부 공백도 아님)에서 나가려 하면 확인 모달 노출
    if (hasAnyInput && !isFormValid) {
      setIsLeaveDialogOpen(true);
      return;
    }
    navigate(-1);
  };

  const handleCreate = async () => {
    if (!isFormValid || isCreating || !coverImageFile || !startDate || !endDate) return;
    setIsCreating(true);

    try {
      // 1. 표지사진 업로드 -> imgUrl 획득
      const imgUrl = await uploadImage(coverImageFile, "NATION"); // TODO: dirName 실제 enum값 확인 필요

      // 2. 여행 생성
      await createJourney({
        imgUrl,
        nationName: country,
        type: travelType,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      navigate("/passport", { replace: true });
    } catch (error) {
      console.error(error);
      setIsCreating(false);
      // TODO: 실패 시 사용자 안내(토스트 등) 추가 필요
    }
  };

  return (
    <div className="relative min-h-dvh max-w-97.5 mx-auto flex flex-col bg-linear-to-b from-[#EDE5DC] to-[#F9F4F0]">
      {/* 배경 장식: 하단에서 떠오르는 원형 아치 (그라데이션 하단색과 같은 색이라 경계 없이 자연스럽게 이어짐) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-115 -translate-x-1/2 size-187.5 rounded-full bg-[#F9F4F0]" />
      </div>

      {/* 공용 PageHeader 사용. 일부입력 상태 이탈 확인 로직 때문에 onBackClick으로 커스텀 */}
      <PageHeader title="여행 생성" onBackClick={handleBack} />

      {/* 본문: relative 추가 -> 로딩 오버레이가 헤더 높이를 픽셀로 고정하지 않고
          이 컨테이너 기준 absolute inset-0로 자연스럽게 붙도록 함 */}
      <main className="relative mt-[0.5rem] z-10 flex flex-1 flex-col gap-8 px-7.5 pt-7.5 pb-10">
        <div className="flex flex-col items-center gap-5">
          {/* 표지사진 업로드: 테두리 #D3C5BB, 크기 264x360, 안내 문구 색상 #AC917C */}
          <label className="relative flex h-90 w-66 cursor-pointer items-center justify-center overflow-hidden rounded-[0.651875rem] border-2 border-[#D3C5BB] bg-neutral-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isCreating}
            />
            {coverImage ? (
              <img src={coverImage} alt="선택된 표지사진" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3.5 text-center">
                <img src={uploadIcon} alt="" className="size-10 object-contain" />
                <p className="text-sm font-semibold tracking-tight text-[#AC917C] font-['Paperlogy']">
                  카테고리 표지사진을
                  <br />
                  올려주세요
                </p>
              </div>
            )}
          </label>

          {/* 입력 필드 */}
          <div className="flex w-full flex-col gap-1.5">
            <CountryAutocomplete value={country} onChange={setCountry} disabled={isCreating} />
            <Input
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              placeholder="여행 유형을 적어주세요"
              disabled={isCreating}
              style={{ fontFamily: "Paperlogy" }}
              className={`h-12 rounded-[0.625rem] border-2 bg-white text-center text-xl font-semibold tracking-tight text-[#19273C] placeholder:text-[#AC917C] placeholder:text-sm disabled:opacity-60 ${
                travelType ? "border-slate-800" : "border-[#D3C5BB]"
              }`}
            />
            <DateRangeField
              startDate={startDate}
              endDate={endDate}
              disabled={isCreating}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
          </div>
        </div>

        {/* 생성하기 버튼: 모든 항목 입력 시에만 활성화 */}
        <button
          type="button"
          disabled={!isFormValid || isCreating}
          onClick={handleCreate}
          style={{ fontFamily: "Paperlogy" }}
          className={`h-14 rounded-[0.625rem] px-6 text-xl font-semibold tracking-tight transition-colors ${
            isFormValid
              ? "cursor-pointer bg-slate-800 text-white shadow-[0rem_0rem_0.625rem_0rem_rgba(81,66,54,0.20)]"
              : "cursor-not-allowed bg-stone-300 text-stone-100 shadow-[0.0625rem_0.0625rem_0.0625rem_0rem_rgba(81,66,54,0.30),inset_0rem_0.125rem_0.125rem_0rem_rgba(255,255,255,0.6),inset_0rem_-0.125rem_0.125rem_0rem_rgba(120,100,80,0.2)]"
          }`}
        >
          생성하기
        </button>

        {/* 생성 중 로딩 오버레이: main 기준 inset-0라 헤더 높이가 바뀌어도 자동으로 맞음 */}
        {isCreating && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/60">
            <div className="flex gap-2">
              <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-white" />
            </div>

            <p
              style={{ fontFamily: "Paperlogy" }}
              className="text-center text-2xl font-bold tracking-wide text-stone-100"
            >
              새 여행을
              <br />
              등록 중입니다.
            </p>
          </div>
        )}
      </main>

      {/* 미입력 상태 이탈 확인 모달 */}
      {isLeaveDialogOpen && (
        <LeaveConfirmDialog
          onContinue={() => setIsLeaveDialogOpen(false)}
          onLeave={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default CategoryNew;
