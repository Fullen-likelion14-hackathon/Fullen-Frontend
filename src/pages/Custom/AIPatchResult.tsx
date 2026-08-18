import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NoticeToast from "@/components/common/NoticeToast";
import AIPatchResultSlider from "@/components/custom/ai/AIPatchResultSlider";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { aiPatchResultMock, type AIPatchResultItem } from "@/mocks/aiPatchResult.mock";

type ToastState = {
  type: "created" | "applied";
  message: string;
} | null;

const AIPatchResult = () => {
  const navigate = useNavigate();

  // 현재는 mock 데이터 사용함
  // 추후 AI 패치 생성 API 응답값으로 교체 예정임
  const [patches, setPatches] = useState<AIPatchResultItem[]>(aiPatchResultMock);

  // 현재 화면 가운데에 표시되는 패치 번호임
  const [currentIndex, setCurrentIndex] = useState(0);

  // 저장 완료된 패치 id 목록임
  const [savedPatchIds, setSavedPatchIds] = useState<number[]>([]);

  // 저장 결과 안내 토스트 상태임
  const [toast, setToast] = useState<ToastState>(null);

  // 현재 선택된 패치 정보임
  const currentPatch = patches[currentIndex];

  // 토스트를 일정 시간 뒤 자동으로 닫아줌
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // 현재 보고 있는 패치 변경함
  const handlePatchChange = (index: number) => {
    setCurrentIndex(index);
  };

  // 현재 선택한 패치 저장 처리함
  const handleSave = () => {
    if (!currentPatch) return;

    // 이미 저장한 패치인 경우 안내함
    if (savedPatchIds.includes(currentPatch.id)) {
      setToast({
        type: "created",
        message: "이미 저장한 패치입니다",
      });

      return;
    }

    // TODO: 실제 패치 저장 API 연결 예정임
    setSavedPatchIds((prev) => [...prev, currentPatch.id]);

    setToast({
      type: "created",
      message: `패치 ${currentIndex + 1}안을 저장했습니다`,
    });
  };

  // 선택한 옵션 기준으로 AI 패치 디자인 다시 생성 요청함
  const handleRegenerate = () => {
    // TODO: 실제 AI 패치 재생성 API 연결 예정임
    console.log("AI 패치 디자인 다시 생성 요청");

    // 현재는 API가 없어서 mock 데이터로 다시 설정함
    setPatches([...aiPatchResultMock]);

    // 새로운 결과의 첫 번째 패치부터 보여줌
    setCurrentIndex(0);

    // 새로운 결과이므로 기존 저장 상태 초기화함
    setSavedPatchIds([]);

    // 기존 토스트 초기화함
    setToast(null);
  };

  // 커스텀 화면으로 이동함
  const handleMoveCustom = () => {
    navigate("/custom/customizing");
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 저장 결과 토스트임 */}
      {toast && (
        <NoticeToast type={toast.type} message={toast.message} positionClassName="top-66" />
      )}

      {/* 상단 헤더 영역임 */}
      <header className="relative flex h-31.5 shrink-0 items-end justify-center border-b-[7px] border-[#A3642B] bg-[#192C44] px-8 pb-6">
        <h1 className="text-2xl font-bold text-white">AI 패치 저장</h1>
      </header>

      {/* AI 패치 생성 결과 본문임 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto pb-8">
        {/* 생성 완료 안내 영역임 */}
        <div className="px-8 pt-12 text-center">
          <h2 className="text-2xl font-bold text-[#192C44]">패치 생성을 완료했습니다</h2>

          <p className="mt-2 text-lg font-semibold text-[#8C8C8C]">
            마음에 드는 디자인을 저장해주세요
          </p>

          {/* 디자인 다시 생성하기 버튼임 */}
          <button
            type="button"
            onClick={handleRegenerate}
            className="mx-auto mt-5 flex h-10.5 items-center justify-center gap-2 rounded-full border-2 border-[#D8CCC1] px-6 text-base font-semibold text-[#B89B84] shadow-sm"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ↻
            </span>
            디자인 다시 생성하기
          </button>
        </div>

        {/* AI가 생성한 패치 3개 슬라이더 영역임 */}
        <div className="mt-10">
          <AIPatchResultSlider
            patches={patches}
            currentIndex={currentIndex}
            onIndexChange={handlePatchChange}
          />
        </div>

        {/* 하단 버튼 영역임 */}
        <div className="mt-auto px-8 pt-10">
          <CustomStepButton onNext={handleSave} nextLabel="저장하기" />

          <button
            type="button"
            onClick={handleMoveCustom}
            className="mt-3 h-14.5 w-full rounded-xl border-2 border-[#A3642B] bg-transparent text-base font-bold text-[#A3642B] shadow-sm"
          >
            커스텀 화면으로 이동하기
          </button>
        </div>
      </section>
    </main>
  );
};

export default AIPatchResult;
