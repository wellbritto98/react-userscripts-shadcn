import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function MainScreen() {
    const { user } = useAuth();
    console.log("user", user);
    // Redireciona para a tela correta conforme autenticação
    if (user) {
        return <Navigate to="/profile" replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
    return null;
}