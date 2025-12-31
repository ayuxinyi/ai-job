import {
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
} from "@clerk/nextjs";
import { type FC, type PropsWithChildren, Suspense } from "react";

// 未登录时展示的内容
export const SignedOut: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense>
      <ClerkSignedOut>{children}</ClerkSignedOut>
    </Suspense>
  );
};

// 已登录时展示的内容
export const SignedIn: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense>
      <ClerkSignedIn>{children}</ClerkSignedIn>
    </Suspense>
  );
};
