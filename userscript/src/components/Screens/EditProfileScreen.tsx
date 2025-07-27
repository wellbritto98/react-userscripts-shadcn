import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { userRepository } from "@/lib/repositories";
import { useAppBar } from "../ui/AppBarContext";

export function EditProfileScreen() {
    const { setAppBarContent } = useAppBar();
    const { userProfile, loading: profileLoading, updateProfile } = useUserProfile();
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Carregar dados atuais do usuário
    useEffect(() => {
        if (userProfile) {
            setUsername(userProfile.username || "");
            setDisplayName(userProfile.displayName || "");
            setBio(userProfile.bio || "");
            setAvatarUrl(userProfile.avatarUrl || "");
        }
    }, [userProfile]);

    // AppBar customizado
    useEffect(() => {
        setAppBarContent(
            <div className="ppm:flex ppm:items-center ppm:space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/profile")}
                    className="ppm:p-2"
                >
                    <ArrowLeft className="ppm:w-5 ppm:h-5" />
                </Button>
                <span className="ppm:text-lg ppm:font-bold ppm:text-gray-900">Editar Perfil</span>
            </div>
        );
        return () => setAppBarContent(null);
    }, [setAppBarContent, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            // Validações básicas
            if (!username.trim()) {
                setError('Nome de usuário é obrigatório');
                return;
            }
            
            if (!displayName.trim()) {
                setError('Nome completo é obrigatório');
                return;
            }
            
            // Verificar se o username mudou e se já existe
            if (username !== userProfile?.username) {
                const existingUser = await userRepository.findByUsername(username);
                if (existingUser && existingUser.id !== userProfile?.id) {
                    setError('Este nome de usuário já está em uso');
                    return;
                }
            }
            
            // Atualizar perfil
            await updateProfile({
                username: username.trim(),
                displayName: displayName.trim(),
                bio: bio.trim(),
                avatarUrl: avatarUrl.trim()
            });
            
            // Navegar de volta para o perfil
            navigate("/profile");
            
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setError('Erro ao atualizar perfil. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    if (profileLoading) {
        return (
            <div className="ppm:p-4 ppm:text-center">
                <p className="ppm:text-gray-600">Carregando...</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="ppm:p-4 ppm:text-center">
                <p className="ppm:text-gray-600">Usuário não encontrado</p>
            </div>
        );
    }

    return (
        <>
            <CardHeader className="ppm:text-center ppm:pb-6">
                {/* AppBar agora cuida do header */}
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
                    <div className="ppm:flex ppm:space-x-3 ppm:mt-6">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="ppm:flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            className="ppm:flex-1"
                            variant="default"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </>
    );
} 