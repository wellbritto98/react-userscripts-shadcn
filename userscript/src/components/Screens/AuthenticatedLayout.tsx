import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationMenuBar } from "@/components/ui/NavigationMenuBar";
import { AppBarProvider } from "@/components/ui/AppBarContext";
import { AppBar } from "@/components/ui/AppBar";

export function AuthenticatedLayout() {
  return (
    <AppBarProvider>
      <div className="ppm:flex ppm:flex-col ppm:h-full ppm:overflow-hidden">
        <AppBar />

        {/* Miolo com scroll e altura limitada entre AppBar e NavigationMenuBar */}
        <div className="ppm:flex-1 ppm:overflow-y-auto ppm:overflow-x-hidden ppm:pb-28">
          <Outlet />
        </div>

        {/* Footer fixo, nunca deve sair da tela */}
        <NavigationMenuBar />
      </div>
    </AppBarProvider>
  );
}
