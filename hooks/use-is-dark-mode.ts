import { useEffect, useState } from "react";

export const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return;
    // 初始化时根据系统设置设置初始值
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // 创建一个控制器，用于取消事件监听
    const controller = new AbortController();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      e => {
        setIsDarkMode(e.matches);
      },
      // 将控制器的信号传递给事件监听，用于取消监听
      { signal: controller.signal }
    );
    return () => {
      // 组件卸载时取消事件监听
      controller.abort();
    };
  }, []);

  return {
    isDarkMode,
  };
};
