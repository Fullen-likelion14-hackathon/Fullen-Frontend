import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NoticeToast from "@/components/common/NoticeToast";
import AIPatchResultSlider from "@/components/custom/ai/AIPatchResultSlider";
import CustomStepButton from "@/components/custom/common/step/CustomStepButton";

import { aiPatchResultMock, type AIPatchResultItem } from "@/mocks/aiPatchResult.mock";

import { useAIPatchStore } from "@/stores/aiPatchStore";

type ToastState = {
  type: "created" | "applied";
  message: string;
} | null;

const AIPatchResult = () => {
  const navigate = useNavigate();

  // 현재는 mock 데이터 사용함
  // 추후 실제 AI 패치 생성 API 응답으로 변경 예정임
  const [patches, setPatches] = useState<AIPatchResultItem[]>(aiPatchResultMock);

  // 현재 가운데 표시되는 패치 번호임
  const [currentIndex, setCurrentIndex] = useState(0);

  // 저장 결과 토스트 상태임
  const [toast, setToast] = useState<ToastState>(null);

  // 선택했던 프레임 타입을 Zustand에서 가져옴
  const selectedFrame = useAIPatchStore((state) => state.selectedFrame);

  // 저장된 패치 추가 함수임
  const addSavedPatch = useAIPatchStore((state) => state.addSavedPatch);

  // 이미 저장된 패치인지 확인하는 함수임
  const isPatchSaved = useAIPatchStore((state) => state.isPatchSaved);

  // 현재 선택된 AI 패치 결과임
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

  // 현재 선택한 패치를 저장함
  const handleSave = () => {
    if (!currentPatch || !selectedFrame) {
      return;
    }

    // 같은 생성 결과와 같은 프레임 조합이 이미 저장됐는지 확인함
    if (isPatchSaved(currentPatch.id, selectedFrame)) {
      setToast({
        type: "created",
        message: "이미 저장한 패치입니다",
      });

      return;
    }

    // 실제 API 연결 전이라 Zustand에 임시 저장함
    addSavedPatch({
      // mock id가 항상 1, 2, 3이므로 별도 고유 id 생성함
      id: crypto.randomUUID(),

      resultId: currentPatch.id,

      image: currentPatch.image,

      frameType: selectedFrame,
    });

    setToast({
      type: "created",
      message: `패치 ${currentIndex + 1}안을 저장했습니다`,
    });
  };

  // AI 패치 디자인 다시 생성 요청함
  const handleRegenerate = () => {
    // TODO: 실제 AI 패치 재생성 API 연결 예정임
    console.log("AI 패치 디자인 다시 생성 요청");

    // 현재는 mock 데이터로 다시 설정함
    setPatches([...aiPatchResultMock]);

    // 첫 번째 패치부터 표시함
    setCurrentIndex(0);

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

      {/* 결과 본문 영역임 */}
      <section className="flex h-[calc(100dvh-126px)] flex-col overflow-y-auto pb-8">
        {/* 생성 완료 안내 영역임 */}
        <div className="px-8 pt-12 text-center">
          <h2 className="text-2xl font-bold text-[#192C44]">패치 생성을 완료했습니다</h2>

          <p className="mt-2 text-lg font-semibold text-[#8C8C8C]">
            마음에 드는 디자인을 저장해주세요
          </p>

          {/* 디자인 다시 생성 버튼임 */}
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

        {/* AI가 생성한 패치 3개임 */}
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
