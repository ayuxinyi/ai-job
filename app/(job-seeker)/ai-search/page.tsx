import AsyncIf from "@/components/app/async-if";
import { LoadingSwap } from "@/components/app/loading-swap";
import { Card } from "@/components/ui/card";
import { AICard } from "@/modules/ai-search/ui/components/ai-card";
import { NoPermission } from "@/modules/ai-search/ui/components/no-permission";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";

const AISearchPage = () => {
  return (
    <div className="px-4 flex items-center justify-center min-h-screen">
      <Card className="max-w-4xl">
        <AsyncIf
          condition={async () => {
            const { userId } = await getCurrentUser();
            return userId !== null;
          }}
          loadingFallback={
            <LoadingSwap isLoading loadingText="">
              <AICard />
            </LoadingSwap>
          }
          otherwise={<NoPermission />}
        >
          <AICard />
        </AsyncIf>
      </Card>
    </div>
  );
};

export default AISearchPage;
