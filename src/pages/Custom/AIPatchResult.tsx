import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

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

  // 현재 AI 패치 mock 결과임
  const [patches, setPatches] = useState<AIPatchResultItem[]>(aiPatchResultMock);

  // 현재 중앙 패치 index임
  const [currentIndex, setCurrentIndex] = useState(0);

  // 저장 결과 Toast 상태임
  const [toast, setToast] = useState<ToastState>(null);

  // 현재 생성 결과에서 패치 저장 여부임
  const [hasSavedPatch, setHasSavedPatch] = useState(false);

  // AI 생성 시 선택했던 프레임임
  const selectedFrame = useAIPatchStore((state) => state.selectedFrame);

  // 저장 패치 추가 함수임
  const addSavedPatch = useAIPatchStore((state) => state.addSavedPatch);

  // 이미 저장한 패치인지 확인함
  const isPatchSaved = useAIPatchStore((state) => state.isPatchSaved);

  // 현재 중앙 패치임
  const currentPatch = patches[currentIndex];

  // Toast 3초 후 종료함
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // 현재 패치 index 변경함
  const handlePatchChange = (index: number) => {
    setCurrentIndex(index);
  };

  // 현재 선택한 AI 패치 저장함
  const handleSave = () => {
    if (!currentPatch || !selectedFrame) {
      return;
    }

    // 이미 저장된 결과인지 확인함
    if (isPatchSaved(currentPatch.id, selectedFrame)) {
      setToast({
        type: "created",
        message: "이미 저장한 패치입니다",
      });

      return;
    }

    // 실제 API 연결 전 Zustand에 저장함
    addSavedPatch({
      // 저장 패치 고유 id임
      id: crypto.randomUUID(),

      // AI 생성 결과 원본 id임
      resultId: currentPatch.id,

      // 패치 이미지임
      image: currentPatch.image,

      // 생성 시 선택했던 프레임임
      frameType: selectedFrame,
    });

    // 현재 결과에서 패치 저장 완료 상태임
    setHasSavedPatch(true);

    // 저장 완료 Toast임
    setToast({
      type: "created",
      message: `패치 ${currentIndex + 1}안을 저장했습니다`,
    });
  };

  // 선택 옵션 기준 AI 패치 재생성 요청함
  const handleRegenerate = () => {
    // TODO: 실제 AI 패치 재생성 API 연결 예정임
    console.log("AI 패치 디자인 다시 생성 요청");

    // 현재 mock 데이터 재사용함
    setPatches([...aiPatchResultMock]);

    // 새로운 결과 첫 패치부터 보여줌
    setCurrentIndex(0);

    // 현재 재생성 결과 저장 여부 초기화함
    setHasSavedPatch(false);

    // 기존 Toast 초기화함
    setToast(null);
  };

  // 커스텀 화면으로 이동함
  const handleMoveCustom = () => {
    navigate("/custom/customizing", {
      state: {
        // 실제 저장한 패치가 있을 때만 생성 Toast 표시함
        showPatchCreatedToast: hasSavedPatch,
      },
    });
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0] text-[#192C44]">
      {/* 저장 결과 Toast임 */}
      {toast && (
        <NoticeToast type={toast.type} message={toast.message} positionClassName="top-66" />
      )}

      {/* 상단 헤더 영역임 */}
      <PageHeader title="AI 패치 저장"></PageHeader>

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

        {/* AI 생성 패치 슬라이더임 */}
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
