import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationMenuBar } from "@/components/ui/NavigationMenuBar";

export function AuthenticatedLayout() {
  return (
    <div>
      <Outlet />
      <NavigationMenuBar />
    </div>
  );
} 