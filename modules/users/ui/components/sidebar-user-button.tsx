import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

import { SidebarUserButtonClient } from "./sidebar-user-button-client";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

const SidebarUserSuspense = async () => {
  const { userId } = await auth();
  return (
    <SidebarUserButtonClient
      user={{ email: "test@example.com", name: "Test User" }}
    />
  );
};
