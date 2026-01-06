import { StarIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  rating: number;
}

export const RatingIcon: FC<Props> = ({ rating, className }) => {
  if (!rating || rating < 1 || rating > 5) return "评分无效";

  const stars: ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        className={cn("size-4", rating >= i && "fill-current", className)}
      />
    );
  }

  return (
    <div className="flex gap-1">
      {stars}
      <span className="sr-only">{rating} / 5</span>
    </div>
  );
};
