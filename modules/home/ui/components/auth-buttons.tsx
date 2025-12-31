import {
  SignInButton as ClerkSignInButton,
  SignOutButton as ClerkSignOutButton,
  SignUpButton as ClerkSignUpButton,
} from "@clerk/nextjs";
import type { ComponentProps, FC } from "react";

import { Button } from "@/components/ui/button";

type AuthButtonsProps = ComponentProps<typeof ClerkSignInButton>;

export const SignUpButton: FC<AuthButtonsProps> = ({
  children = <Button>注册账号</Button>,
  ...props
}) => {
  return <ClerkSignUpButton {...props}>{children}</ClerkSignUpButton>;
};

export const SignInButton: FC<AuthButtonsProps> = ({
  children = <Button>登录账号</Button>,
  ...props
}) => {
  return <ClerkSignInButton {...props}>{children}</ClerkSignInButton>;
};

export const SignOutButton: FC<AuthButtonsProps> = ({
  children = <Button>退出登录</Button>,
  ...props
}) => {
  return <ClerkSignOutButton {...props}>{children}</ClerkSignOutButton>;
};
