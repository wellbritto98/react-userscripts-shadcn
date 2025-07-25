import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function RegisterScreen() {
    const { register, loading, error, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        await register(email, password);
        if (!error) {
            setEmail("");
            setPassword("");
        }
    };

    return (
        <>
            <CardHeader className="ppm:text-center ppm:pb-6">
                <CardTitle className="ppm:text-2xl ppm:font-bold ppm:text-gray-900">
                    Cadastro
                </CardTitle>
                <p className="ppm:text-gray-600 ppm:text-sm">
                    Crie sua conta
                </p>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="ppm:bg-red-50 ppm:border ppm:border-red-200 ppm:text-red-700 ppm:px-4 ppm:py-3 ppm:rounded ppm:mb-4 ppm:text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="ppm:space-y-4">
                    <div className="ppm:space-y-2">
                        <Label htmlFor="email" className="ppm:text-sm ppm:font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="ppm:w-full"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="ppm:space-y-2">
                        <Label htmlFor="password" className="ppm:text-sm ppm:font-medium">
                            Senha
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="ppm:w-full"
                            disabled={loading}
                            required
                        />
                        <p className="ppm:text-xs ppm:text-gray-500">
                            A senha deve ter pelo menos 6 caracteres
                        </p>
                    </div>
                    <Button 
                        type="submit" 
                        className="ppm:w-full ppm:mt-6"
                        variant="default"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Cadastrar'}
                    </Button>
                </form>
                <div className="ppm:mt-6 ppm:text-center">
                    <button 
                        onClick={() => { clearError(); navigate("/login"); }}
                        className="ppm:text-sm ppm:text-blue-600 ppm:hover:underline ppm:bg-transparent ppm:border-none ppm:cursor-pointer"
                        disabled={loading}
                    >
                        Já tem uma conta? Faça login
                    </button>
                </div>
            </CardContent>
        </>
    );
} 