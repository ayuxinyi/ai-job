"use client";

import type { FC, PropsWithChildren, ReactNode } from "react";

import { useIsBreakpoint } from "@/hooks/use-is-break-point";

interface Props {
  breakpoint: string;
  otherwise: ReactNode;
}

export const IsBreakpoint: FC<PropsWithChildren<Props>> = ({
  breakpoint,
  otherwise,
  children,
}) => {
  const IsBreakpoint = useIsBreakpoint(breakpoint);

  return IsBreakpoint ? children : otherwise;
};
