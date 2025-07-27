import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationMenuBar } from "@/components/ui/NavigationMenuBar";
import { AppBarProvider } from "@/components/ui/AppBarContext";

export function AuthenticatedLayout() {
  return (
    <AppBarProvider>
      <Outlet />
      <NavigationMenuBar />
    </AppBarProvider>
  );
} 