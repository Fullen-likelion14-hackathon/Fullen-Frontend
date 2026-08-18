import { useState } from "react";
import InfoButton from "@/components/common/button/InfoButton";
import NoticeToast from "@/components/common/NoticeToast";
import { CustomGenerateButton } from "@/components/custom/common/CustomGenerate";
import { ApplyButton } from "@/components/custom/common/ApplyButton";
import InitialEditor from "@/components/custom/initials/InitialEditor";
import InitialCreateModal from "@/components/custom/initials/InitialCreateModal";

interface InitialItem {
  // 이니셜 하나하나 구분하기 위한 id임
  id: number;

  // 사용자가 입력해서 생성한 이니셜 글자임
  text: string;

  // 해당 이니셜이 현재 가지고 있는 색상임
  color: string;

  // 해당 이니셜이 현재 가지고 있는 글자 굵기임
  fontWeight: "normal" | "bold";

  // 가방에 최종 적용됐는지 여부임
  applied: boolean;

  // 가방 위에 표시될 이니셜 위치값임
  // 나중에 드래그 기능 붙일 때 이 값 변경하면 됨
  x: number;
  y: number;
}

interface Notice {
  // 생성 완료인지 적용 완료인지 구분함
  type: "created" | "applied";

  // 토스트에 실제로 보여줄 문구임
  message: string;
}

