import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, UserCheck, UserMinus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { userRepository } from "@/lib/repositories";
import { User as UserModel } from "@/lib/firestore-models";

export function FollowingScreen() {
    const { user: authUser } = useAuth();
    const { userProfile } = useUserProfile();
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();

    const [following, setFollowing] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    // Determinar se é o perfil do usuário logado ou de outro usuário
    const isOwnProfile = !username || (userProfile && userProfile.username === username);
    const targetUsername = username || userProfile?.username;

    useEffect(() => {
        const loadFollowing = async () => {
            if (!targetUsername) return;

            setLoading(true);
            try {
                // Buscar o usuário pelo username
                const targetUser = await userRepository.findByUsername(targetUsername);
                if (!targetUser || !targetUser.id) {
                    console.error('Usuário não encontrado');
                    return;
                }

                // Buscar usuários que ele segue
                const followingList = await userRepository.getFollowing(targetUser.id, 50);
                // Corrigir: converter UserProfile[] para UserModel[] (adicionando campo email vazio se necessário)
                const followingWithEmail: UserModel[] = followingList.map(followedUser => ({
                    ...followedUser,
                    email: (followedUser as any).email ?? "",
                }));
                setFollowing(followingWithEmail);
            } catch (error) {
                console.error('Erro ao carregar seguindo:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFollowing();
    }, [targetUsername]);

    const handleUnfollow = async (followingId: string) => {
        if (!authUser || !followingId) return;

        setLoadingStates(prev => ({ ...prev, [followingId]: true }));

        try {
            await userRepository.unfollowUser(authUser.uid, followingId);
            // Remover da lista
            setFollowing(prev => prev.filter(user => user.id !== followingId));
        } catch (error) {
            console.error('Erro ao deixar de seguir:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [followingId]: false }));
        }
    };

    const handleUserClick = (username: string) => {
        navigate(`/profile/${username}`);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="ppm:p-4 ppm:space-y-4">
            {/* Header */}
            <div className="ppm:flex ppm:items-center ppm:space-x-4 ppm:mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="ppm:p-2"
                >
                    <ArrowLeft className="ppm:w-5 ppm:h-5" />
                </Button>
                <div>
                    <h1 className="ppm:text-lg ppm:font-semibold ppm:text-gray-900">
                        Seguindo
                    </h1>
                    <p className="ppm:text-sm ppm:text-gray-600">
                        {targetUsername ? `@${targetUsername}` : ''}
                    </p>
                </div>
            </div>

            {/* Lista de Seguindo */}
            {loading ? (
                <div className="ppm:space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="ppm:flex ppm:items-center ppm:gap-4 ">
                                <Skeleton className="ppm:w-12 ppm:h-12 ppm:rounded-full" />
                                <div className="ppm:flex-1">
                                    <Skeleton className="ppm:w-32 ppm:h-4 ppm:mb-2" />
                                    <Skeleton className="ppm:w-20 ppm:h-3" />
                                </div>
                                <Skeleton className="ppm:w-20 ppm:h-8 ppm:rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="ppm:space-y-2">
                    {following.length > 0 ? (
                        following.map(followedUser => (
                            <Card 
                                key={followedUser.id} 
                                className="ppm:cursor-pointer ppm:hover:bg-gray-50 ppm:transition-colors"
                                onClick={() => handleUserClick(followedUser.username)}
                            >
                                <CardContent className="ppm:flex ppm:items-center ppm:gap-4">
                                    <Avatar className="ppm:w-12 ppm:h-12">
                                        <AvatarImage src={followedUser.avatarUrl || ''} alt={followedUser.displayName || followedUser.username} />
                                        <AvatarFallback className="ppm:bg-blue-500 ppm:text-white">
                                            {getInitials(followedUser.displayName || followedUser.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="ppm:flex-1 ppm:min-w-0">
                                        <div className="ppm:font-semibold ppm:text-gray-900 ppm:truncate">
                                            {followedUser.displayName}
                                        </div>
                                        <div className="ppm:text-gray-500 ppm:text-sm ppm:truncate">
                                            @{followedUser.username}
                                        </div>
                                    </div>

                                    {/* Botão de Deixar de Seguir */}
                                    {isOwnProfile && authUser && followedUser.id !== authUser.uid && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnfollow(followedUser.id!);
                                            }}
                                            disabled={loadingStates[followedUser.id!]}
                                            className="ppm:flex ppm:items-center ppm:space-x-2 ppm:bg-red-50 ppm:text-red-600 ppm:border-red-200 ppm:hover:bg-red-100"
                                        >
                                            {loadingStates[followedUser.id!] ? (
                                                <div className="ppm:w-4 ppm:h-4 ppm:border-2 ppm:border-current ppm:border-t-transparent ppm:rounded-full ppm:animate-spin" />
                                            ) : (
                                                <>
                                                    <UserMinus className="ppm:w-4 ppm:h-4" />
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="ppm:text-center ppm:text-gray-500 ppm:py-8">
                            <p>Não está seguindo ninguém ainda.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 