import { useEffect, useState } from "react";

export const useIsBreakpoint = (breakpoint: string) => {
  const [isBreakpoint, setIsBreakpoint] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(`(${breakpoint})`).matches;
    }
    return false;
  });
  useEffect(() => {
    const media = window.matchMedia(`(${breakpoint})`);
    const controller = new AbortController();

    media.addEventListener(
      "change",
      e => {
        setIsBreakpoint(e.matches);
      },
      { signal: controller.signal }
    );
    return () => {
      controller.abort();
    };
  }, [breakpoint]);
  return isBreakpoint;
};
