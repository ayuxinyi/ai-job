import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { JobListingAiSearchForm } from "./job-listing-ai-search-form";

export const AICard = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>AI 搜索</CardTitle>
        <CardDescription>
          这可能需要花费一些时间，请您耐心等待。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JobListingAiSearchForm />
      </CardContent>
    </>
  );
};
