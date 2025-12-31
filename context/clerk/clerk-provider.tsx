"use client";
import { zhCN } from "@clerk/localizations";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type FC, type PropsWithChildren, Suspense } from "react";

import { useIsDarkMode } from "@/hooks/use-is-dark-mode";

export const ClerkProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDarkMode } = useIsDarkMode();
  return (
    <Suspense>
      <OriginalClerkProvider
        appearance={isDarkMode ? { baseTheme: [dark] } : undefined}
        localization={zhCN}
      >
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
};
