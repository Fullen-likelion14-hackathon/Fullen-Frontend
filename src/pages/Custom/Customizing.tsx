import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import NoticeToast from "@/components/common/NoticeToast";
import WarningModal from "@/components/common/modal/WarningModal";
import PageHeader from "@/components/common/PageHeader";

import { ProductViewer } from "@/components/custom/viewer/ProductViewer";
import { CustomModeToggle } from "@/components/custom/common/CustomModeToggle";

import PatchPanel from "@/components/custom/patch/PatchPanel";
import InitialPanel from "@/components/custom/initials/InitialsPanel";

import { ThreeLoadingOverlay } from "@/pages/Loading/CustomLoading";

import { useBags } from "@/hooks/queries/useBags";
import { usePatchPositions } from "@/hooks/queries/patch/usePatchPositions";
import { useInitials } from "@/hooks/queries/initials/useInitials";

import { useBagCustomStore } from "@/stores/bagCustomStore";

import floorBg from "@/assets/images/Floor.png";

type CustomMode = "initial" | "patch";

type ToastState = {
  type: "created" | "applied";
  message: string;
} | null;

interface CustomizingLocationState {
  showPatchCreatedToast?: boolean;
}

export default function Customizing() {
  const location = useLocation();
  const navigate = useNavigate();

  // 서버 상태 초기화 기준
  const hydratedPatchBagIdRef = useRef<number | null>(null);
  const hydratedInitialBagIdRef = useRef<number | null>(null);

  const locationState = location.state as CustomizingLocationState | null;

  const [mode, setMode] = useState<CustomMode>("patch");

  // Three.js 첫 렌더링 완료 여부
  const [isThreeReady, setIsThreeReady] = useState(false);

  // 로딩 완료 후 가방 표시 여부
  const [isThreeVisible, setIsThreeVisible] = useState(false);

  // 경고 후 이동 대상 모드
  const [pendingMode, setPendingMode] = useState<CustomMode | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const { data: bags = [], isPending: isBagsPending, isError: isBagsError } = useBags();

  const userBagId = bags[0]?.userBagId;

  const {
    data: patchPositions = [],
    isPending: isPatchPositionsPending,
    isError: isPatchPositionsError,
  } = usePatchPositions(userBagId);

  const {
    data: initials = [],
    isPending: isInitialsPending,
    isError: isInitialsError,
  } = useInitials(userBagId);

  const isDirty = useBagCustomStore((state) => state.isDirty);

  const discardDraft = useBagCustomStore((state) => state.discardDraft);

  const selectPlacedPatch = useBagCustomStore((state) => state.selectPlacedPatch);

  const selectPlacedInitial = useBagCustomStore((state) => state.selectPlacedInitial);

  const setAppliedPatches = useBagCustomStore((state) => state.setAppliedPatches);

  const setAppliedInitials = useBagCustomStore((state) => state.setAppliedInitials);

  // 새 패치 생성 토스트
  useEffect(() => {
    if (!locationState?.showPatchCreatedToast) {
      return;
    }

    setToast({
      type: "created",
      message: "새 패치가 생성되었습니다",
    });

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, locationState, navigate]);

  // 토스트 자동 제거
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // 사용자 가방 변경 기준
  useEffect(() => {
    hydratedPatchBagIdRef.current = null;
    hydratedInitialBagIdRef.current = null;

    setIsThreeReady(false);
    setIsThreeVisible(false);
  }, [userBagId]);

  // 서버 패치 상태 초기화
  useEffect(() => {
    if (userBagId === undefined) {
      return;
    }

    if (isPatchPositionsPending || isPatchPositionsError) {
      return;
    }

    if (hydratedPatchBagIdRef.current === userBagId) {
      return;
    }

    const restoredPatches = patchPositions.map((patch) => ({
      id: `server-patch-${patch.patchPositionId}`,

      patchPositionId: patch.patchPositionId,

      savedPatchId: String(patch.patchId),

      image: patch.imgUrl,

      // Product UV 복원 대상
      position: null,

      normal:
        patch.side === "FRONT"
          ? ([0, 0, 1] as [number, number, number])
          : ([0, 0, -1] as [number, number, number]),

      side: patch.side,

      posX: patch.posX,

      posY: patch.posY,

      rotation: patch.rotation,

      scale: patch.scale,

      flipped: patch.flipped,

      layer: patch.layer,

      // 서버 기준 수정 가능 여부
      // 주문 완료 패치의 경우 false
      isEditable: patch.isEditable,
    }));

    setAppliedPatches(restoredPatches);

    hydratedPatchBagIdRef.current = userBagId;
  }, [
    isPatchPositionsError,
    isPatchPositionsPending,
    patchPositions,
    setAppliedPatches,
    userBagId,
  ]);

  // 서버 이니셜 상태 초기화
  useEffect(() => {
    if (userBagId === undefined) {
      return;
    }

    if (isInitialsPending || isInitialsError) {
      return;
    }

    if (hydratedInitialBagIdRef.current === userBagId) {
      return;
    }

    const restoredInitials = initials.map((initial) => ({
      id: `server-initial-${initial.initialId}`,

      initialId: initial.initialId,

      text: initial.initialPhrase,

      color: initial.color,

      fontWeight: initial.isBold ? ("bold" as const) : ("normal" as const),

      // Product UV 복원 대상
      position: null,

      normal:
        initial.side === "FRONT"
          ? ([0, 0, 1] as [number, number, number])
          : ([0, 0, -1] as [number, number, number]),

      side: initial.side,

      posX: initial.posX,

      posY: initial.posY,

      rotation: initial.rotation,

      scale: initial.scale,

      layer: initial.layer,
    }));

    setAppliedInitials(restoredInitials);

    hydratedInitialBagIdRef.current = userBagId;
  }, [initials, isInitialsError, isInitialsPending, setAppliedInitials, userBagId]);

  const changeMode = (nextMode: CustomMode) => {
    if (nextMode === "patch") {
      selectPlacedInitial(null);
    }

    if (nextMode === "initial") {
      selectPlacedPatch(null);
    }

    setMode(nextMode);
  };

  const handleModeChange = (nextMode: CustomMode) => {
    if (nextMode === mode) {
      return;
    }

    if (isDirty) {
      setPendingMode(nextMode);

      return;
    }

    changeMode(nextMode);
  };

  const handleApplied = () => {
    setToast({
      type: "applied",
      message: "변경사항이 적용되었습니다",
    });
  };

  const handleConfirmModeChange = () => {
    if (!pendingMode) {
      return;
    }

    discardDraft();

    const nextMode = pendingMode;

    setPendingMode(null);

    changeMode(nextMode);
  };

  const handleCloseModeWarning = () => {
    setPendingMode(null);
  };

  const isMovingToInitial = pendingMode === "initial";

  if (isBagsPending) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#F9F4F0]">
        <p className="text-sm font-semibold text-[#B89B84]">가방 정보를 불러오는 중입니다</p>
      </main>
    );
  }

  if (isBagsError || userBagId === undefined) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#F9F4F0]">
        <p className="text-sm font-semibold text-[#B89B84]">가방 정보를 불러오지 못했습니다</p>
      </main>
    );
  }

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

      {toast && (
        <NoticeToast type={toast.type} message={toast.message} positionClassName="top-38" />
      )}

      {/* 고정 배경 */}
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

      {/* 현재 편집 가방 상태 */}
      <div
        className={`
          absolute
          inset-0
          z-0
          transition-opacity
          duration-300
          ${isThreeVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        <ProductViewer
          mode="draft"
          customMode={mode}
          onReady={() => {
            setIsThreeReady(true);
          }}
        />
      </div>

      {/* Three.js 준비 중 로딩 애니메이션 */}
      <ThreeLoadingOverlay
        isReady={isThreeReady}
        onComplete={() => {
          setIsThreeVisible(true);
        }}
      />

      {/* 화면 UI 레이어 */}
      <div className="pointer-events-none relative z-20 h-full">
        <div
          className="
            pointer-events-auto
            absolute
            inset-x-0
            top-3
            flex
            justify-center
          "
        >
          <CustomModeToggle mode={mode} onChange={handleModeChange} />
        </div>

        {mode === "patch" && <PatchPanel userBagId={userBagId} onApplied={handleApplied} />}

        {mode === "initial" && <InitialPanel userBagId={userBagId} onApplied={handleApplied} />}
      </div>

      <WarningModal
        isOpen={pendingMode !== null}
        title={
          isMovingToInitial
            ? "이니셜 꾸미기로 전환하시겠습니까?"
            : "패치 꾸미기로 전환하시겠습니까?"
        }
        description={
          isMovingToInitial
            ? "적용하지 않은 패치는 저장되지 않습니다."
            : "적용하지 않은 이니셜은 저장되지 않습니다."
        }
        primaryButtonText={isMovingToInitial ? "패치 마저 꾸미기" : "이니셜 마저 꾸미기"}
        secondaryButtonText={isMovingToInitial ? "이니셜로 전환하기" : "패치로 전환하기"}
        onPrimaryClick={handleCloseModeWarning}
        onSecondaryClick={handleConfirmModeChange}
        onClose={handleCloseModeWarning}
      />
    </main>
  );
}
