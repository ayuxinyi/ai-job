import { type FC, Suspense } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { JobListingEditSection } from "@/modules/job-listing/ui/section/job-listing-edit-section";

interface Props {
  params: Promise<{ jobListingId: string }>;
}

const JobListingEditPage: FC<Props> = ({ params }) => {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-bold mb-2">编辑岗位</h1>
      <p className="text-muted-foreground mb-6">
        需要注意：这并不会发布该岗位，它只会保存为草稿。
      </p>
      <Card>
        <CardContent>
          <Suspense>
            <JobListingEditSection params={params} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};
export default JobListingEditPage;
