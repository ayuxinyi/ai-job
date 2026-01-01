"use client";
import type { FC, ReactNode } from "react";

interface Props {
  items: {
    href: string;
    icon: ReactNode;
    label: string;
    authStatus?: "signedOut" | "signedIn";
  }[];
  className?: string;
}

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
} from "@/modules/auth/ui/components/sign-in-status";

export const SidebarNavMenuGroup: FC<Props> = ({ items, className }) => {
  const pathname = usePathname();
  return (
    <SidebarGroup className={cn(className)}>
      <SidebarMenu className="space-y-2">
        {items.map(item => {
          const html = (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
          return item.authStatus === "signedOut" ? (
            <SignedOut key={item.href}>{html}</SignedOut>
          ) : item.authStatus === "signedIn" ? (
            <SignedIn key={item.href}>{html}</SignedIn>
          ) : (
            html
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
