// ============================================================
// DateRangeField.tsx — 여행 기간(시작일~종료일) range 캘린더
// 카테고리 생성 페이지에서 사용, react-day-picker 등 외부 캘린더 라이브러리 없이
// 순수 Date 계산으로 구현(팀 패키지 추가 없이 바로 동작하도록)
// ============================================================

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangeFieldProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  disabled?: boolean;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const pad2 = (n: number) => String(n).padStart(2, "0");
const formatDate = (d: Date) => `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const DateRangeField = ({ startDate, endDate, onChange, disabled }: DateRangeFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = startDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const goToday = () => setViewMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const goPrevMonth = () => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goNextMonth = () => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const handleDayClick = (day: Date) => {
    // 아직 시작일이 없거나, 시작/종료가 이미 둘 다 있는 상태(=새로 다시 고르는 상황)면 시작일부터 다시 지정
    if (!startDate || (startDate && endDate)) {
      onChange(day, null);
      return;
    }
    // 시작일만 있는 상태 → 종료일 지정 (시작일보다 이전 날짜면 순서 교체)
    if (day < startDate) {
      onChange(day, startDate);
    } else {
      onChange(startDate, day);
    }
    setIsOpen(false);
  };

  // 달력 그리드 생성 (일요일 시작, 앞뒤 빈 칸 포함)
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingBlanks = firstDay.getDay();
  const totalCells = leadingBlanks + lastDay.getDate();
  const cells: (Date | null)[] = Array.from({ length: totalCells }, (_, i) =>
    i < leadingBlanks ? null : new Date(year, month, i - leadingBlanks + 1),
  );

  const hasRange = startDate && endDate;

  return (
    <div className="relative">
      {/* 필드 본체 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        style={{ fontFamily: "Paperlogy" }}
        className={`h-10 w-full rounded-[0.625rem] border-2 bg-white text-center tracking-tight disabled:opacity-60 ${
          hasRange
            ? "border-slate-800 text-base font-semibold text-slate-800"
            : "border-[#D3C5BB] text-sm font-semibold text-[#AC917C]"
        }`}
      >
        {hasRange ? `${formatDate(startDate)}  ~  ${formatDate(endDate)}` : "날짜를 선택해주세요"}
      </button>

      {isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-10 bg-black/30"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-1/2 top-1/2 z-20 w-[17.5rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-300 bg-white p-4 shadow-lg">
            {/* 시작일/종료일 표시 */}
            <div className="mb-3 flex gap-2">
              <div
                style={{ fontFamily: "Paperlogy" }}
                className={`flex-1 rounded-lg border px-2 py-2 text-center text-xs font-semibold ${
                  startDate ? "border-blue-500 text-slate-800" : "border-stone-200 text-stone-300"
                }`}
              >
                {startDate ? formatDate(startDate) : "시작일"}
              </div>
              <div
                style={{ fontFamily: "Paperlogy" }}
                className={`flex-1 rounded-lg border px-2 py-2 text-center text-xs font-semibold ${
                  endDate ? "border-stone-300 text-slate-800" : "border-stone-200 text-stone-300"
                }`}
              >
                {endDate ? formatDate(endDate) : "종료일"}
              </div>
            </div>

            {/* 월 헤더 + 오늘/이전/다음 */}
            <div className="mb-2 flex items-center justify-between">
              <span
                style={{ fontFamily: "Paperlogy" }}
                className="text-sm font-semibold text-slate-800"
              >
                {year}년 {month + 1}월
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToday}
                  className="text-xs font-semibold text-slate-500"
                >
                  오늘
                </button>
                <button type="button" onClick={goPrevMonth} aria-label="이전 달">
                  <ChevronLeft className="size-4 text-slate-800" />
                </button>
                <button type="button" onClick={goNextMonth} aria-label="다음 달">
                  <ChevronRight className="size-4 text-slate-800" />
                </button>
              </div>
            </div>

            {/* 요일 헤더 */}
            <div className="mb-1 grid grid-cols-7">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1 text-center text-xs text-stone-400">
                  {w}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;

                const isStart = startDate && isSameDay(day, startDate);
                const isEnd = endDate && isSameDay(day, endDate);
                const isInRange = startDate && endDate && day > startDate && day < endDate;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`mx-auto flex size-7 items-center justify-center rounded-full text-xs ${
                      isStart || isEnd
                        ? "bg-blue-500 font-semibold text-white"
                        : isInRange
                          ? "bg-blue-100 text-slate-800"
                          : "text-slate-800 hover:bg-stone-100"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeField;
