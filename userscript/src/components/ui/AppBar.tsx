import { useAppBar } from "./AppBarContext";

export function AppBar() {
  const { content } = useAppBar();
  return (
    <header className="ppm:h-12 ppm:flex ppm:items-center ppm:px-4 ppm:bg-white ppm:border-b ppm:border-gray-200 ppm:sticky ppm:top-0 ppm:z-20">
      {content ?? <span className="ppm:font-bold ppm:text-lg">Popgram</span>}
    </header>
  );
} 