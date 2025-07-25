import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationMenuBar } from "@/components/ui/NavigationMenuBar";

export function AuthenticatedLayout() {
  return (
    <div className="ppm:pb-16">
      <Outlet />
      <NavigationMenuBar />
    </div>
  );
} 