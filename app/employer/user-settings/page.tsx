import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LoadingSpinner } from "@/components/app/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/actions/get-current-auth";

import { SuspendedForm } from "./_components/suspended-form";

const EmployerUserSettingsPage = () => {
  return (
    <Suspense>
      <SuspenseComponent />
    </Suspense>
  );
};
export default EmployerUserSettingsPage;

const SuspenseComponent = async () => {
  const { userId } = await getCurrentUser();
  const { orgId } = await getCurrentOrganization();
  if (!userId || !orgId) return notFound();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">通知设置</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={userId} orgId={orgId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};
