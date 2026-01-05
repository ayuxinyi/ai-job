"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { Json } from "@uploadthing/shared";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import type { UploadThingError } from "uploadthing/server";

import { cn } from "@/lib/utils";

import type { CustomFileRouter } from "../router";

export const UploadButtonComponent = generateUploadButton<CustomFileRouter>();
export const UploadDropzoneComponent =
  generateUploadDropzone<CustomFileRouter>();

export const UploadResumePdfDropzone = ({
  className,
  onClientUploadComplete,
  onUploadError,
  ...props
}: ComponentProps<typeof UploadDropzoneComponent>) => {
  return (
    <UploadDropzoneComponent
      {...props}
      className={cn(
        "border-dashed border-muted border-2 rounded-lg flex items-center justify-center",
        className
      )}
      onClientUploadComplete={res => {
        res.forEach(({ serverData }) => {
          toast.success(serverData.message);
        });
        onClientUploadComplete?.(res);
      }}
      onUploadError={(error: UploadThingError<Json>) => {
        toast.error(error.message);
        onUploadError?.(error);
      }}
    />
  );
};
