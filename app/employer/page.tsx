import { Suspense } from "react";

import { EmployerSectionSuspense } from "@/modules/employer/ui/sections/employer-section-suspense";

const EmployerPage = () => {
  return (
    <Suspense>
      <EmployerSectionSuspense />
    </Suspense>
  );
};
export default EmployerPage;
