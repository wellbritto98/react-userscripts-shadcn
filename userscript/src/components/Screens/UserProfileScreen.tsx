
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileSkeleton } from "@/components/ui/profile-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut, Grid, UserCheck, Edit, Camera, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { userRepository } from "@/lib/repositories";
import { postRepository } from "@/lib/repositories";
import { User as UserModel, Post } from "@/lib/firestore-models";
import { useAppBar } from "@/components/ui/AppBarContext";

export function UserProfileScreen() {
    const { user: authUser, loading: authLoading, logout } = useAuth();
    const { userProfile, loading: profileLoading, updateProfile } = useUserProfile();
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();
    const { setAppBarContent } = useAppBar();

    const [profileUser, setProfileUser] = useState<UserModel | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState<Post[]>([]);
    const [taggedPosts, setTaggedPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingTaggedPosts, setLoadingTaggedPosts] = useState(false);

    // Determinar se é o perfil do usuário logado ou de outro usuário
    const isOwnProfile = !username || (userProfile && userProfile.username === username);

    useEffect(() => {
        const loadProfile = async () => {
            if (isOwnProfile) {
                setProfileUser(userProfile);
                return;
            }

            if (username) {
                setLoadingProfile(true);
                try {
                    const foundUser = await userRepository.findByUsername(username);
                    setProfileUser(foundUser);

                    // Verificar se o usuário logado segue este perfil
                    if (authUser && foundUser && foundUser.id) {
                        const following = await userRepository.isFollowing(authUser.uid, foundUser.id);
                        setIsFollowing(following);
                    }
                } catch (error) {
                    console.error('Erro ao carregar perfil:', error);
                } finally {
                    setLoadingProfile(false);
                }
            }
        };

        loadProfile();
    }, [username, userProfile, authUser, isOwnProfile]);

    // Carregar posts do usuário
    useEffect(() => {
        const loadPosts = async () => {
            if (!profileUser?.id) return;

            setLoadingPosts(true);
            try {
                const userPosts = await postRepository.getPostsByUser(profileUser.id, 50);
                setPosts(userPosts);
            } catch (error) {
                console.error('Erro ao carregar posts:', error);
                setPosts([]);
            } finally {
                setLoadingPosts(false);
            }
        };

        if (activeTab === 'posts') {
            loadPosts();
        }
    }, [profileUser?.id, activeTab]);

    // Carregar posts marcados
    useEffect(() => {
        const loadTaggedPosts = async () => {
            if (!profileUser?.id) return;

            setLoadingTaggedPosts(true);
            try {
                // Usar o método otimizado para buscar posts onde o usuário foi marcado
                const tagged = await postRepository.getPostsByTaggedUser(profileUser.username, 50);
                setTaggedPosts(tagged);
            } catch (error) {
                console.error('Erro ao carregar posts marcados:', error);
                setTaggedPosts([]);
            } finally {
                setLoadingTaggedPosts(false);
            }
        };

        if (activeTab === 'tagged') {
            loadTaggedPosts();
        }
    }, [profileUser?.id, profileUser?.username, activeTab]);

    // Configurar AppBar com o username
    useEffect(() => {
        const user = profileUser || userProfile;
        if (user) {
            setAppBarContent(
                <span className="ppm:text-lg ppm:font-semibold ppm:text-gray-900">
                    {user.username}
                </span>
            );
        }
        return () => setAppBarContent(null);
    }, [profileUser, userProfile, setAppBarContent]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleFollow = async () => {
        if (!authUser || !profileUser || !profileUser.id) return;

        try {
            if (isFollowing) {
                await userRepository.unfollowUser(authUser.uid, profileUser.id);
                setIsFollowing(false);
                // Atualizar contadores após deixar de seguir
                setProfileUser(prev => {
                    const newCount = Math.max(0, (prev?.followersCount || 0) - 1);
                    return prev ? {
                        ...prev,
                        followersCount: newCount
                    } : null;
                });
            } else {
                await userRepository.followUser(authUser.uid, profileUser.id);
                setIsFollowing(true);
                // Atualizar contadores após seguir
                setProfileUser(prev => {
                    const newCount = (prev?.followersCount || 0) + 1;
                    return prev ? {
                        ...prev,
                        followersCount: newCount
                    } : null;
                });
            }
            
            // Recarregar perfil para garantir sincronização
            if (username) {
                const updatedUser = await userRepository.findByUsername(username);
                if (updatedUser) {
                    setProfileUser(updatedUser);
                }
            }
        } catch (error) {
            console.error('Erro ao seguir/deixar de seguir:', error);
        }
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Loading skeleton
    if (authLoading || profileLoading || loadingProfile) {
        return <ProfileSkeleton />;
    }

    if (!profileUser && !isOwnProfile) {
        return (
            <div className="ppm:p-4 ppm:text-center">
                <p className="ppm:text-gray-600">Usuário não encontrado</p>
            </div>
        );
    }

    const user = profileUser || userProfile;
    if (!user) return null;

    return (
        <div className="ppm:p-4 ppm:space-y-6">
            {/* Header do Perfil */}
            <div className="ppm:flex ppm:flex-col ppm:gap-4 ppm:items-start ppm:space-x-8">
                {/* Avatar */}
                <div className="ppm:flex ppm:flex-row ppm:items-start ppm:space-x-8">
                    <Avatar className="ppm:w-16 ppm:h-16">
                        <AvatarImage src={user.avatarUrl || ''} alt={user.displayName || ''} />
                        <AvatarFallback className="ppm:text-2xl ppm:bg-blue-500">
                            {getInitials(user.displayName || '')}
                        </AvatarFallback>
                    </Avatar>

                    {/* Informações do Perfil */}
                    <div className="ppm:flex-1 ppm:space-y-4">
                        {/* Display Name (substituindo o username) */}
                        <div className="ppm:flex ppm:items-center ppm:space-x-4">
                            <h1 className="ppm:text-base ppm:font-semibold ppm:text-gray-900">
                                {user.displayName}
                            </h1>
                        </div>

                        {/* Estatísticas */}
                        <div className="ppm:flex ppm:space-x-6 ppm:text-xs">
                            <div className="ppm:flex ppm:flex-col ppm:items-center ppm:space-x-1">
                                <span className="ppm:font-semibold ppm:text-sm">{user.postsCount || 0}</span>
                                <span className="ppm:text-gray-600 ppm:text-xs">Posts</span>
                            </div>
                            <button 
                                type="button"
                                onClick={() => navigate(`/followers/${user.username}`)}
                                className="ppm:flex ppm:flex-col ppm:items-center ppm:space-x-1 ppm:cursor-pointer ppm:hover:opacity-80"
                            >
                                <span className="ppm:font-semibold ppm:text-sm">{user.followersCount || 0}</span>
                                <span className="ppm:text-gray-600 ppm:text-xs">Seguidores</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate(`/following/${user.username}`)}
                                className="ppm:flex ppm:flex-col ppm:items-center ppm:space-x-1 ppm:cursor-pointer ppm:hover:opacity-80"
                            >
                                <span className="ppm:font-semibold ppm:text-sm">{user.followingCount || 0}</span>
                                <span className="ppm:text-gray-600 ppm:text-xs">Seguindo</span>
                            </button>
                        </div>

                        {/* Botão de Ação */}

                    </div>
                </div>
                <div className="ppm:flex ppm:flex-col ppm:items-start ppm:gap-4 ppm:w-full">
                    {/* Bio */}
                    <div className="ppm:space-y-1 ppm:w-full">
                        {user.bio && (
                            <p className="ppm:text-gray-600 ppm:text-xs">{user.bio}</p>
                        )}
                    </div>

                    {isOwnProfile ? (
                        <div className="ppm:flex ppm:flex-row ppm:gap-2 ppm:w-full">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEditProfile}
                                className="ppm:flex ppm:items-center ppm:space-x-2"
                            >
                                <Edit className="ppm:w-4 ppm:h-4" />
                                <span className="ppm:text-xs">Editar Perfil</span>
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="ppm:bg-red-50 ppm:text-red-600 ppm:border-red-200 ppm:hover:bg-red-100 ppm:space-x-2"
                                disabled={authLoading}
                            >
                                <LogOut className="ppm:w-4 ppm:h-4" />
                                <span className="ppm:text-xs">{authLoading ? 'Saindo...' : 'Sair da Conta'}</span>
                            </Button>
                        </div>

                    ) : (
                        <Button
                            variant={isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={handleFollow}
                            className="ppm:flex ppm:items-center ppm:space-x-2 ppm:w-full"
                        >
                            <UserCheck className="ppm:w-4 ppm:h-4" />
                            <span className="ppm:text-xs">{isFollowing ? 'Seguindo' : 'Seguir'}</span>
                        </Button>
                    )}
                </div>


            </div>

            <Separator />

            {/* Tabs de Navegação usando Shadcn UI */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="ppm:w-full">
                <TabsList className="ppm:grid ppm:w-full ppm:grid-cols-2 ppm:bg-transparent ppm:border-b ppm:border-gray-200">
                    <TabsTrigger
                        value="posts"
                        className="ppm:flex ppm:items-center ppm:space-x-2 ppm:data-[state=active]:border-b-2 ppm:data-[state=active]:border-blue-500 ppm:data-[state=active]:text-blue-600 ppm:rounded-none ppm:bg-transparent ppm:shadow-none"
                    >
                        <Grid className="ppm:w-4 ppm:h-4" />
                        <span className="ppm:text-xs ppm:font-medium">Posts</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="tagged"
                        className="ppm:flex ppm:items-center ppm:space-x-2 ppm:data-[state=active]:border-b-2 ppm:data-[state=active]:border-blue-500 ppm:data-[state=active]:text-blue-600 ppm:rounded-none ppm:bg-transparent ppm:shadow-none"
                    >
                        <UserCheck className="ppm:w-4 ppm:h-4" />
                        <span className="ppm:text-xs ppm:font-medium">Marcado</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="ppm:mt-6">
                    {loadingPosts ? (
                        <div className="ppm:grid ppm:grid-cols-3 ppm:gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="ppm:aspect-square ppm:bg-gray-200 ppm:rounded ppm:animate-pulse" />
                            ))}
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="ppm:grid ppm:grid-cols-3 ppm:gap-4">
                            {posts.map((post) => (
                                <div 
                                    key={post.id} 
                                    className="ppm:aspect-square ppm:bg-gray-100 ppm:rounded ppm:overflow-hidden ppm:relative ppm:group ppm:cursor-pointer"
                                    onClick={() => navigate(`/post/${post.id}`)}
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt="Post"
                                        className="ppm:w-full ppm:h-full ppm:object-cover ppm:group-hover:scale-105 ppm:transition-transform"
                                    />
                                    {/* Overlay com informações do post */}
                                    <div className="ppm:absolute ppm:inset-0 ppm:bg-black/0 ppm:group-hover:bg-black/20 ppm:transition-colors ppm:flex ppm:items-center ppm:justify-center">
                                        <div className="ppm:opacity-0 ppm:group-hover:opacity-100 ppm:transition-opacity ppm:flex ppm:items-center ppm:gap-4 ppm:text-white">
                                            <div className="ppm:flex ppm:items-center ppm:gap-1">
                                                <Heart className="ppm:w-4 ppm:h-4" />
                                                <span className="ppm:text-sm">{post.likeCount}</span>
                                            </div>
                                            <div className="ppm:flex ppm:items-center ppm:gap-1">
                                                <MessageCircle className="ppm:w-4 ppm:h-4" />
                                                <span className="ppm:text-sm">{post.commentCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ppm:col-span-3 ppm:flex ppm:flex-col ppm:items-center ppm:justify-center ppm:py-12 ppm:space-y-4">
                            <div className="ppm:w-16 ppm:h-16 ppm:border-2 ppm:border-gray-300 ppm:border-dashed ppm:rounded-full ppm:flex ppm:items-center ppm:justify-center">
                                <Camera className="ppm:w-8 ppm:h-8 ppm:text-gray-400" />
                            </div>
                            <div className="ppm:text-center">
                                <h3 className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
                                    Nenhum Post Ainda
                                </h3>
                                <p className="ppm:text-gray-600 ppm:text-xs">
                                    Quando você compartilhar fotos e vídeos, eles aparecerão aqui.
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="tagged" className="ppm:mt-6">
                    {loadingTaggedPosts ? (
                        <div className="ppm:grid ppm:grid-cols-3 ppm:gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="ppm:aspect-square ppm:bg-gray-200 ppm:rounded ppm:animate-pulse" />
                            ))}
                        </div>
                    ) : taggedPosts.length > 0 ? (
                        <div className="ppm:grid ppm:grid-cols-3 ppm:gap-4">
                            {taggedPosts.map((post) => (
                                <div 
                                    key={post.id} 
                                    className="ppm:aspect-square ppm:bg-gray-100 ppm:rounded ppm:overflow-hidden ppm:relative ppm:group ppm:cursor-pointer"
                                    onClick={() => navigate(`/post/${post.id}`)}
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt="Post marcado"
                                        className="ppm:w-full ppm:h-full ppm:object-cover ppm:group-hover:scale-105 ppm:transition-transform"
                                    />
                                    {/* Overlay com informações do post */}
                                    <div className="ppm:absolute ppm:inset-0 ppm:bg-black/0 ppm:group-hover:bg-black/20 ppm:transition-colors ppm:flex ppm:items-center ppm:justify-center">
                                        <div className="ppm:opacity-0 ppm:group-hover:opacity-100 ppm:transition-opacity ppm:flex ppm:items-center ppm:gap-4 ppm:text-white">
                                            <div className="ppm:flex ppm:items-center ppm:gap-1">
                                                <Heart className="ppm:w-4 ppm:h-4" />
                                                <span className="ppm:text-sm">{post.likeCount}</span>
                                            </div>
                                            <div className="ppm:flex ppm:items-center ppm:gap-1">
                                                <MessageCircle className="ppm:w-4 ppm:h-4" />
                                                <span className="ppm:text-sm">{post.commentCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ppm:flex ppm:flex-col ppm:items-center ppm:justify-center ppm:py-12 ppm:space-y-4">
                            <div className="ppm:w-16 ppm:h-16 ppm:border-2 ppm:border-gray-300 ppm:border-dashed ppm:rounded-full ppm:flex ppm:items-center ppm:justify-center">
                                <UserCheck className="ppm:w-8 ppm:h-8 ppm:text-gray-400" />
                            </div>
                            <div className="ppm:text-center">
                                <h3 className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
                                    Nenhuma Foto Marcada
                                </h3>
                                <p className="ppm:text-gray-600 ppm:text-xs">
                                    Fotos em que você foi marcado aparecerão aqui.
                                </p>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
} 