import { differenceInDays } from "date-fns";
import { connection } from "next/server";
import type { FC } from "react";

import { Badge } from "@/components/ui/badge";

interface Props {
  postedAt: Date;
}

export const DaysSincePosting: FC<Props> = async ({ postedAt }) => {
  await connection();
  const days = differenceInDays(new Date(), postedAt);
  if (days === 0) {
    return <Badge>最新发布</Badge>;
  }
  return new Intl.RelativeTimeFormat("zh-CN", {
    style: "narrow",
    numeric: "always",
  }).format(days, "days");
};
