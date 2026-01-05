import { Suspense } from "react";

import { Card, CardContent } from "@/components/ui/card";
import AISummaryCard from "@/modules/resume/ui/components/ai-summary-card";
import { ResumeDetails } from "@/modules/resume/ui/components/resume-details";
import { ResumeDropzoneClient } from "@/modules/resume/ui/components/resume-dropzone-client";

const UserResume = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
      <h1 className="text-2xl font-bold">上传简历</h1>
      <Card>
        <CardContent>
          <ResumeDropzoneClient />
        </CardContent>
        <Suspense>
          <ResumeDetails />
        </Suspense>
      </Card>
      <Suspense>
        <AISummaryCard />
      </Suspense>
    </div>
  );
};
export default UserResume;
