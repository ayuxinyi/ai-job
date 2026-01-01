"use client";

import { useClerk } from "@clerk/nextjs";
import {
  ArrowLeftRightIcon,
  Building2Icon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
  UserRoundCogIcon,
} from "lucide-react";
import Link from "next/link";
import { type FC, useMemo } from "react";

import { UserAvatar } from "@/components/app/user-avatar";
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
import type { OrganizationsTable } from "@/db/schema";
import { SignOutButton } from "@/modules/auth/ui/components/auth-buttons";

type User = {
  email: string;
  name: string;
  imageUrl?: string;
};

interface Props {
  user: User;
  organization: typeof OrganizationsTable.$inferSelect;
}

export const SidebarOrganizationButtonClient: FC<Props> = ({
  user,
  organization,
}) => {
  const { isMobile, setOpenMobile } = useSidebar();
  const { openOrganizationProfile } = useClerk();

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <OrganizationInfo organization={organization} user={user} />
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
            <OrganizationInfo organization={organization} user={user} />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              openOrganizationProfile();
              setOpenMobile(false);
            }}
          >
            <Building2Icon className="mr-1" />
            组织中心
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/employer/user-settings">
              <UserRoundCogIcon className="mr-1" />
              用户设置
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/employer/pricing">
              <CreditCardIcon className="mr-1" />
              价格计划
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/organizations/select">
              <ArrowLeftRightIcon className="mr-1" />
              切换组织
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

const OrganizationInfo: FC<Props> = ({ organization, user }) => {
  const nameInitials = useMemo(
    () =>
      organization.name
        .split(" ")
        .slice(0, 2)
        .map(str => str[0])
        .join(""),
    [organization.name]
  );

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <UserAvatar
        imageUrl={organization.imageUrl ?? ""}
        name={organization.name}
        seed={nameInitials}
        variant="initials"
      />
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="text-sm font-semibold truncate">
          {organization.name}
        </span>
        <span className="text-xs truncate">{user.email}</span>
      </div>
    </div>
  );
};
