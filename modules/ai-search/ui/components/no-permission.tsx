import { CardContent } from "@/components/ui/card";
import { SignUpButton } from "@/modules/auth/ui/components/auth-buttons";

export const NoPermission = () => {
  return (
    <CardContent className="text-center">
      <h2 className="text-xl font-bold mb-1">权限不足</h2>
      <p className="mb-4 text-muted-foreground">
        很抱歉，您需要先创建一个账号才能使用 AI
        搜索功能，请点击“注册账号”按钮创建一个新的账号。
      </p>
      <SignUpButton />
    </CardContent>
  );
};
