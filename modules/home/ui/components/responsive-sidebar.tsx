"use client";

import type { FC, PropsWithChildren } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

// 响应式侧边栏，用于判断当前是否为移动端，移动端以抽屉的形式展示侧边栏
export const ResponsiveSidebar: FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <header className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-1">
          <SidebarTrigger />
          <span className="text-xl text-nowrap">WDS Jobs</span>
        </div>
        <div className="flex-1 flex">{children}</div>
      </header>
    );
  }

  return children;
};
