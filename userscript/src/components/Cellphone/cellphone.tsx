import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CellphoneProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Componente que renderiza um mockup de smartphone com formulário de login
 * @param isOpen - Controla se o componente está visível
 * @param onClose - Função chamada para fechar o componente
 */
export function Cellphone({ isOpen, onClose }: CellphoneProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentTime, setCurrentTime] = useState("9:41");
    const [isRegistering, setIsRegistering] = useState(false);
    const { user, loading, error, login, register, logout, clearError } = useAuth();

    /**
     * Função para lidar com o envio do formulário de login/registro
     * @param e - Evento do formulário
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        
        if (isRegistering) {
            await register(email, password);
        } else {
            await login(email, password);
        }
        
        // Limpa os campos após tentativa de autenticação
        if (!error) {
            setEmail("");
            setPassword("");
        }
    };

    /**
     * Função para alternar entre modo login e registro
     */
    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        clearError();
    };

    /**
     * Função para fazer logout
     */
    const handleLogout = async () => {
        await logout();
    };

    /**
     * Hook para monitorar mudanças no elemento de horário da página
     */
    useEffect(() => {
        /**
         * Função para extrair o horário do texto
         * @param text - Texto no formato "Sexta-Feira 03:02"
         * @returns Horário extraído no formato "HH:MM"
         */
        const extractTime = (text: string): string => {
            const timeMatch = text.match(/(\d{1,2}:\d{2})/);
            return timeMatch ? timeMatch[1] : "9:41";
        };

        /**
         * Função para atualizar o horário baseado no conteúdo do elemento
         */
        const updateTimeFromElement = () => {
            const timeElement = document.getElementById("character-tools-location");
            if (timeElement && timeElement.textContent) {
                const extractedTime = extractTime(timeElement.textContent);
                setCurrentTime(extractedTime);
            }
        };

        // Atualiza o horário inicial
        updateTimeFromElement();

        // Configura o MutationObserver para monitorar mudanças
        const timeElement = document.getElementById("character-tools-location");
        if (timeElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList" || mutation.type === "characterData") {
                        updateTimeFromElement();
                    }
                });
            });

            // Observa mudanças no conteúdo do elemento e seus filhos
            observer.observe(timeElement, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // Cleanup: remove o observer quando o componente for desmontado
            return () => {
                observer.disconnect();
            };
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="ppm:fixed ppm:inset-0 ppm:bg-black/50 ppm:flex ppm:items-center ppm:justify-center ppm:z-50">
            {/* Mockup do Smartphone */}
            <div className="ppm:relative ppm:w-[300px] ppm:h-[600px] ppm:bg-gray-900 ppm:rounded-[3rem] ppm:p-2 ppm:shadow-2xl">
                {/* Botão de fechar */}
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="ppm:absolute ppm:-top-2 ppm:-right-2 ppm:bg-white ppm:rounded-full ppm:w-8 ppm:h-8 ppm:p-0 ppm:z-10"
                >
                    <X className="ppm:w-4 ppm:h-4" />
                </Button>

                {/* Tela do smartphone */}
                <div className="ppm:w-full ppm:h-full ppm:bg-white ppm:rounded-[2.5rem] ppm:overflow-hidden ppm:relative">
                    {/* Notch */}
                    <div className="ppm:absolute ppm:top-0 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-6 ppm:bg-black ppm:rounded-b-2xl ppm:z-10"></div>
                    
                    {/* Status bar */}
                    <div className="ppm:h-12 ppm:bg-gray-50 ppm:flex ppm:items-center ppm:justify-between ppm:px-6 ppm:pt-6">
                        <span className="ppm:text-sm ppm:font-medium">{currentTime}</span>
                        <div className="ppm:flex ppm:items-center ppm:gap-1">
                            <div className="ppm:w-4 ppm:h-2 ppm:bg-green-500 ppm:rounded-sm"></div>
                            <div className="ppm:w-6 ppm:h-3 ppm:border ppm:border-gray-400 ppm:rounded-sm ppm:relative">
                                <div className="ppm:w-4 ppm:h-2 ppm:bg-green-500 ppm:rounded-sm ppm:absolute ppm:top-0.5 ppm:left-0.5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo da tela */}
                    <div className="ppm:flex-1 ppm:p-6 ppm:pt-8">
                        <Card className="ppm:w-full ppm:border-0 ppm:shadow-none">
                            {user ? (
                                // Tela do usuário autenticado
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
                            ) : (
                                // Tela de login/registro
                                <>
                                    <CardHeader className="ppm:text-center ppm:pb-6">
                                        <CardTitle className="ppm:text-2xl ppm:font-bold ppm:text-gray-900">
                                            {isRegistering ? 'Cadastro' : 'Login'}
                                        </CardTitle>
                                        <p className="ppm:text-gray-600 ppm:text-sm">
                                            {isRegistering ? 'Crie sua conta' : 'Entre com suas credenciais'}
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
                                                {isRegistering && (
                                                    <p className="ppm:text-xs ppm:text-gray-500">
                                                        A senha deve ter pelo menos 6 caracteres
                                                    </p>
                                                )}
                                            </div>
                                            <Button 
                                                type="submit" 
                                                className="ppm:w-full ppm:mt-6"
                                                variant="default"
                                                disabled={loading}
                                            >
                                                {loading ? 'Carregando...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
                                            </Button>
                                        </form>
                                        
                                        <div className="ppm:mt-6 ppm:text-center">
                                            <button 
                                                onClick={toggleMode}
                                                className="ppm:text-sm ppm:text-blue-600 ppm:hover:underline ppm:bg-transparent ppm:border-none ppm:cursor-pointer"
                                                disabled={loading}
                                            >
                                                {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
                                            </button>
                                        </div>
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    </div>

                    {/* Home indicator */}
                    <div className="ppm:absolute ppm:bottom-2 ppm:left-1/2 ppm:transform ppm:-translate-x-1/2 ppm:w-32 ppm:h-1 ppm:bg-gray-400 ppm:rounded-full"></div>
                </div>
            </div>
        </div>
    );
}