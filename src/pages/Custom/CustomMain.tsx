import { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";

import { CustomizeButton, OrderButton, DPPButton } from "@/components/custom/CustomActionButton";

import { ProductViewer } from "@/components/custom/viewer/ProductViewer";

import OrderCompleteModal from "@/components/custom/OrderCompleteModal";
import CustomLoading from "@/pages/Loading/CustomLoading";

import { useBags } from "@/hooks/queries/useBags";
import { usePatchPositions } from "@/hooks/queries/patch/usePatchPositions";
import { useInitials } from "@/hooks/queries/initials/useInitials";

import { useBagCustomStore } from "@/stores/bagCustomStore";

import floorBg from "@/assets/images/Floor.png";

export default function CustomMain() {
  const location = useLocation();

  const [isThreeReady, setIsThreeReady] = useState(false);

  // 서버 상태 초기화 기준
  const hydratedPatchBagIdRef = useRef<number | null>(null);
  const hydratedInitialBagIdRef = useRef<number | null>(null);

  const [isOrderCompleteModalOpen, setIsOrderCompleteModalOpen] = useState(
    location.state?.showOrderCompleteModal ?? false,
  );

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

  const setAppliedPatches = useBagCustomStore((state) => state.setAppliedPatches);

  const setAppliedInitials = useBagCustomStore((state) => state.setAppliedInitials);

  // 사용자 가방 변경 기준
  useEffect(() => {
    hydratedPatchBagIdRef.current = null;
    hydratedInitialBagIdRef.current = null;

    setIsThreeReady(false);
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
      // 주문 완료 패치는 false
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

  const isCustomPending = isBagsPending || isPatchPositionsPending || isInitialsPending;

  const isCustomError =
    isBagsError || isPatchPositionsError || isInitialsError || userBagId === undefined;

  if (isCustomPending) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#F9F4F0]">
        <p className="text-sm font-semibold text-[#B89B84]">가방 정보를 불러오는 중입니다</p>
      </main>
    );
  }

  if (isCustomError) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#F9F4F0]">
        <p className="text-sm font-semibold text-[#B89B84]">가방 정보를 불러오지 못했습니다</p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
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

      {/* 적용 완료 가방 상태 */}
      <div className="absolute inset-0">
        <ProductViewer
          mode="applied"
          onReady={() => {
            setIsThreeReady(true);
          }}
        />
      </div>

      {/* 화면 UI */}
      <div className="pointer-events-none relative z-10 h-full">
        {/* DPP 버튼 */}
        <div className="pointer-events-auto flex justify-center pt-30">
          <DPPButton />
        </div>

        {/* 가방 정보 */}
        <div className="mt-7 text-center">
          <h1 className="text-[1.25rem] font-bold text-[#333]">Ottomar 비세토스 위켄더</h1>

          <p className="mt-1 text-[max(12px,0.875rem)] text-[#777]">50.5 cm (19.9 in)</p>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="pointer-events-auto absolute bottom-45 left-0 right-0 flex flex-col items-center gap-4">
          <CustomizeButton />

          <OrderButton />
        </div>
      </div>

      {/* Three.js 렌더링 완료 전 로딩 */}
      {!isThreeReady && (
        <div className="absolute inset-0 z-40">
          <CustomLoading overlayOnly />
        </div>
      )}

      {/* 주문 완료 모달 */}
      {isOrderCompleteModalOpen && (
        <OrderCompleteModal
          orderType="custom"
          onClose={() => {
            setIsOrderCompleteModalOpen(false);
          }}
        />
      )}
    </main>
  );
}
