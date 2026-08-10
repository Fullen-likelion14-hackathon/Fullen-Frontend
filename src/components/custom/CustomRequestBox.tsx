import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CustomRequestBoxProps = {
  children: ReactNode;
  className?: string;
};

export default function CustomRequestBox({ children, className }: CustomRequestBoxProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border-3 border-[#C9C9C9] bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
