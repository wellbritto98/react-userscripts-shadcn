import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, UserCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { userRepository } from "@/lib/repositories";
import { User as UserModel } from "@/lib/firestore-models";
import { useAppBar } from "../ui/AppBarContext";

export function FollowersScreen() {
  const { setAppBarContent } = useAppBar();

  const { user: authUser } = useAuth();
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  const [followers, setFollowers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<
    Record<string, boolean>
  >({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Determinar se é o perfil do usuário logado ou de outro usuário
  const isOwnProfile =
    !username || (userProfile && userProfile.username === username);
  const targetUsername = username || userProfile?.username;

  useEffect(() => {
    const loadFollowers = async () => {
      if (!targetUsername) return;

      setLoading(true);
      try {
        // Buscar o usuário pelo username
        const targetUser = await userRepository.findByUsername(targetUsername);
        if (!targetUser || !targetUser.id) {
          console.error("Usuário não encontrado");
          return;
        }

        // Buscar seguidores
        const followersList = await userRepository.getFollowers(
          targetUser.id,
          50
        );
        // Corrigir: converter UserProfile[] para UserModel[] (adicionando campo email vazio se necessário)
        const followersWithEmail: UserModel[] = followersList.map(
          (follower) => ({
            ...follower,
            email: (follower as any).email ?? "",
          })
        );
        setFollowers(followersWithEmail);

        // Verificar se o usuário logado segue cada seguidor
        if (authUser) {
          const followingMap: Record<string, boolean> = {};
          for (const follower of followersList) {
            const isFollowing = await userRepository.isFollowing(
              authUser.uid,
              follower.id!
            );
            followingMap[follower.id!] = isFollowing;
          }
          setFollowingStates(followingMap);
        }
      } catch (error) {
        console.error("Erro ao carregar seguidores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFollowers();
  }, [targetUsername, authUser]);

  useEffect(() => {
    setAppBarContent(
      <div className="ppm:flex ppm:items-center ppm:space-x-4 ">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="ppm:p-2"
        >
          <ArrowLeft className="ppm:w-5 ppm:h-5" />
        </Button>
        <p className="ppm:text-xs ppm:text-gray-600">
          {targetUsername ? `@${targetUsername}` : ""}
        </p>
      </div>
    );
  }, [setAppBarContent]); // "setAppBarContent" agora é estável
  useEffect(() => {
    return () => setAppBarContent(null);
  }, [setAppBarContent]);

  const handleFollowToggle = async (followerId: string) => {
    if (!authUser || !followerId) return;

    setLoadingStates((prev) => ({ ...prev, [followerId]: true }));

    try {
      if (followingStates[followerId]) {
        // Deixar de seguir
        await userRepository.unfollowUser(authUser.uid, followerId);
        setFollowingStates((prev) => ({ ...prev, [followerId]: false }));
      } else {
        // Seguir
        await userRepository.followUser(authUser.uid, followerId);
        setFollowingStates((prev) => ({ ...prev, [followerId]: true }));
      }
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [followerId]: false }));
    }
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="ppm:p-4 ppm:space-y-4">
      {/* Header */}
      <div>
        <h1 className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
          Seguidores
        </h1>
      </div>

      {/* Lista de Seguidores */}
      {loading ? (
        <div className="ppm:space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="ppm:flex ppm:items-center ppm:gap-4">
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
          {followers.length > 0 ? (
            followers.map((follower) => (
              <Card
                key={follower.id}
                className="ppm:cursor-pointer ppm:hover:bg-gray-50 ppm:transition-colors ppm:p-2"
                onClick={() => handleUserClick(follower.username)}
              >
                <CardContent className="ppm:flex ppm:items-center ppm:px-2 ppm:gap-4">
                  <Avatar className="ppm:w-12 ppm:h-12">
                    <AvatarImage
                      src={follower.avatarUrl || ""}
                      alt={follower.displayName || follower.username}
                    />
                    <AvatarFallback className="ppm:bg-blue-500 ppm:text-white">
                      {getInitials(follower.displayName || follower.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="ppm:flex-1 ppm:min-w-0">
                    <div className="ppm:font-semibold ppm:text-sm ppm:text-gray-900 ppm:truncate">
                      {follower.displayName}
                    </div>
                    <div className="ppm:text-gray-500 ppm:text-xs ppm:truncate">
                      @{follower.username}
                    </div>
                  </div>

                  {/* Botão de Seguir/Deixar de Seguir */}
                  {authUser && follower.id !== authUser.uid && (
                    <Button
                      size="sm"
                      variant={
                        followingStates[follower.id!] ? "outline" : "default"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(follower.id!);
                      }}
                      disabled={loadingStates[follower.id!]}
                      className="ppm:flex ppm:items-center ppm:space-x-2"
                    >
                      {loadingStates[follower.id!] ? (
                        <div className="ppm:w-4 ppm:h-4 ppm:border-2 ppm:border-current ppm:border-t-transparent ppm:rounded-full ppm:animate-spin" />
                      ) : followingStates[follower.id!] ? (
                        <>
                          <UserCheck className="ppm:w-4 ppm:h-4" />
                        </>
                      ) : (
                        <>
                          <UserPlus className="ppm:w-4 ppm:h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="ppm:text-center ppm:text-gray-500 ppm:py-8">
              <p className="ppm:text-xs">Nenhum seguidor ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
