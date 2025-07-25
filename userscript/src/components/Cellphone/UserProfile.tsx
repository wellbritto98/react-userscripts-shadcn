import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface UserProfileProps {
    user: FirebaseUser;
    onLogout: () => void;
}

/**
 * Componente responsável por exibir o perfil do usuário autenticado
 * @param user - Dados do usuário autenticado
 * @param onLogout - Função para realizar logout
 */
export function UserProfile({ user, onLogout }: UserProfileProps) {
    return (
        <div className="ppm:flex-1 ppm:flex ppm:items-center ppm:justify-center ppm:p-6">
            <Card className="ppm:w-full ppm:max-w-sm ppm:shadow-lg">
                <CardHeader className="ppm:text-center">
                    <div className="ppm:flex ppm:justify-center ppm:mb-4">
                        <div className="ppm:w-20 ppm:h-20 ppm:bg-blue-100 ppm:rounded-full ppm:flex ppm:items-center ppm:justify-center">
                            <User className="ppm:w-10 ppm:h-10 ppm:text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="ppm:text-xl ppm:font-bold ppm:text-gray-800">
                        Bem-vindo!
                    </CardTitle>
                </CardHeader>
                <CardContent className="ppm:space-y-4">
                    <div className="ppm:text-center ppm:space-y-2">
                        <div className="ppm:text-sm ppm:text-gray-600">
                            Email:
                        </div>
                        <div className="ppm:font-medium ppm:text-gray-800 ppm:break-all">
                            {user.email}
                        </div>
                    </div>
                    
                    <div className="ppm:text-center ppm:space-y-2">
                        <div className="ppm:text-sm ppm:text-gray-600">
                            UID:
                        </div>
                        <div className="ppm:font-mono ppm:text-xs ppm:text-gray-500 ppm:break-all ppm:bg-gray-50 ppm:p-2 ppm:rounded">
                            {user.uid}
                        </div>
                    </div>
                    
                    <Button 
                        onClick={onLogout}
                        variant="outline"
                        className="ppm:w-full ppm:border-red-200 ppm:text-red-600 ppm:hover:bg-red-50 ppm:hover:border-red-300"
                    >
                        <LogOut className="ppm:w-4 ppm:h-4 ppm:mr-2" />
                        Sair
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}