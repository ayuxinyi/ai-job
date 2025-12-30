import type { FC, PropsWithChildren } from "react";

const ClerkLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {children}
    </div>
  );
};
export default ClerkLayout;
