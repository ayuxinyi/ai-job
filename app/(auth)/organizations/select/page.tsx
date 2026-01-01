import { OrganizationList } from "@clerk/nextjs";
import type { FC } from "react";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

const OrganizationSelectPage: FC<Props> = props => {
  return (
    <Suspense>
      <OrganizationSelectPageSuspense {...props} />
    </Suspense>
  );
};

const OrganizationSelectPageSuspense: FC<Props> = async ({ searchParams }) => {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/employer";
  return (
    <OrganizationList
      // 不显示个人组织
      hidePersonal
      hideSlug
      // 跳过邀请屏幕，直接选择组织
      skipInvitationScreen
      // 创建组织后跳转
      afterCreateOrganizationUrl={redirectUrl}
      // 选择组织后跳转
      afterSelectOrganizationUrl={redirectUrl}
    />
  );
};

export default OrganizationSelectPage;
