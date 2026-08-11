import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CustomRequestBoxProps = ComponentProps<"div"> & {
  children: ReactNode;
};

export default function CustomRequestBox({ children, className, ...props }: CustomRequestBoxProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border-3 border-[#C9C9C9] bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
