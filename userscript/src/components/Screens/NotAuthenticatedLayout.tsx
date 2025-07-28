import React from "react";
import { Outlet } from "react-router-dom";
import { AppBarProvider } from "@/components/ui/AppBarContext";
import { AppBar } from "@/components/ui/AppBar";

export function NotAuthenticatedLayout() {
  return (
    <AppBarProvider>
      <div className="ppm:flex ppm:flex-col ppm:h-full ppm:overflow-hidden">
        <AppBar />

        {/* Miolo com scroll e altura limitada entre AppBar e NavigationMenuBar */}
        <div className="ppm:flex-1 ppm:overflow-y-auto ppm:overflow-x-hidden ppm:pb-28">
          <Outlet />
        </div>

      </div>
    </AppBarProvider>
  );
}
