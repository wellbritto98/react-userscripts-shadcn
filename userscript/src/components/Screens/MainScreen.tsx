import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function MainScreen() {
    const { user } = useAuth();
    const location = useLocation();
    // Redireciona para a tela correta conforme autenticação
    if (user) {
        if (location.pathname !== "/profile") {
            return <Navigate to="/profile" replace />;
        }
    } else {
        if (location.pathname !== "/login" && location.pathname !== "/register") {
            return <Navigate to="/login" replace />;
        }
    }
    return null;
}