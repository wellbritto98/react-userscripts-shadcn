// AppBarProvider.tsx
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface AppBarContextType {
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
    console.log("[AppBar] setAppBarContent chamado", node, typeof node);
    setContent(node);
  }, []);

  React.useEffect(() => {
    console.log("[AppBar] content mudou:", content);
  }, [content]);

  const value = useMemo(() => ({ setAppBarContent }), [setAppBarContent]);

  console.log("[AppBar] render", { content });

  return (
    <AppBarContext.Provider value={value}>
      <div className="ppm:w-full ppm:h-12 ppm:flex ppm:items-center ppm:px-4 ppm:bg-white ppm:border-b ppm:border-gray-200 ppm:sticky">
        {content || <span className="ppm:font-bold ppm:text-lg ppm:top-0 ppm:z-20">Popgram</span>}
      </div>
      {children}
    </AppBarContext.Provider>
  );
}
