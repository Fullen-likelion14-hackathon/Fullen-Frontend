import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";

import { ApplyButton } from "@/components/custom/common/ApplyButton";

import {
  OrderCaptureViewer,
  type OrderCaptureViewerHandle,
} from "@/components/custom/viewer/OrderCaptureViewer";

import CustomLoading from "@/pages/Loading/CustomLoading";

import { useBag, useBags } from "@/hooks/queries/useBags";

import { usePatchPositions } from "@/hooks/queries/patch/usePatchPositions";

import { useInitials } from "@/hooks/queries/initials/useInitials";

import { useCreateCustomOrder } from "@/hooks/mutations/order/useCreateCustomOrder";

import { useBagCustomStore } from "@/stores/bagCustomStore";

import { uploadImage } from "@/api/image";

// 주문 확인 가방 면 타입
type BagSide = "front" | "back";

export default function MyOrderList() {
  const navigate = useNavigate();

  // 현재 주문 확인 가방 면
  const [side, setSide] = useState<BagSide>("front");

  // 업데이트 목록 표시 상태
  const [isUpdatedListOpen, setIsUpdatedListOpen] = useState(true);

  // 주문 캡처 Viewer 준비 상태
  const [isCaptureViewerReady, setIsCaptureViewerReady] = useState(false);

  // 서버 패치 복원 상태
  const [isPatchHydrated, setIsPatchHydrated] = useState(false);

  // 서버 이니셜 복원 상태
  const [isInitialHydrated, setIsInitialHydrated] = useState(false);

  // 주문 이미지 생성 상태
  const [isCapturing, setIsCapturing] = useState(false);

  // 앞면 2D 이미지 URL
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);

  // 뒷면 2D 이미지 URL
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);

  // 주문 처리 오류
  const [orderError, setOrderError] = useState<string | null>(null);

  // 주문 캡처 Viewer 제어
  const captureViewerRef = useRef<OrderCaptureViewerHandle | null>(null);

  // 캡처 완료 가방 id
  const capturedBagIdRef = useRef<number | null>(null);

  // 앞면 PNG Blob
  const frontBlobRef = useRef<Blob | null>(null);

  // 뒷면 PNG Blob
  const backBlobRef = useRef<Blob | null>(null);

  // 앞면 Object URL
  const frontObjectUrlRef = useRef<string | null>(null);

  // 뒷면 Object URL
  const backObjectUrlRef = useRef<string | null>(null);

  const { data: bags = [], isPending: isBagsPending, isError: isBagsError } = useBags();

  const userBagId = bags[0]?.userBagId;

  const { data: bagDetail, isPending: isBagPending, isError: isBagError } = useBag(userBagId);

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

  const { mutateAsync: createCustomOrder, isPending: isOrderPending } = useCreateCustomOrder();

  const setAppliedPatches = useBagCustomStore((state) => state.setAppliedPatches);

  const setAppliedInitials = useBagCustomStore((state) => state.setAppliedInitials);

  // 이번 주문 신규 패치 목록
  const updatedPatches = useMemo(
    () => patchPositions.filter((patch) => patch.isEditable === true),
    [patchPositions],
  );

  // 사용자 가방 변경 상태 초기화
  useEffect(() => {
    setIsCaptureViewerReady(false);

    setIsPatchHydrated(false);

    setIsInitialHydrated(false);

    setIsCapturing(false);

    setOrderError(null);

    capturedBagIdRef.current = null;

    frontBlobRef.current = null;

    backBlobRef.current = null;

    if (frontObjectUrlRef.current) {
      URL.revokeObjectURL(frontObjectUrlRef.current);

      frontObjectUrlRef.current = null;
    }

    if (backObjectUrlRef.current) {
      URL.revokeObjectURL(backObjectUrlRef.current);

      backObjectUrlRef.current = null;
    }

    setFrontPreviewUrl(null);

    setBackPreviewUrl(null);
  }, [userBagId]);

  // 서버 패치 상태 복원
  useEffect(() => {
    if (userBagId === undefined) {
      return;
    }

    if (isPatchPositionsPending || isPatchPositionsError) {
      return;
    }

    const restoredPatches = patchPositions.map((patch) => ({
      id: `server-patch-${patch.patchPositionId}`,

      patchPositionId: patch.patchPositionId,

      savedPatchId: String(patch.patchId),

      image: patch.imgUrl,

      // Product UV 위치 복원 대상
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
    }));

    setAppliedPatches(restoredPatches);

    setIsPatchHydrated(true);
  }, [
    isPatchPositionsError,
    isPatchPositionsPending,
    patchPositions,
    setAppliedPatches,
    userBagId,
  ]);

  // 서버 이니셜 상태 복원
  useEffect(() => {
    if (userBagId === undefined) {
      return;
    }

    if (isInitialsPending || isInitialsError) {
      return;
    }

    const restoredInitials = initials.map((initial) => ({
      id: `server-initial-${initial.initialId}`,

      initialId: initial.initialId,

      text: initial.initialPhrase,

      color: initial.color,

      fontWeight: initial.isBold ? ("bold" as const) : ("normal" as const),

      // Product UV 위치 복원 대상
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

    setIsInitialHydrated(true);
  }, [initials, isInitialsError, isInitialsPending, setAppliedInitials, userBagId]);

  // 주문 앞면 / 뒷면 이미지 생성
  useEffect(() => {
    if (userBagId === undefined) {
      return;
    }

    if (!isPatchHydrated || !isInitialHydrated || !isCaptureViewerReady) {
      return;
    }

    if (!captureViewerRef.current) {
      return;
    }

    if (capturedBagIdRef.current === userBagId) {
      return;
    }

    let isCancelled = false;

    const captureOrderImages = async () => {
      try {
        setIsCapturing(true);

        setOrderError(null);

        const frontBlob = await captureViewerRef.current?.captureFront();

        const backBlob = await captureViewerRef.current?.captureBack();

        if (!frontBlob || !backBlob || isCancelled) {
          return;
        }

        // 주문 업로드용 Blob 보관
        frontBlobRef.current = frontBlob;

        backBlobRef.current = backBlob;

        const nextFrontUrl = URL.createObjectURL(frontBlob);

        const nextBackUrl = URL.createObjectURL(backBlob);

        if (frontObjectUrlRef.current) {
          URL.revokeObjectURL(frontObjectUrlRef.current);
        }

        if (backObjectUrlRef.current) {
          URL.revokeObjectURL(backObjectUrlRef.current);
        }

        frontObjectUrlRef.current = nextFrontUrl;

        backObjectUrlRef.current = nextBackUrl;

        setFrontPreviewUrl(nextFrontUrl);

        setBackPreviewUrl(nextBackUrl);

        capturedBagIdRef.current = userBagId;
      } catch (error) {
        console.error("주문 이미지 생성 실패", error);

        if (!isCancelled) {
          setOrderError("커스텀 이미지를 생성하지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsCapturing(false);
        }
      }
    };

    captureOrderImages();

    return () => {
      isCancelled = true;
    };
  }, [isCaptureViewerReady, isInitialHydrated, isPatchHydrated, userBagId]);

  // Object URL 정리
  useEffect(() => {
    return () => {
      if (frontObjectUrlRef.current) {
        URL.revokeObjectURL(frontObjectUrlRef.current);
      }

      if (backObjectUrlRef.current) {
        URL.revokeObjectURL(backObjectUrlRef.current);
      }
    };
  }, []);

  // 주문 생성
  const handleOrder = async () => {
    if (userBagId === undefined) {
      setOrderError("사용자 가방 정보를 확인할 수 없습니다.");

      return;
    }

    const frontBlob = frontBlobRef.current;

    const backBlob = backBlobRef.current;

    if (!frontBlob || !backBlob) {
      setOrderError("주문 이미지를 준비 중입니다.");

      return;
    }

    try {
      setOrderError(null);

      // 앞면 주문 이미지 파일
      const frontFile = new File([frontBlob], `custom-order-${userBagId}-front.png`, {
        type: "image/png",
      });

      // 뒷면 주문 이미지 파일
      const backFile = new File([backBlob], `custom-order-${userBagId}-back.png`, {
        type: "image/png",
      });

      // 앞면 / 뒷면 이미지 업로드
      const [customFrontImgUrl, customBackImgUrl] = await Promise.all([
        uploadImage(frontFile, "ORDER"),

        uploadImage(backFile, "ORDER"),
      ]);

      // 커스텀 주문 생성
      const response = await createCustomOrder({
        userBagId,

        customFrontImgUrl,

        customBackImgUrl,
      });

      // 주문 완료 화면 이동
      navigate("/custom/order/complete", {
        state: {
          orderType: "custom",

          orderId: response.data.orderId,
        },
      });
    } catch (error) {
      console.error("커스텀 주문 실패", error);

      setOrderError("주문 처리 중 오류가 발생했습니다.");
    }
  };

  // 커스텀 수정 화면 이동
  const handleEdit = () => {
    navigate("/custom/customizing");
  };

  const isCustomPending =
    isBagsPending || isBagPending || isPatchPositionsPending || isInitialsPending;

  const isCustomError =
    isBagsError ||
    isBagError ||
    isPatchPositionsError ||
    isInitialsError ||
    userBagId === undefined;

  const isOrderDisabled =
    isCapturing ||
    isOrderPending ||
    !frontPreviewUrl ||
    !backPreviewUrl ||
    !frontBlobRef.current ||
    !backBlobRef.current ||
    (patchPositions.length === 0 && initials.length === 0);

  if (isCustomPending) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#F9F4F0]">
        <p className="text-sm font-semibold text-[#B89B84]">주문 정보를 불러오는 중입니다</p>
      </main>
    );
  }

  if (isCustomError) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-97.5 items-center justify-center bg-[#F9F4F0]">
        <p className="text-sm font-semibold text-[#B89B84]">주문 정보를 불러오지 못했습니다</p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto h-dvh w-full max-w-97.5 overflow-hidden bg-[#F9F4F0]">
      <PageHeader title="나의 커스텀 주문" backTo="/custom" />

      {/* 주문 이미지 생성 전용 Viewer */}
      <div className="pointer-events-none fixed left-[-10000px] top-0 h-[512px] w-[512px]">
        <OrderCaptureViewer
          ref={captureViewerRef}
          onReady={() => {
            setIsCaptureViewerReady(true);
          }}
        />
      </div>

      {/* 가방 정보 */}
      <div className="pt-10 text-center">
        <h1 className="text-2xl font-bold text-[#242D41]">{bagDetail?.bagName}</h1>

        <p className="mt-1 text-[#888D96]">{bagDetail?.bagSize}</p>
      </div>

      {/* 앞면 / 뒷면 선택 */}
      <div className="mx-auto mt-4 flex w-fit rounded-full bg-[#D1D1D1] p-1">
        <button
          type="button"
          onClick={() => {
            setSide("front");
          }}
          className={`rounded-full px-4 py-1 text-[16px] font-bold ${
            side === "front" ? "bg-white text-[#242D41] shadow-sm" : "text-[#888D96]"
          }`}
        >
          앞면
        </button>

        <button
          type="button"
          onClick={() => {
            setSide("back");
          }}
          className={`rounded-full px-4 py-1 text-[16px] font-bold ${
            side === "back" ? "bg-white text-[#242D41] shadow-sm" : "text-[#888D96]"
          }`}
        >
          뒷면
        </button>
      </div>

      {/* 2D 커스텀 가방 이미지 */}
      <div className="relative mx-auto mt-3 flex h-67 w-82 items-center justify-center">
        {isCapturing || !frontPreviewUrl || !backPreviewUrl ? (
          <CustomLoading overlayOnly />
        ) : (
          <img
            src={side === "front" ? frontPreviewUrl : backPreviewUrl}
            alt={side === "front" ? "커스텀 가방 앞면" : "커스텀 가방 뒷면"}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {/* 업데이트 된 목록 */}
      <div className="mt-1 w-full">
        <button
          type="button"
          onClick={() => {
            setIsUpdatedListOpen((current) => !current);
          }}
          className="
            ml-5
            flex
            items-center
            gap-1
            text-[14px]
            font-bold
            text-[#969696]
          "
        >
          업데이트 된 목록
          {isUpdatedListOpen ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
        </button>

        {isUpdatedListOpen && (
          <div
            className="
              mt-2
              flex
              w-full
              gap-2
              overflow-x-auto
              px-5
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {updatedPatches.length > 0 ? (
              updatedPatches.map((patch) => (
                <img
                  key={patch.patchPositionId}
                  src={patch.imgUrl}
                  alt="업데이트 패치"
                  draggable={false}
                  className="
                    h-13
                    w-13
                    shrink-0
                    select-none
                    rounded-md
                    object-contain
                  "
                />
              ))
            ) : (
              <p className="py-3 text-[13px] text-[#B6B7BA]">새롭게 업데이트된 패치가 없습니다</p>
            )}
          </div>
        )}
      </div>

      {/* 주문 버튼 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-25 flex justify-center">
        <ApplyButton
          text={isOrderPending ? "주문 중" : "주문하기"}
          onApply={handleOrder}
          disabled={isOrderDisabled}
        />
      </div>

      {/* 커스텀 수정 이동 */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-17 flex justify-center gap-2 font-bold text-[#B6B7BA]">
        <p>다시 꾸미겠습니까?</p>

        <button type="button" onClick={handleEdit} className="underline underline-offset-2">
          수정하러 가기
        </button>
      </div>

      {/* 주문 처리 오류 */}
      {orderError && (
        <p className="absolute inset-x-0 bottom-8 text-center text-[13px] font-semibold text-red-500">
          {orderError}
        </p>
      )}
    </main>
  );
}
