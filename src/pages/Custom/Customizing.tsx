import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import NoticeToast from "@/components/common/NoticeToast";
import WarningModal from "@/components/common/modal/WarningModal";

import { ProductViewer } from "@/components/custom/viewer/ProductViewer";
import { CustomModeToggle } from "@/components/custom/common/CustomModeToggle";

import PatchPanel from "@/components/custom/patch/PatchPanel";
import InitialPanel from "@/components/custom/initials/InitialsPanel";

import { useBagCustomStore } from "@/stores/bagCustomStore";

import floorBg from "@/assets/images/Floor.png";
import PageHeader from "@/components/common/PageHeader";

type CustomMode = "initial" | "patch";

type ToastState = {
  type: "created" | "applied";

  message: string;
} | null;

interface CustomizingLocationState {
  // AI 패치 저장 후 이동 여부임
  showPatchCreatedToast?: boolean;
}

export default function Customizing() {
  const location = useLocation();

  const navigate = useNavigate();

  // 이전 페이지 전달 state임
  const locationState = location.state as CustomizingLocationState | null;

  // 현재 커스텀 모드임
  const [mode, setMode] = useState<CustomMode>("patch");

  // 이니셜 전환 경고창 상태임
  const [isModeWarningOpen, setIsModeWarningOpen] = useState(false);

  // 완료 안내 Toast 상태임
  const [toast, setToast] = useState<ToastState>(null);

  // 적용 전 변경사항 존재 여부임
  const isDirty = useBagCustomStore((state) => state.isDirty);

  // 적용 전 변경사항 취소 함수임
  const discardDraft = useBagCustomStore((state) => state.discardDraft);

  // AI 패치 저장 후 진입 시 생성 Toast 표시함
  useEffect(() => {
    if (!locationState?.showPatchCreatedToast) {
      return;
    }

    setToast({
      type: "created",

      message: "새 패치가 생성되었습니다",
    });

    // 뒤로가기 시 Toast 재출력 방지용 state 제거함
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, locationState, navigate]);

  // Toast 3초 후 자동 종료함
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // 커스텀 모드 변경 처리함
  const handleModeChange = (nextMode: CustomMode) => {
    // 현재 모드와 동일하면 처리하지 않음
    if (nextMode === mode) {
      return;
    }

    // 미적용 패치가 존재한 상태에서 이니셜 전환 시 경고창 표시함
    if (mode === "patch" && nextMode === "initial" && isDirty) {
      setIsModeWarningOpen(true);

      return;
    }

    setMode(nextMode);
  };

  // 가방 상태 적용 완료 Toast 표시함
  const handleApplied = () => {
    setToast({
      type: "applied",

      message: "변경사항이 적용되었습니다",
    });
  };

  // 패치 변경사항 버리고 이니셜로 이동함
  const handleMoveInitial = () => {
    // 마지막 적용 상태로 복원함
    discardDraft();

    // 경고창 닫음
    setIsModeWarningOpen(false);

    // 이니셜 모드로 이동함
    setMode("initial");
  };

  // 이니셜 전환 경고창 닫음
  const handleCloseModeWarning = () => {
    // 현재 패치 편집 상태 유지함
    setIsModeWarningOpen(false);
  };

  return (
    <main
      className="
        relative
        mx-auto
        h-dvh
        w-full
        max-w-97.5
        overflow-hidden
        bg-[#F9F4F0]
      "
    >
      <PageHeader title="나의 가방 꾸미기" variant="plain" backTo="/custom" />
      {/* 생성 / 적용 완료 Toast임 */}
      {toast && (
        <NoticeToast type={toast.type} message={toast.message} positionClassName="top-38" />
      )}
      {/* 고정 배경 이미지임 */}
      <img
        src={floorBg}
        alt=""
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-auto
          w-155
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          opacity-60
        "
      />

      {/* 현재 편집 중인 가방 상태임 */}
      <div className="absolute inset-0 z-0">
        <ProductViewer mode="draft" />
      </div>

      {/* 화면 UI 레이어임 */}
      <div className="pointer-events-none relative z-20 h-full">
        {/* 이니셜 / 패치 모드 변경 토글임 */}
        <div
          className="
            pointer-events-auto
            absolute
            inset-x-0
            top-10
            flex
            justify-center
          "
        >
          <CustomModeToggle mode={mode} onChange={handleModeChange} />
        </div>

        {/* 패치 모드 UI임 */}
        {mode === "patch" && <PatchPanel onApplied={handleApplied} />}

        {/* 이니셜 모드 UI임 */}
        {mode === "initial" && <InitialPanel />}
      </div>

      {/* 미적용 패치 상태에서 이니셜 전환 WarningModal임 */}
      <WarningModal
        isOpen={isModeWarningOpen}
        title="이니셜 꾸미기로 전환하시겠습니까?"
        description="적용하지 않은 패치는 저장되지 않습니다."
        primaryButtonText="패치 마저 꾸미기"
        secondaryButtonText="이니셜로 전환하기"

        // 패치 상태 유지 후 모달만 닫음
        onPrimaryClick={handleCloseModeWarning}

        // 변경사항 버리고 이니셜로 전환함
        onSecondaryClick={handleMoveInitial}

        // 외부 클릭 시 패치 상태 그대로 유지하고 모달만 닫음
        onClose={handleCloseModeWarning}
      />
    </main>
  );
}
