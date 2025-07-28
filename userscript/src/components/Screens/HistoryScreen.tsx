import React, { useEffect } from "react";
import { useAppBar } from "@/components/ui/AppBarContext";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityWithActor } from "@/lib/firestore-models";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  ChatCircle, 
  UserPlus, 
  At, 
  Heart as HeartIcon,
  Clock,
  Check
} from "phosphor-react";
import { useActivities } from "@/hooks/useActivities";

export function HistoryScreen() {
  const { setAppBarContent } = useAppBar();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { activities, loading, unreadCount, markAsRead, markAllAsRead } = useActivities({ limit: 50 });

  console.log('📱 HistoryScreen - renderizando com:', {
    activitiesCount: activities.length,
    loading,
    unreadCount,
    authUser: authUser?.uid
  });

  // Configurar AppBar
  useEffect(() => {
    setAppBarContent(
      <div className="ppm:flex ppm:items-center ppm:justify-between ppm:w-full">
        <h1 className="ppm:text-lg ppm:font-semibold">Atividades</h1>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ppm:text-xs">
            {unreadCount}
          </Badge>
        )}
      </div>
    );
  }, [setAppBarContent, unreadCount]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | any) => {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (date && typeof date.toDate === "function") {
      dateObj = date.toDate();
    } else if (date && typeof date.seconds === "number") {
      dateObj = new Date(date.seconds * 1000);
    } else if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date);
    } else {
      return "Data desconhecida";
    }

    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Agora mesmo";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.floor(days / 7)}s`;
    if (days < 365) return `${Math.floor(days / 30)}m`;
    return `${Math.floor(days / 365)}a`;
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'like':
        return <Heart className="ppm:w-4 ppm:h-4 ppm:text-red-500" weight="fill" />;
      case 'comment':
        return <ChatCircle className="ppm:w-4 ppm:h-4 ppm:text-blue-500" />;
      case 'follow':
        return <UserPlus className="ppm:w-4 ppm:h-4 ppm:text-green-500" />;
      case 'mention':
        return <At className="ppm:w-4 ppm:h-4 ppm:text-purple-500" />;
      case 'like_comment':
        return <HeartIcon className="ppm:w-4 ppm:h-4 ppm:text-red-500" weight="fill" />;
      default:
        return <Clock className="ppm:w-4 ppm:h-4 ppm:text-gray-500" />;
    }
  };

  const getActionText = (activity: ActivityWithActor) => {
    const actorName = activity.actor?.displayName || activity.actor?.username || 'Alguém';
    
    switch (activity.actionType) {
      case 'like':
        return `${actorName} curtiu sua publicação`;
      case 'comment':
        return `${actorName} comentou: "${activity.text}"`;
      case 'follow':
        return `${actorName} começou a seguir você`;
      case 'mention':
        return `${actorName} marcou você em uma publicação`;
      case 'like_comment':
        return `${actorName} curtiu seu comentário`;
      default:
        return `${actorName} interagiu com você`;
    }
  };

  const handleActivityClick = (activity: ActivityWithActor) => {
    // Marcar como lida
    if (!activity.isRead) {
      markAsRead([activity.id!]);
    }

    // Navegar para o conteúdo relacionado
    if (activity.targetType === 'post' && activity.targetId) {
      navigate(`/post/${activity.targetId}`);
    } else if (activity.actor) {
      navigate(`/profile/${activity.actor.username}`);
    }
  };

  if (!authUser) {
    return (
      <div className="ppm:flex ppm:items-center ppm:justify-center ppm:h-full">
        <div className="ppm:text-center ppm:space-y-4">
          <Clock className="ppm:w-16 ppm:h-16 ppm:text-gray-400 ppm:mx-auto" />
          <h2 className="ppm:text-xl ppm:font-semibold ppm:text-gray-900">
            Faça login para ver atividades
          </h2>
          <p className="ppm:text-gray-600">
            Entre na sua conta para ver suas notificações.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ppm:space-y-4 ppm:p-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="ppm:animate-pulse">
            <CardContent className="ppm:p-4">
              <div className="ppm:flex ppm:items-center ppm:gap-3">
                <div className="ppm:w-10 ppm:h-10 ppm:bg-gray-200 ppm:rounded-full" />
                <div className="ppm:flex-1 ppm:space-y-2">
                  <div className="ppm:h-4 ppm:bg-gray-200 ppm:rounded ppm:w-3/4" />
                  <div className="ppm:h-3 ppm:bg-gray-200 ppm:rounded ppm:w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="ppm:space-y-2 ppm:p-2">
      {/* Botão para marcar todas como lidas */}
      {unreadCount > 0 && (
        <div className="ppm:flex ppm:justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            className="ppm:text-xs ppm:h-7 ppm:px-2"
          >
            <Check className="ppm:w-3 ppm:h-3 ppm:mr-1" />
            Marcar todas como lidas
          </Button>
        </div>
      )}

      {/* Lista de atividades */}
      {activities.length > 0 ? (
        <div className="ppm:space-y-1">
          {activities.map((activity: ActivityWithActor) => (
            <Card 
              key={activity.id} 
              className={`ppm:py-2 ppm:cursor-pointer ppm:transition-colors ${
                !activity.isRead ? 'ppm:bg-blue-50 ppm:border-blue-200' : ''
              }`}
              onClick={() => handleActivityClick(activity)}
            >
              <CardContent className="ppm:p-3">
                <div className="ppm:flex ppm:items-start ppm:gap-2">
                  {/* Avatar do ator */}
                  <Avatar className="ppm:w-8 ppm:h-8 ppm:flex-shrink-0">
                    <AvatarImage 
                      src={activity.actor?.avatarUrl} 
                      alt={activity.actor?.displayName || ''} 
                    />
                    <AvatarFallback className="ppm:text-xs">
                      {getInitials(activity.actor?.displayName || '')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Conteúdo da atividade */}
                  <div className="ppm:flex-1 ppm:min-w-0">
                    <div className="ppm:flex ppm:items-center ppm:gap-1 ppm:mb-1">
                      {getActionIcon(activity.actionType)}
                      <span className="ppm:text-sm ppm:text-gray-900">
                        {getActionText(activity)}
                      </span>
                    </div>
                    
                    <div className="ppm:flex ppm:items-center ppm:justify-between">
                      <span className="ppm:text-xs ppm:text-gray-500">
                        {formatDate(activity.createdAt)}
                      </span>
                      
                      {!activity.isRead && (
                        <div className="ppm:w-2 ppm:h-2 ppm:bg-blue-500 ppm:rounded-full" />
                      )}
                    </div>

                    {/* Preview do target se disponível */}
                    {activity.target && (
                      <div className="ppm:mt-1 ppm:p-1 ppm:bg-gray-50 ppm:rounded ppm:border">
                        {activity.target.type === 'post' && activity.target.preview && (
                          <img 
                            src={activity.target.preview} 
                            alt="Post" 
                            className="ppm:w-12 ppm:h-12 ppm:object-cover ppm:rounded"
                          />
                        )}
                        {activity.target.type === 'comment' && activity.target.preview && (
                          <p className="ppm:text-xs ppm:text-gray-600 ppm:line-clamp-2">
                            "{activity.target.preview}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="ppm:flex ppm:items-center ppm:justify-center ppm:h-full">
          <div className="ppm:text-center ppm:space-y-4">
            <Clock className="ppm:w-16 ppm:h-16 ppm:text-gray-400 ppm:mx-auto" />
            <h2 className="ppm:text-xl ppm:font-semibold ppm:text-gray-900">
              Nenhuma atividade ainda
            </h2>
            <p className="ppm:text-gray-600">
              Quando pessoas interagirem com você, aparecerá aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 