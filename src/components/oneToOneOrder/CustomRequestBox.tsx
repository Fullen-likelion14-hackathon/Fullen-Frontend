import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CustomRequestBoxProps = ComponentProps<"div"> & {
  children: ReactNode;
  isFilled?: boolean;
};

export default function CustomRequestBox({
  children,
  className,
  isFilled = false,
  ...props
}: CustomRequestBoxProps) {
  return (
    <div
      className={cn(
        "flex w-85 items-center justify-center rounded-xl border-3 bg-white",
        isFilled ? "border-[#242D41]" : "border-[#C9C9C9]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
