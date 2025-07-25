import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from "./StatusBar";
import { CloseButton } from "./CloseButton";
import { MemoryRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginScreen } from "@/components/Screens/LoginScreen";
import { RegisterScreen } from "@/components/Screens/RegisterScreen";
import { UserProfileScreen } from "@/components/Screens/UserProfileScreen";

interface CellphoneProps {
    isOpen: boolean;
    onClose: () => void;
}

function MainScreen() {
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

function ConfigScreen() {
    return (
        <div className="ppm:space-y-4">
            <h2 className="ppm:text-lg ppm:font-bold">Configurações</h2>
            <p className="ppm:text-sm">Aqui vão as configurações do app.</p>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>Voltar</Button>
        </div>
    );
}

function AjudaScreen() {
    return (
        <div className="ppm:space-y-4">
            <h2 className="ppm:text-lg ppm:font-bold">Ajuda</h2>
            <p className="ppm:text-sm">Aqui vão informações de ajuda.</p>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>Voltar</Button>
        </div>
    );
}

export function Cellphone({ isOpen, onClose }: CellphoneProps) {
    if (!isOpen) return null;

    return (
        <div className="ppm:fixed ppm:inset-0 ppm:bg-black/50 ppm:flex ppm:items-center ppm:justify-center ppm:z-50">
            <div className="ppm:relative ppm:w-[300px] ppm:h-[600px] ppm:bg-gray-900 ppm:rounded-[3rem] ppm:p-2 ppm:shadow-2xl">
                <CloseButton onClose={onClose} />
                <div className="ppm:w-full ppm:h-full ppm:bg-white ppm:rounded-[2.5rem] ppm:overflow-hidden ppm:relative">
                    <div className="ppm:absolute ppm:top-0 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-6 ppm:bg-black ppm:rounded-b-2xl ppm:z-10"></div>
                    <StatusBar />
                    <MemoryRouter initialEntries={["/login"]}>
                        <div className="ppm:flex-1 ppm:p-6 ppm:pt-8">
                            <Routes>
                                <Route path="/" element={<MainScreen />} />
                                <Route path="/login" element={<LoginScreen />} />
                                <Route path="/register" element={<RegisterScreen />} />
                                <Route path="/profile" element={<UserProfileScreen />} />
                                <Route path="/config" element={<ConfigScreen />} />
                                <Route path="/ajuda" element={<AjudaScreen />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </MemoryRouter>
                    <div className="ppm:absolute ppm:bottom-2 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-1 ppm:bg-gray-400 ppm:rounded-full"></div>
                </div>
            </div>
        </div>
    );
}