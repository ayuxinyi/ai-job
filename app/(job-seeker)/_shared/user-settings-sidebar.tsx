import { BellIcon, FileUserIcon } from "lucide-react";

import { SidebarNavMenuGroup } from "@/components/app/sidebar/sidebar-nav-menu-group";

const UserSettingsSIdebar = () => {
  return (
    <SidebarNavMenuGroup
      items={[
        {
          href: "/user-settings/notifications",
          icon: <BellIcon />,
          label: "通知设置",
        },
        {
          href: "/user-settings/resume",
          icon: <FileUserIcon />,
          label: "简历设置",
        },
      ]}
    />
  );
};
export default UserSettingsSIdebar;
