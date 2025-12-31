"use client";

import { useClerk } from "@clerk/nextjs";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";

import { SignOutButton } from "./auth-buttons";

type User = {
  email: string;
  name: string;
  imageUrl?: string;
};

interface Props {
  user: User;
}

export const SidebarUserButtonClient: FC<Props> = ({ user }) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const { openUserProfile } = useClerk();

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserInfo user={user} />
            <ChevronsUpDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={4}
          align="end"
          side={isMobile ? "bottom" : "right"}
          className="min-w-64 max-w-80"
        >
          <DropdownMenuLabel className="font-normal p-1">
            <UserInfo user={user} />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openUserProfile();
              setOpenMobile(false);
            }}
          >
            <UserIcon className="mr-1" />
            个人中心
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user-settings/notifications">
              <SettingsIcon className="mr-1" />
              通知设置
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton>
            <DropdownMenuItem>
              <LogOutIcon className="mr-1" />
              退出登录
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenu>
  );
};

const UserInfo: FC<Props> = ({ user }) => {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <UserAvatar
        imageUrl={user.imageUrl ?? ""}
        name={user.name}
        seed={user.email}
        variant="botttsNeutral"
      />
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="text-sm font-semibold truncate">{user.name}</span>
        <span className="text-xs truncate">{user.email}</span>
      </div>
    </div>
  );
};
