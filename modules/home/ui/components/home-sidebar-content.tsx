import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogInIcon,
  SparklesIcon,
} from "lucide-react";

import { SidebarNavMenuGroup } from "@/components/app/sidebar/sidebar-nav-menu-group";

const navItems = [
  {
    href: "/",
    icon: <ClipboardListIcon />,
    label: "工作平台",
  },
  {
    href: "/ai-search",
    icon: <SparklesIcon />,
    label: "AI 搜索",
  },
  {
    href: "/employer",
    icon: <LayoutDashboardIcon />,
    label: "雇主平台",
    authStatus: "signedIn" as const,
  },
  {
    href: "/sign-in",
    icon: <LogInIcon />,
    label: "账号登录",
    authStatus: "signedOut" as const,
  },
];
export const HomeSidebarContent = () => {
  return <SidebarNavMenuGroup className="mt-auto" items={navItems} />;
};
