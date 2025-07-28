export interface Activity {
  id?: string;
  userId: string; // Usuário que recebe a notificação
  actorId: string; // Usuário que fez a ação
  targetId?: string; // ID do post/comentário relacionado
  targetType?: 'post' | 'comment' | 'user';
  actionType: 'like' | 'comment' | 'follow' | 'mention' | 'like_comment';
  text?: string; // Para comentários, o texto do comentário
  createdAt: Date;
  isRead: boolean;
}

export interface ActivityWithActor extends Activity {
  actor?: {
    id: string;
    username: string;
    avatarUrl?: string;
    displayName?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    preview?: string; // Para posts: URL da imagem, para comentários: texto
  };
} 