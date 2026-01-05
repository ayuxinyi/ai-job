"use client";

import { useRouter } from "next/navigation";

import { UploadResumePdfDropzone } from "@/services/uploadthing/components/upload-thing";

export const ResumeDropzoneClient = () => {
  const router = useRouter();
  return (
    <UploadResumePdfDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={() => router.refresh()}
    />
  );
};
