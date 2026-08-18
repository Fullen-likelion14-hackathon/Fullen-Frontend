import type { ReactNode } from "react";

interface ConfirmStepProps {
  step: number;
  title: string;
  onEdit?: () => void;
  children: ReactNode;
}

export default function ConfirmStep({ step, title, onEdit, children }: ConfirmStepProps) {
  return (
    <section className="border-t-2 border-[#DEC5AE] py-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#192C44] text-2xl font-semibold text-[#A3642B]">
            {step}
          </span>

          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md border-2 border-[#B89B84] bg-white px-3 py-1.5 text-sm font-bold"
          >
            수정하기
          </button>
        )}
      </div>

      {children}
    </section>
  );
}
