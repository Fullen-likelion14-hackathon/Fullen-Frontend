// ============================================================
// CategoryEdit.tsx — 카테고리(여행) 수정 페이지
// CategoryNew.tsx 기반, 기존 값으로 초기화 + 수정 로직 + 헤더 텍스트만 변경
//
// 진입 경로: CategoryFeed 등에서 "수정하기" 클릭 시
//   navigate(`/passport/${categoryId}/edit`, { state: category })
// 로 기존 카테고리 데이터를 넘겨준다고 가정.
//
// ⚠️ PUT /api/journeys/{journeyId}는 nationName을 받지 않음(imgUrl/type/startDate/endDate만).
// 그래서 나라 필드는 화면엔 남겨두되 수정 불가(readonly) 처리함.
// ============================================================

import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/PageHeader";
import CountryAutocomplete from "@/components/common/CountryAutocomplete";
import DateRangeField from "@/components/common/DateRangeField";
import LeaveConfirmDialog from "@/components/common/LeaveConfirmDialog";
import uploadIcon from "@/assets/icons/Upload.png";
import { uploadImage } from "@/api/image";
import { useUpdateJourney } from "@/hooks/queries/useUpdateJourney";

type CategoryEditState = {
  coverImageUrl?: string;
  country?: string;
  travelType?: string;
  startDate?: string; // "YYYY.MM.DD" 형식으로 넘어옴 (categoryFeedMockData 기준)
  endDate?: string;
};

// "2026.07.31" -> Date. new Date("2026.07.31")는 브라우저마다 파싱 결과가 달라 불안정해서 직접 분해
const parseDotDate = (value?: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split(".").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

// Date -> "YYYY-MM-DD" (요청 body 포맷)
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const { mutateAsync: updateJourney } = useUpdateJourney();

  // TODO: 실제 조회 API/훅이 있다면 이 부분을 useJourney(categoryId) 같은 훅으로 교체
  const initialCategory = (location.state as CategoryEditState | null) ?? null;

  const initialValues = useMemo(
    () => ({
      coverImage: initialCategory?.coverImageUrl ?? null,
      country: initialCategory?.country ?? "",
      travelType: initialCategory?.travelType ?? "",
      startDate: parseDotDate(initialCategory?.startDate),
      endDate: parseDotDate(initialCategory?.endDate),
    }),
    [initialCategory],
  );
  // 변경 여부 비교 기준값 (최초 로드 시점 값으로 고정).
  // useRef.current를 렌더 중에 읽으면 React Compiler가 금지하는 패턴이라 useState로 스냅샷을 잡음
  const [initialSnapshot] = useState(initialValues);

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(initialValues.coverImage);
  const [country] = useState(initialValues.country); // 수정 API가 nationName을 안 받아서 readonly
  const [travelType, setTravelType] = useState(initialValues.travelType);
  const [startDate, setStartDate] = useState<Date | null>(initialValues.startDate);
  const [endDate, setEndDate] = useState<Date | null>(initialValues.endDate);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverImage(URL.createObjectURL(file));
  };

  // 모든 필수 항목이 채워졌는지 여부 (저장하기 버튼 활성화 조건)
  const isFormValid = Boolean(coverImage && country && travelType && startDate && endDate);

  // 최초 로드 값 대비 하나라도 바뀌었는지 (뒤로가기 시 경고모달 노출 조건). 나라는 readonly라 비교 제외
  const hasChanges =
    coverImage !== initialSnapshot.coverImage ||
    travelType !== initialSnapshot.travelType ||
    startDate?.getTime() !== initialSnapshot.startDate?.getTime() ||
    endDate?.getTime() !== initialSnapshot.endDate?.getTime();

  const [isSaving, setIsSaving] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  // 뒤로가기: 변경사항이 하나라도 있으면 확인 모달 노출
  const handleBack = () => {
    if (hasChanges) {
      setIsLeaveDialogOpen(true);
      return;
    }
    navigate(-1);
  };

  const handleSave = async () => {
    if (!isFormValid || isSaving || !categoryId || !startDate || !endDate) return;
    setIsSaving(true);

    try {
      // 표지사진을 새로 올린 경우에만 업로드, 아니면 기존 URL 그대로 사용
      const imgUrl = coverImageFile
        ? await uploadImage(coverImageFile, "NATION") // TODO: 카테고리용 dirName 생기면 교체
        : (coverImage as string);

      await updateJourney({
        journeyId: Number(categoryId),
        payload: {
          imgUrl,
          type: travelType,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      navigate(`/passport/${categoryId}`, { replace: true });
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      // TODO: 실패 시 사용자 안내(토스트 등) 추가 필요
    }
  };

  return (
    <div className="relative min-h-dvh max-w-97.5 mx-auto flex flex-col overflow-hidden bg-linear-to-b from-[#EDE5DC] to-[#F9F4F0]">
      {/* 배경 장식: 하단에서 떠오르는 원형 아치 */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-115 -translate-x-1/2 size-187.5 rounded-full bg-[#F9F4F0]"
      />

      {/* 공용 PageHeader 사용, 뒤로가기 시 변경사항 확인 로직을 위해 onBackClick으로 커스텀 */}
      <PageHeader title="여행 수정" onBackClick={handleBack} />

      {/* 본문 */}
      <main className="mt-[0.5rem] relative z-10 flex flex-1 flex-col gap-8 px-7.5 pt-7.5 pb-10">
        <div className="flex flex-col items-center gap-5">
          {/* 표지사진: 기존 사진이 있으면 바로 보여주고, 클릭 시 재업로드 가능 (CategoryNew와 동일 UI) */}
          <label className="relative flex h-90 w-66 cursor-pointer items-center justify-center overflow-hidden rounded-[10.43px] border-2 border-[#D3C5BB] bg-neutral-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isSaving}
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

          {/* 입력 필드 (CategoryNew와 동일 컴포넌트, 초기값만 채워서 사용) */}
          <div className="flex w-full flex-col gap-1.5">
            {/* 나라는 수정 API가 지원하지 않아 readonly. onChange는 CountryAutocomplete가 요구하는 prop이라 no-op으로 전달 */}
            <CountryAutocomplete value={country} onChange={() => {}} disabled />
            <Input
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              placeholder="여행 유형을 적어주세요"
              disabled={isSaving}
              style={{ fontFamily: "Paperlogy" }}
              className={`h-12 rounded-[10px] border-2 bg-white text-center text-xl font-semibold tracking-tight text-[#19273C] placeholder:text-[#AC917C] placeholder:text-sm disabled:opacity-60 ${
                travelType ? "border-slate-800" : "border-[#D3C5BB]"
              }`}
            />
            <DateRangeField
              startDate={startDate}
              endDate={endDate}
              disabled={isSaving}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
          </div>
        </div>

        {/* 저장하기 버튼: 생성하기와 동일 스타일, 라벨/핸들러만 변경 */}
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

      {/* 저장 중 로딩 오버레이 */}
      {isSaving && (
        <div className="absolute inset-x-0 bottom-0 top-[7.8125rem] z-50 flex flex-col items-center justify-center gap-4 bg-black/60">
          <div className="flex gap-2">
            <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-white" />
          </div>

          <p
            style={{ fontFamily: "Paperlogy" }}
            className="text-center text-2xl font-bold tracking-wide text-stone-100"
          >
            여행 정보를
            <br />
            수정 중입니다.
          </p>
        </div>
      )}

      {/* 변경사항 있는 상태에서 뒤로가기 시도 시 확인 모달 */}
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

export default CategoryEdit;
