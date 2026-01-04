"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { type FC, type PropsWithChildren, useState } from "react";

import { Sheet } from "@/components/ui/sheet";

export const ClientSheet: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Sheet
      open={isOpen}
      onOpenChange={open => {
        if (open) return;
        setIsOpen(false);
        router.push(`/?${searchParams.toString()}`);
      }}
      modal
    >
      {children}
    </Sheet>
  );
};
