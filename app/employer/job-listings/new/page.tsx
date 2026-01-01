import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/modules/job-listing/ui/components/job-listing-form";

const NewJobListingsPage = () => {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-bold mb-2">发布新岗位</h1>
      <p className="text-muted-foreground mb-6">
        This does not post the listing yet. It just save a draft.
      </p>
      <Card>
        <CardContent>
          <JobListingForm />
        </CardContent>
      </Card>
    </div>
  );
};
export default NewJobListingsPage;