export default function InitialPanel() {
  // 이니셜 입력 팝업이 열려있는지 저장함
  // false면 안 보이고 true면 팝업 보여줌
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aa 이니셜 생성 버튼이 활성화 스타일인지 저장함
  // 처음에는 생성 시작 전이라 false임
  const [isGenerateActive, setIsGenerateActive] = useState(false);

  // 지금까지 생성한 모든 이니셜 저장함
  // 배열이라 새 이니셜 생성해도 기존 이니셜 안 없어짐
  const [initials, setInitials] = useState<InitialItem[]>([]);

  // 현재 사용자가 선택해서 편집중인 이니셜 id 저장함
  // null이면 현재 선택된 이니셜 없음
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 생성 완료 / 적용 완료 토스트 상태 저장함
  // null이면 토스트 안 보임
  const [notice, setNotice] = useState<Notice | null>(null);

  // initials 배열에서 현재 선택된 id와 같은 이니셜 찾음
  // 선택된 게 없으면 undefined가 됨
  const selectedInitial = initials.find((initial) => initial.id === selectedId);

  // 완료문구를 보여주고 3초 뒤 자동으로 없애는 함수임
  const showNotice = (newNotice: Notice) => {
    // 전달받은 토스트 내용 먼저 보여줌
    setNotice(newNotice);

    // 3초 지나면 notice를 null로 만들어서 토스트 숨김
    setTimeout(() => {
      setNotice(null);
    }, 3000);
  };

  // 팝업에서 생성하기 눌렀을 때 실행되는 함수임
  const handleCreate = (text: string) => {
    // 새 이니셜 객체 하나 만듦
    const newInitial: InitialItem = {
      // 현재 시간값을 임시 id로 사용함
      id: Date.now(),

      // 팝업에서 입력한 글자 저장함
      text,

      // 새 이니셜 기본 색상은 검정색임
      color: "#29292B",

      // 새 이니셜 기본 굵기는 기본임
      fontWeight: "normal",

      // 아직 가방에 최종 적용하기 전 상태임
      applied: false,

      // 새 이니셜 처음 위치임
      // 화면의 50%, 50% 위치에 생성함
      x: 50,
      y: 50,
    };

    // 기존 배열은 유지하고 맨 뒤에 새 이니셜 하나 추가함
    setInitials((prev) => [...prev, newInitial]);

    // 새로 만든 이니셜 바로 선택 상태로 만듦
    // 그래서 생성 직후 색상/굵기 편집 UI 바로 보이게 됨
    setSelectedId(newInitial.id);

    // 생성 끝났으므로 입력 팝업 닫음
    setIsModalOpen(false);

    // 새 이니셜 편집중이므로 생성 버튼 활성화 스타일 유지함
    setIsGenerateActive(true);

    // 생성 완료 토스트 3초동안 보여줌
    showNotice({
      type: "created",
      message: "새 이니셜이 생성되었습니다",
    });
  };

  // 색상 팔레트에서 색 클릭했을 때 실행됨
  const handleColorChange = (color: string) => {
    // 선택된 이니셜 없으면 아무것도 안 함
    if (selectedId === null) return;

    // initials 배열 전체를 돌면서 선택된 이니셜만 수정함
    setInitials((prev) =>
      prev.map((initial) =>
        initial.id === selectedId
          ? {
              // 기존 데이터는 그대로 유지함
              ...initial,

              // 선택한 색상만 바꿈
              color,

              // 적용 후 다시 수정한 경우 재적용이 필요하므로 false로 바꿈
              applied: false,
            }
          : initial,
      ),
    );
  };

  // 기본 / 볼드 눌렀을 때 실행됨
  const handleFontWeightChange = (fontWeight: "normal" | "bold") => {
    // 선택된 이니셜 없으면 아무것도 안 함
    if (selectedId === null) return;

    // 선택된 이니셜만 굵기 변경함
    setInitials((prev) =>
      prev.map((initial) =>
        initial.id === selectedId
          ? {
              ...initial,

              // 선택한 굵기로 변경함
              fontWeight,

              // 수정했으므로 다시 적용 필요한 상태로 변경함
              applied: false,
            }
          : initial,
      ),
    );
  };

  // 선택된 이니셜 삭제할 때 실행됨
  const handleDelete = (id: number) => {
    // 전달받은 id를 제외한 이니셜만 다시 저장함
    setInitials((prev) => prev.filter((initial) => initial.id !== id));

    // 삭제했으므로 선택 상태도 해제함
    setSelectedId(null);

    // 생성중인 새 이니셜도 없어졌으므로 생성 버튼 비활성화함
    setIsGenerateActive(false);
  };

  // 가방에 적용하기 눌렀을 때 실행됨
  const handleApply = () => {
    // 선택된 이니셜 없으면 실행 안 함
    if (selectedId === null) return;

    // 현재 선택된 이니셜만 applied true로 변경함
    setInitials((prev) =>
      prev.map((initial) =>
        initial.id === selectedId
          ? {
              ...initial,
              applied: true,
            }
          : initial,
      ),
    );

    // 적용 끝났으므로 편집 선택 해제함
    // 이 값이 null이 되면서 InitialEditor도 사라짐
    setSelectedId(null);

    // 적용 끝났으므로 생성 버튼 활성화 스타일도 해제함
    setIsGenerateActive(false);

    // 적용 완료 토스트 3초동안 보여줌
    showNotice({
      type: "applied",
      message: "이니셜을 가방에 적용했습니다",
    });
  };

  return (
    <>
      {/* 생성 / 적용 완료 토스트임 */}
      {/* notice가 있을 때만 보여줌 */}
      {/* fixed + 높은 z-index라 다른 UI보다 위에 표시됨 */}
      {notice && <NoticeToast type={notice.type} message={notice.message} />}

      {/* 이니셜 생성 버튼임 */}
      {/* 처음에는 기본 스타일이고 생성 시작하면 active 상태 유지함 */}
      <div className="pointer-events-auto absolute left-11 top-30">
        <CustomGenerateButton
          text="Aa 이니셜 생성"
          active={isGenerateActive}
          onClick={() => {
            // 새 이니셜 생성 플로우 시작함
            // 버튼 활성 스타일로 변경함
            setIsGenerateActive(true);

            // 이니셜 입력 팝업 열어줌
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* 안내 버튼임 */}
      <div className="pointer-events-auto absolute right-11 top-30">
        <InfoButton content="이니셜을 생성한 후 선택해서 색상과 굵기를 변경할 수 있음" />
      </div>

      {/* 생성된 이니셜들 가방 위에 보여줌 */}
      {/* initials가 빈 배열이면 아무것도 안 보임 */}
      {initials.map((initial) => {
        // 지금 이 이니셜이 선택된 상태인지 확인함
        const isSelected = initial.id === selectedId;

        return (
          <div
            key={initial.id}
            // 이니셜 누르면 해당 이니셜 다시 선택해서 편집 가능함
            onClick={() => {
              // 클릭한 이니셜 선택함
              setSelectedId(initial.id);

              // 기존 이니셜 수정이므로 생성 버튼은 비활성 상태 유지함
              setIsGenerateActive(false);

              // 떠있는 토스트 있으면 바로 없앰
              setNotice(null);
            }}
            className={`
              pointer-events-auto
              absolute
              cursor-pointer
              ${isSelected ? "border border-[#6E3C27]" : ""}
            `}
            style={{
              // 저장된 x, y 위치값으로 화면에 배치함
              left: `${initial.x}%`,
              top: `${initial.y}%`,

              // 요소 자기 크기의 절반만큼 다시 이동해서 가운데 기준 맞춤
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* 현재 선택된 이니셜일 때만 편집 컨트롤 보여줌 */}
            {isSelected && (
              <div
                className="
                  absolute
                  -top-8
                  left-1/2
                  flex
                  -translate-x-1/2
                  gap-1
                  rounded-full
                  bg-[#E5E5E5]
                  px-2
                  py-1
                "
              >
                {/* 나중에 드래그 / 위치 조정 기능 넣을 버튼임 */}
                <button
                  type="button"
                  onClick={(event) => {
                    // 이 버튼 눌렀을 때 바깥 이니셜 클릭 이벤트 실행되는거 막음
                    event.stopPropagation();
                  }}
                  className="text-[12px]"
                >
                  ↔
                </button>

                {/* 이니셜 삭제 버튼임 */}
                <button
                  type="button"
                  onClick={(event) => {
                    // 삭제 버튼 눌렀을 때 부모 클릭 이벤트 실행되는거 막음
                    event.stopPropagation();

                    // 현재 이니셜 삭제함
                    handleDelete(initial.id);
                  }}
                  className="text-[12px]"
                >
                  삭제
                </button>
              </div>
            )}

            {/* 실제 이니셜 글자임 */}
            <span
              className={`
                block
                px-2
                py-1
                text-[32px]
                ${initial.fontWeight === "bold" ? "font-bold" : "font-normal"}
              `}
              // 사용자가 선택한 색상 적용함
              style={{
                color: initial.color,
              }}
            >
              {initial.text}
            </span>
          </div>
        );
      })}

      {/* 선택된 이니셜 있을 때만 편집 UI 보여줌 */}
      {/* 선택 해제되면 기본/볼드, 색상 팔레트 같이 사라짐 */}
      {selectedInitial && (
        <InitialEditor
          // 해당 이니셜이 저장하고 있던 굵기 전달함
          fontWeight={selectedInitial.fontWeight}

          // 굵기 변경 함수 전달함
          onFontWeightChange={handleFontWeightChange}

          // 해당 이니셜이 저장하고 있던 색상 전달함
          selectedColor={selectedInitial.color}

          // 색상 변경 함수 전달함
          onColorChange={handleColorChange}
        />
      )}

      {/* 가방에 적용하기 버튼임 */}
      <div
        className="
          pointer-events-auto
          absolute
          inset-x-0
          bottom-25
          flex
          justify-center
        "
      >
        <ApplyButton
          text="가방에 적용하기"

          // 클릭하면 현재 선택된 이니셜 적용함
          onApply={handleApply}

          // 선택된 이니셜 없으면 버튼 비활성화함
          disabled={!selectedInitial}
        />
      </div>

      {/* 이니셜 생성 버튼 눌렀을 때만 입력 팝업 보여줌 */}
      {isModalOpen && (
        <InitialCreateModal
          onClose={() => {
            // X 눌러서 팝업 닫음
            setIsModalOpen(false);

            // 생성 취소한거라 생성 버튼 활성 스타일도 해제함
            setIsGenerateActive(false);
          }}
          // 생성하기 누르면 위에서 만든 handleCreate 실행함
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
