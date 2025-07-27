// AppBarProvider.tsx
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface AppBarContextType {
  content: ReactNode;
  setAppBarContent: (content: ReactNode) => void;
}

const AppBarContext = createContext<AppBarContextType | undefined>(undefined);

export function useAppBar() {
  const ctx = useContext(AppBarContext);
  if (!ctx) throw new Error("useAppBar deve ser usado dentro de AppBarProvider");
  return ctx;
}

export function AppBarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);

  const setAppBarContent = useCallback((node: ReactNode) => {
    setContent(node);
  }, []);

  const value = useMemo(() => ({ content, setAppBarContent }), [content, setAppBarContent]);

  return <AppBarContext.Provider value={value}>{children}</AppBarContext.Provider>;
}
