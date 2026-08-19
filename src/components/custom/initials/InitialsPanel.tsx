import { useEffect, useState } from "react";

import InfoButton from "@/components/common/button/InfoButton";
import NoticeToast from "@/components/common/NoticeToast";

import { CustomGenerateButton } from "@/components/custom/common/CustomGenerate";
import { ApplyButton } from "@/components/custom/common/ApplyButton";

import InitialEditor from "@/components/custom/initials/InitialEditor";
import InitialCreateModal from "@/components/custom/initials/InitialCreateModal";

import { useBagCustomStore } from "@/stores/bagCustomStore";

interface InitialPanelProps {
  // 가방 상태 적용 완료 Toast 함수임
  onApplied: () => void;
}

type CreatedNotice = {
  // 생성 완료 Toast 타입임
  type: "created";

  // Toast 실제 문구임
  message: string;
} | null;

export default function InitialPanel({ onApplied }: InitialPanelProps) {
  // 이니셜 입력 팝업 상태임
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aa 이니셜 생성 버튼 활성화 상태임
  const [isGenerateActive, setIsGenerateActive] = useState(false);

  // 이니셜 생성 완료 Toast 상태임
  const [notice, setNotice] = useState<CreatedNotice>(null);

  // 현재 편집 중인 이니셜 목록임
  const draftInitials = useBagCustomStore((state) => state.draftInitials);

  // 현재 선택된 이니셜 id임
  const selectedPlacedInitialId = useBagCustomStore((state) => state.selectedPlacedInitialId);

  // 마지막 적용 상태와 변경 여부임
  const isDirty = useBagCustomStore((state) => state.isDirty);

  // 새 이니셜 추가 함수임
  const addDraftInitial = useBagCustomStore((state) => state.addDraftInitial);

  // 이니셜 색상 변경 함수임
  const changeDraftInitialColor = useBagCustomStore((state) => state.changeDraftInitialColor);

  // 이니셜 글자 굵기 변경 함수임
  const changeDraftInitialFontWeight = useBagCustomStore(
    (state) => state.changeDraftInitialFontWeight,
  );

  // 현재 가방 상태 적용 함수임
  const applyDraft = useBagCustomStore((state) => state.applyDraft);

  // 현재 선택된 이니셜 찾음
  const selectedInitial = draftInitials.find((initial) => initial.id === selectedPlacedInitialId);

  // 생성 Toast 3초 후 자동 종료함
  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNotice(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [notice]);

  // 새 이니셜 생성함
  const handleCreate = (text: string) => {
    // 새로운 3D 이니셜 상태 생성함
    addDraftInitial({
      // 가방 위 이니셜 고유 id임
      id: crypto.randomUUID(),

      // 사용자가 입력한 문자열임
      text,

      // 이니셜 기본 색상 검정임
      color: "#29292B",

      // 이니셜 기본 굵기 기본임
      fontWeight: "normal",

      // Product에서 최초 위치 계산 예정임
      position: null,

      // 최초 정면 방향임
      normal: [0, 0, 1],

      // 최초 이니셜 크기임
      scale: 0.5,
    });

    // 생성 완료 후 입력 팝업 닫음
    setIsModalOpen(false);

    // 생성한 이니셜 편집 중 활성 상태 유지함
    setIsGenerateActive(true);

    // 새 이니셜 생성 Toast 표시함
    setNotice({
      type: "created",

      message: "새 이니셜이 생성되었습니다",
    });
  };

  // 선택된 이니셜 색상 변경함
  const handleColorChange = (color: string) => {
    if (!selectedPlacedInitialId) {
      return;
    }

    changeDraftInitialColor(selectedPlacedInitialId, color);
  };

  // 선택된 이니셜 굵기 변경함
  const handleFontWeightChange = (fontWeight: "normal" | "bold") => {
    if (!selectedPlacedInitialId) {
      return;
    }

    changeDraftInitialFontWeight(selectedPlacedInitialId, fontWeight);
  };

  // 현재 가방 상태 전체 적용함
  const handleApplyInitial = () => {
    // 패치와 동일하게 변경사항 없으면 실행하지 않음
    if (!isDirty) {
      return;
    }

    // 패치 + 이니셜 현재 draft 상태 전체 적용함
    applyDraft();

    // 이니셜 생성 버튼 활성 상태 해제함
    setIsGenerateActive(false);

    // 적용 완료 Toast 부모에서 표시함
    onApplied();
  };

  return (
    <>
      {/* 이니셜 생성 완료 Toast임 */}
      {notice && (
        <NoticeToast type={notice.type} message={notice.message} positionClassName="top-38" />
      )}

      {/* 이니셜 생성 버튼임 */}
      {/* 처음에는 기본 스타일이고 생성 시작하면 active 상태 유지함 */}
      <div className="pointer-events-auto absolute left-11 top-20">
        <CustomGenerateButton
          text="Aa 이니셜 생성"
          active={isGenerateActive}
          onClick={() => {
            // 새 이니셜 생성 플로우 시작함
            setIsGenerateActive(true);

            // 이니셜 입력 팝업 열음
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* 안내 버튼임 */}
      <div className="pointer-events-auto absolute right-11 top-20">
        <InfoButton content="이니셜을 생성한 후 선택해서 색상과 굵기를 변경할 수 있음" />
      </div>

      {/* 현재 선택된 이니셜 편집 UI임 */}
      {selectedInitial && (
        <InitialEditor
          // 현재 이니셜 굵기 전달함
          fontWeight={selectedInitial.fontWeight}

          // 굵기 변경 함수 전달함
          onFontWeightChange={handleFontWeightChange}

          // 현재 이니셜 색상 전달함
          selectedColor={selectedInitial.color}

          // 색상 변경 함수 전달함
          onColorChange={handleColorChange}
        />
      )}

      {/* 가방 상태 적용 버튼임 */}
      <div
        className="
          pointer-events-auto
          absolute
          inset-x-0
          bottom-35
          flex
          justify-center
        "
      >
        <ApplyButton
          text="가방에 적용하기"
          onApply={handleApplyInitial}

          // 패치와 동일하게 변경사항 있을 때만 활성화함
          disabled={!isDirty}
        />
      </div>

      {/* 이니셜 생성 입력 팝업임 */}
      {isModalOpen && (
        <InitialCreateModal
          onClose={() => {
            // 생성 팝업 닫음
            setIsModalOpen(false);

            // 생성 취소 시 활성 상태 해제함
            setIsGenerateActive(false);
          }}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
