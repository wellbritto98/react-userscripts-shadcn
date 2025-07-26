import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function RegisterScreen() {
    const { register, loading, error, clearError, setError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        
        // Validações básicas
        if (!username.trim()) {
            setError('Nome de usuário é obrigatório');
            return;
        }
        
        if (!displayName.trim()) {
            setError('Nome completo é obrigatório');
            return;
        }
        
        if (!email.trim()) {
            setError('Email é obrigatório');
            return;
        }
        
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        await register(email, password, {
            username: username.trim(),
            displayName: displayName.trim(),
            bio: bio.trim(),
            avatarUrl: avatarUrl.trim()
        });
        
        if (!error) {
            setEmail("");
            setPassword("");
            setUsername("");
            setDisplayName("");
            setBio("");
            setAvatarUrl("");
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
                        <Label htmlFor="username" className="ppm:text-sm ppm:font-medium">
                            Nome de usuário
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="jose_britto"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="ppm:w-full"
                            disabled={loading}
                            required
                        />
                        <p className="ppm:text-xs ppm:text-gray-500">
                            Nome de usuário único para sua conta
                        </p>
                    </div>
                    <div className="ppm:space-y-2">
                        <Label htmlFor="displayName" className="ppm:text-sm ppm:font-medium">
                            Nome completo
                        </Label>
                        <Input
                            id="displayName"
                            type="text"
                            placeholder="José Britto"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="ppm:w-full"
                            disabled={loading}
                            required
                        />
                    </div>
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
                        <Label htmlFor="bio" className="ppm:text-sm ppm:font-medium">
                            Biografia (opcional)
                        </Label>
                        <Input
                            id="bio"
                            type="text"
                            placeholder="Conte um pouco sobre você..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="ppm:w-full"
                            disabled={loading}
                        />
                    </div>
                    <div className="ppm:space-y-2">
                        <Label htmlFor="avatarUrl" className="ppm:text-sm ppm:font-medium">
                            URL da foto de perfil (opcional)
                        </Label>
                        <Input
                            id="avatarUrl"
                            type="url"
                            placeholder="https://example.com/avatar.jpg"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="ppm:w-full"
                            disabled={loading}
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