import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function UserProfileScreen() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <>
            <CardHeader className="ppm:text-center ppm:pb-6">
                <div className="ppm:flex ppm:justify-center ppm:mb-4">
                    <div className="ppm:w-16 ppm:h-16 ppm:bg-blue-500 ppm:rounded-full ppm:flex ppm:items-center ppm:justify-center">
                        <User className="ppm:w-8 ppm:h-8 ppm:text-white" />
                    </div>
                </div>
                <CardTitle className="ppm:text-xl ppm:font-bold ppm:text-gray-900">
                    Bem-vindo!
                </CardTitle>
                <p className="ppm:text-gray-600 ppm:text-sm ppm:break-all">
                    {user.email}
                </p>
            </CardHeader>
            <CardContent>
                <div className="ppm:space-y-4">
                    <div className="ppm:bg-gray-50 ppm:p-4 ppm:rounded-lg">
                        <h3 className="ppm:font-medium ppm:text-gray-900 ppm:mb-2">Informações da Conta</h3>
                        <p className="ppm:text-sm ppm:text-gray-600">UID: {user.uid.substring(0, 8)}...</p>
                        <p className="ppm:text-sm ppm:text-gray-600">Criado em: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    </div>
                    <Button 
                        onClick={handleLogout}
                        className="ppm:w-full ppm:bg-red-500 ppm:hover:bg-red-600"
                        disabled={loading}
                    >
                        <LogOut className="ppm:w-4 ppm:h-4 ppm:mr-2" />
                        {loading ? 'Saindo...' : 'Sair'}
                    </Button>
                </div>
            </CardContent>
        </>
    );
} 