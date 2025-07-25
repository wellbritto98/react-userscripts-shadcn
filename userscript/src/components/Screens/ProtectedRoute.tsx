import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    if (loading) return null; // ou um spinner
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
} 