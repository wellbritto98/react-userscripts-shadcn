import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
    email: string;
    password: string;
    isRegistering: boolean;
    loading: boolean;
    error: string | null;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onToggleMode: () => void;
    onClearError: () => void;
}

/**
 * Componente responsável pelo formulário de autenticação (login/registro)
 */
export function AuthForm({
    email,
    password,
    isRegistering,
    loading,
    error,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    onToggleMode,
    onClearError
}: AuthFormProps) {
    return (
        <div className="ppm:flex-1 ppm:flex ppm:items-center ppm:justify-center ppm:p-6">
            <Card className="ppm:w-full ppm:max-w-sm ppm:shadow-lg">
                <CardHeader className="ppm:text-center">
                    <CardTitle className="ppm:text-2xl ppm:font-bold ppm:text-gray-800">
                        {isRegistering ? "Criar Conta" : "Entrar"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="ppm:space-y-4">
                        <div className="ppm:space-y-2">
                            <Label htmlFor="email" className="ppm:text-sm ppm:font-medium ppm:text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => {
                                    onEmailChange(e.target.value);
                                    if (error) onClearError();
                                }}
                                className="ppm:w-full"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="ppm:space-y-2">
                            <Label htmlFor="password" className="ppm:text-sm ppm:font-medium ppm:text-gray-700">
                                Senha
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={(e) => {
                                    onPasswordChange(e.target.value);
                                    if (error) onClearError();
                                }}
                                className="ppm:w-full"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        {error && (
                            <div className="ppm:text-red-500 ppm:text-sm ppm:text-center ppm:bg-red-50 ppm:p-2 ppm:rounded">
                                {error}
                            </div>
                        )}
                        
                        <Button 
                            type="submit" 
                            className="ppm:w-full ppm:bg-blue-600 ppm:hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Carregando..." : (isRegistering ? "Criar Conta" : "Entrar")}
                        </Button>
                        
                        <div className="ppm:text-center">
                            <button
                                type="button"
                                onClick={onToggleMode}
                                className="ppm:text-blue-600 ppm:hover:text-blue-800 ppm:text-sm ppm:underline"
                                disabled={loading}
                            >
                                {isRegistering 
                                    ? "Já tem uma conta? Faça login" 
                                    : "Não tem uma conta? Registre-se"
                                }
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}