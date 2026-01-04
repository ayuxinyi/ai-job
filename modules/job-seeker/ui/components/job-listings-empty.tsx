import { BellIcon, RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface JobListingsEmptyProps {
  searchParamsObj: Record<string, string | string[]>;
}

export function JobListingsEmpty({ searchParamsObj }: JobListingsEmptyProps) {
  return (
    <Empty className="from-muted/50 to-background h-screen bg-linear-to-b from-30% -mt-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellIcon />
        </EmptyMedia>
        <EmptyTitle>暂未发现招聘信息</EmptyTitle>
        <EmptyDescription>
          {Object.keys(searchParamsObj).length === 0
            ? "招聘信息正在整理中 🕊️，新的岗位很快就会发布，记得常回来看看。"
            : "当前条件下暂无匹配岗位 🔍，建议放宽筛选范围以获取更多结果。"}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          <RefreshCcwIcon />
          刷新岗位
        </Button>
      </EmptyContent>
    </Empty>
  );
}
