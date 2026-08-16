// ============================================================
// CategoryNew.tsx — 카테고리(여행) 생성 페이지
// Passport 페이지의 "카테고리 추가하기" 버튼에서 진입.
// 1단계: 헤더 + 표지사진 업로드 + 입력 필드 뼈대 (정적 상태만 구현)
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import CountryAutocomplete from "@/components/common/CountryAutocomplete";
import DateRangeField from "@/components/common/DateRangeField";
import LeaveConfirmDialog from "@/components/common/LeaveConfirmDialog";
import backIcon from "@/assets/icons/back.png";
import uploadIcon from "@/assets/icons/Upload.png";

const CategoryNew = () => {
  const navigate = useNavigate();

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [travelType, setTravelType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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

  const handleCreate = () => {
    if (!isFormValid || isCreating) return;
    setIsCreating(true);
    // TODO: 실제 생성 API 연동 시 아래 setTimeout을 API 호출로 교체
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="relative min-h-dvh max-w-97.5 mx-auto flex flex-col overflow-hidden bg-linear-to-b from-[#EDE5DC] to-[#F9F4F0]">
      {/* 배경 장식: 하단에서 떠오르는 원형 아치 (그라데이션 하단색과 같은 색이라 경계 없이 자연스럽게 이어짐) */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-115 -translate-x-1/2 size-187.5 rounded-full bg-[#F9F4F0]"
      />

      {/* 헤더 */}
      <header className="relative z-10 w-full h-32 shrink-0 bg-slate-800">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="absolute left-[34px] top-20.75 flex h-6 w-3.5 items-center justify-center text-stone-100"
        >
          <img src={backIcon} alt="" className="h-full w-full object-contain" />
        </button>

        <h1 className="absolute left-1/2 top-[81px] -translate-x-1/2 text-xl font-semibold tracking-tight text-stone-100 font-['Paperlogy']">
          여행 생성
        </h1>

        <div className="absolute left-0 top-[125px] h-1.5 w-full bg-yellow-700" />
      </header>

      {/* 본문 */}
      <main className="relative z-10 flex flex-1 flex-col gap-8 px-7.5 pt-7.5 pb-10">
        <div className="flex flex-col items-center gap-5">
          {/* 표지사진 업로드 */}
          <label className="relative flex h-96 w-64 cursor-pointer items-center justify-center overflow-hidden rounded-[10.43px] border-2 border-stone-300 bg-neutral-50">
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
                <p className="text-sm font-semibold tracking-tight text-stone-300 font-['Paperlogy']">
                  카테고리 표지사진을
                  <br />
                  올려주세요
                </p>
              </div>
            )}
          </label>

          {/* 입력 필드 */}
          <div className="flex w-full flex-col gap-1.5">
            {/* font-['Paperlogy']를 className으로 넣으면 Input 내부 cn()(tailwind-merge)이
                font-semibold와 같은 충돌 그룹으로 잘못 인식해 font-semibold를 지워버려서
                (렌더링된 font-weight가 400으로 빠짐) 인라인 style로 분리함 */}
            <CountryAutocomplete value={country} onChange={setCountry} disabled={isCreating} />
            <Input
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              placeholder="여행 유형을 적어주세요"
              disabled={isCreating}
              style={{ fontFamily: "Paperlogy" }}
              className={`h-12 rounded-[10px] border-2 bg-white text-center text-sm font-semibold tracking-tight placeholder:text-stone-300 disabled:opacity-60 ${
                travelType ? "border-slate-800" : "border-stone-300"
              }`}
            />
            {/* 날짜: range 캘린더 (시작일/종료일 선택) */}
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
          className={`h-14 rounded-[10px] px-6 text-xl font-semibold tracking-tight transition-colors ${
            isFormValid
              ? "cursor-pointer bg-slate-800 text-white shadow-[0px_0px_10px_0px_rgba(81,66,54,0.20)]"
              : "cursor-not-allowed bg-stone-300 text-stone-100 shadow-[1px_1px_1px_0px_rgba(81,66,54,0.30),inset_0px_2px_2px_0px_rgba(255,255,255,0.6),inset_0px_-2px_2px_0px_rgba(120,100,80,0.2)]"
          }`}
        >
          생성하기
        </button>
      </main>

      {/* 생성 중 로딩 오버레이: 헤더 포함 화면 전체를 덮음 */}
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
            새 카테고리를
            <br />
            생성중입니다
          </p>
        </div>
      )}

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
