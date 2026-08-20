// ============================================================
// CountryAutocomplete.tsx — 나라 검색 자동완성 드롭다운
// 카테고리 생성/수정 페이지 등 나라 입력이 필요한 곳에서 공통으로 사용
// ============================================================

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useNations } from "@/hooks/queries/useNations";

interface CountryAutocompleteProps {
  value: string;
  onChange: (country: string) => void;
  disabled?: boolean;
}

const CountryAutocomplete = ({ value, onChange, disabled }: CountryAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: countries = [] } = useNations();

  const filteredCountries = countries.filter((c) => c.includes(query));

  const handleSelect = (country: string) => {
    onChange(country);
    setQuery("");
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (disabled) return;
    setQuery("");
    setIsOpen(true);
  };

  return (
    <div className="relative h-12">
      {isOpen ? (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute inset-x-0 top-0 z-20 overflow-hidden rounded-[10px] border-2 border-slate-800 bg-white shadow-lg">
            <div className="flex h-12 items-center gap-2 border-b border-[#D3C5BB] px-4">
              <Search className="size-5 shrink-0 text-slate-800" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="나라 검색"
                style={{ fontFamily: "Paperlogy" }}
                className="min-w-0 flex-1 bg-transparent text-center text-lg font-bold tracking-tight text-slate-800 outline-none placeholder:text-[#AC917C]"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="shrink-0 text-stone-400"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="max-h-64 overflow-y-auto bg-white">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => handleSelect(c)}
                      style={{ fontFamily: "Paperlogy" }}
                      className="w-full px-4 py-3 text-left text-base font-semibold tracking-tight text-slate-800 hover:bg-stone-100"
                    >
                      {c}
                    </button>
                  </li>
                ))
              ) : (
                <li
                  className="px-4 py-3 text-center text-sm text-[#AC917C]"
                  style={{ fontFamily: "Paperlogy" }}
                >
                  검색 결과가 없어요
                </li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          style={{ fontFamily: "Paperlogy" }}
          className={`h-12 w-full rounded-[10px] border-2 bg-white text-center tracking-tight disabled:opacity-60 ${
            value
              ? "border-slate-800 text-3xl font-bold text-slate-800"
              : "border-[#D3C5BB] text-sm font-semibold text-[#AC917C]"
          }`}
        >
          {value || "나라를 입력해주세요"}
        </button>
      )}
    </div>
  );
};

export default CountryAutocomplete;