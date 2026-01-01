import { Loader2Icon } from "lucide-react";
import type { FC, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface Props {
  isLoading: boolean;
  className?: string;
  loadingText?: string;
}

export const LoadingSwap: FC<PropsWithChildren<Props>> = ({
  isLoading,
  children,
  className,
  loadingText = "加载中...",
}) => {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1 flex items-center justify-center gap-2",
          isLoading ? "invisible" : "visible",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1 flex items-center justify-center gap-2",
          isLoading ? "visible" : "invisible",
          className
        )}
      >
        <Loader2Icon className="animate-spin" />
        <span>{loadingText}</span>
      </div>
    </div>
  );
};
