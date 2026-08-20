import { useEffect, useState } from "react";

import InfoButton from "@/components/common/button/InfoButton";
import NoticeToast from "@/components/common/NoticeToast";

import { CustomGenerateButton } from "@/components/custom/common/CustomGenerate";
import { ApplyButton } from "@/components/custom/common/ApplyButton";

import InitialEditor from "@/components/custom/initials/InitialEditor";
import InitialCreateModal from "@/components/custom/initials/InitialCreateModal";

import { useSaveInitial } from "@/hooks/mutations/initial/useSaveInitial";
import { useUpdateInitial } from "@/hooks/mutations/initial/useUpdateInitial";
import { useDeleteInitial } from "@/hooks/mutations/initial/useDeleteInitial";

import { useBagCustomStore, type PlacedInitial } from "@/stores/bagCustomStore";

interface InitialPanelProps {
  userBagId: number;

  onApplied: () => void;
}

type CreatedNotice = {
  type: "created";

  message: string;
} | null;

// 이니셜 서버 상태 변경 여부
const hasInitialChanged = (draftInitial: PlacedInitial, appliedInitial: PlacedInitial) =>
  draftInitial.color !== appliedInitial.color ||
  draftInitial.fontWeight !== appliedInitial.fontWeight ||
  draftInitial.side !== appliedInitial.side ||
  draftInitial.posX !== appliedInitial.posX ||
  draftInitial.posY !== appliedInitial.posY ||
  draftInitial.rotation !== appliedInitial.rotation ||
  draftInitial.scale !== appliedInitial.scale ||
  draftInitial.layer !== appliedInitial.layer;

export default function InitialPanel({ userBagId, onApplied }: InitialPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isGenerateActive, setIsGenerateActive] = useState(false);

  const [notice, setNotice] = useState<CreatedNotice>(null);

  const { mutateAsync: saveInitial, isPending: isSavingInitial } = useSaveInitial();

  const { mutateAsync: updateInitial, isPending: isUpdatingInitial } = useUpdateInitial();

  const { mutateAsync: deleteInitial, isPending: isDeletingInitial } = useDeleteInitial();

  const draftInitials = useBagCustomStore((state) => state.draftInitials);

  const appliedInitials = useBagCustomStore((state) => state.appliedInitials);

  const selectedPlacedInitialId = useBagCustomStore((state) => state.selectedPlacedInitialId);

  const isDirty = useBagCustomStore((state) => state.isDirty);

  const addDraftInitial = useBagCustomStore((state) => state.addDraftInitial);

  const setDraftInitialServerId = useBagCustomStore((state) => state.setDraftInitialServerId);

  const changeDraftInitialColor = useBagCustomStore((state) => state.changeDraftInitialColor);

  const changeDraftInitialFontWeight = useBagCustomStore(
    (state) => state.changeDraftInitialFontWeight,
  );

  const applyDraft = useBagCustomStore((state) => state.applyDraft);

  const selectedInitial = draftInitials.find((initial) => initial.id === selectedPlacedInitialId);

  const isApplying = isSavingInitial || isUpdatingInitial || isDeletingInitial;

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

  // 신규 이니셜 상태
  const handleCreate = (text: string) => {
    addDraftInitial({
      id: crypto.randomUUID(),

      initialId: null,

      text,

      color: "#29292B",

      fontWeight: "normal",

      position: null,

      normal: [0, 0, 1],

      side: "FRONT",

      posX: 0.5,

      posY: 0.5,

      rotation: 0,

      scale: 0.5,
    });

    setIsModalOpen(false);

    setIsGenerateActive(true);

    setNotice({
      type: "created",

      message: "새 이니셜이 생성되었습니다",
    });
  };

  const handleColorChange = (color: string) => {
    if (!selectedPlacedInitialId) {
      return;
    }

    changeDraftInitialColor(selectedPlacedInitialId, color);
  };

  const handleFontWeightChange = (fontWeight: "normal" | "bold") => {
    if (!selectedPlacedInitialId) {
      return;
    }

    changeDraftInitialFontWeight(selectedPlacedInitialId, fontWeight);
  };

  const handleApplyInitial = async () => {
    if (!isDirty || isApplying) {
      return;
    }

    try {
      const newInitials = draftInitials.filter(
        (initial) => initial.initialId === null && initial.position !== null,
      );

      const updatedInitials = draftInitials.filter((draftInitial) => {
        if (draftInitial.initialId === null) {
          return false;
        }

        const appliedInitial = appliedInitials.find(
          (initial) => initial.initialId === draftInitial.initialId,
        );

        if (!appliedInitial) {
          return false;
        }

        return hasInitialChanged(draftInitial, appliedInitial);
      });

      const deletedInitials = appliedInitials.filter((appliedInitial) => {
        if (appliedInitial.initialId === null) {
          return false;
        }

        return !draftInitials.some(
          (draftInitial) => draftInitial.initialId === appliedInitial.initialId,
        );
      });

      await Promise.all(
        deletedInitials.map((initial) =>
          deleteInitial({
            initialId: initial.initialId!,

            userBagId,
          }),
        ),
      );

      await Promise.all(
        updatedInitials.map((initial) =>
          updateInitial({
            initialId: initial.initialId!,

            userBagId,

            request: {
              color: initial.color,

              isBold: initial.fontWeight === "bold",

              side: initial.side,

              posX: initial.posX,

              posY: initial.posY,

              rotation: initial.rotation,

              scale: initial.scale,

              layer: initial.layer,
            },
          }),
        ),
      );

      const savedInitials = await Promise.all(
        newInitials.map(async (initial) => {
          const response = await saveInitial({
            userBagId,

            initialPhrase: initial.text,

            color: initial.color,

            isBold: initial.fontWeight === "bold",

            side: initial.side,

            posX: initial.posX,

            posY: initial.posY,

            rotation: initial.rotation,

            scale: initial.scale,

            layer: initial.layer,
          });

          return {
            localInitialId: initial.id,

            serverInitialId: response.data.initialId,
          };
        }),
      );

      savedInitials.forEach(({ localInitialId, serverInitialId }) => {
        setDraftInitialServerId(localInitialId, serverInitialId);
      });

      applyDraft();

      setIsGenerateActive(false);

      onApplied();
    } catch (error) {
      console.error("이니셜 적용 실패", error);
    }
  };

  return (
    <>
      {notice && (
        <NoticeToast type={notice.type} message={notice.message} positionClassName="top-38" />
      )}

      {/* 이니셜 생성 */}
      <div className="pointer-events-auto absolute left-11 top-20">
        <CustomGenerateButton
          text="Aa 이니셜 생성"
          active={isGenerateActive}
          onClick={() => {
            setIsGenerateActive(true);

            setIsModalOpen(true);
          }}
        />
      </div>

      {/* 이니셜 안내 */}
      <div className="pointer-events-auto absolute right-11 top-20">
        <InfoButton content="이니셜을 생성한 후 선택해서 색상과 굵기를 변경할 수 있음" />
      </div>

      {selectedInitial && (
        <InitialEditor
          fontWeight={selectedInitial.fontWeight}
          onFontWeightChange={handleFontWeightChange}
          selectedColor={selectedInitial.color}
          onColorChange={handleColorChange}
        />
      )}

      {/* 가방 상태 적용 */}
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
          text={isApplying ? "적용 중" : "가방에 적용하기"}
          onApply={handleApplyInitial}
          disabled={!isDirty || isApplying}
        />
      </div>

      {isModalOpen && (
        <InitialCreateModal
          onClose={() => {
            setIsModalOpen(false);

            setIsGenerateActive(false);
          }}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
