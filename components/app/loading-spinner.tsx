import { Loader2Icon } from "lucide-react";
import type { ComponentProps, FC } from "react";

import { cn } from "@/lib/utils";
type Props = ComponentProps<typeof Loader2Icon>;
export const LoadingSpinner: FC<Props> = ({ className, ...props }) => {
  return (
    <div className="size-full flex items-center justify-center">
      <Loader2Icon
        className={cn("animate-spin size-16", className)}
        {...props}
      />
    </div>
  );
};
