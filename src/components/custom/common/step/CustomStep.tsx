import type { ReactNode } from "react";

export type StepStatus = "pending" | "active" | "completed";

interface CustomStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  status: StepStatus;
  children?: ReactNode;
}

const CustomStep = ({
  step,
  totalSteps,
  title,
  description,
  status,
  children,
}: CustomStepProps) => {
  const isCompleted = status === "completed";
  const isLastStep = step === totalSteps;

  // 현재 단계 / 완료 단계 / 대기 단계에 따라 원 스타일을 변경함
  const stepCircleStyle = {
    active: "border-[#A3642B] bg-white text-[#A3642B]",
    completed: "border-[#D8CCC1] bg-[#F9F4F0] text-[#D8CCC1]",
    pending: "border-[#D8CCC1] bg-white text-[#D8CCC1]",
  }[status];

  return (
    <section className="w-full">
      {/* 스텝 번호 + 제목 영역 */}
      <div className="flex items-start gap-3">
        {/* 스텝 번호 */}
        <div className="relative flex shrink-0 flex-col items-center">
          <div
            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-3xl font-medium ${stepCircleStyle}`}
          >
            {step}
          </div>

          {/* 완료된 단계와 다음 단계 사이의 연결선 */}
          {!isLastStep && isCompleted && (
            <div aria-hidden="true" className="absolute top-12 h-10 w-0.5 bg-[#D8CCC1]" />
          )}
        </div>

        {/* 스텝 제목 + 설명 */}
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="text-2xl font-bold leading-tight text-[#192C44]">{title}</h2>

          {isCompleted ? (
            <p className="mt-1 text-base font-semibold text-[#B89B84]">선택 완료</p>
          ) : (
            description && (
              <p className="whitespace-nowrap text-base font-semibold text-[#B89B84]">
                {description}
              </p>
            )
          )}
        </div>
      </div>

      {/* 해당 스텝에서 사용하는 선택 UI */}
      {children && <div className="mt-4 w-full">{children}</div>}
    </section>
  );
};

export default CustomStep;
