export interface Like {
  id?: string;
  userId: string;
  targetId: string; // ID do post ou comentário
  targetType: 'post' | 'comment';
  createdAt: Date;
}

export interface LikeStats {
  likeCount: number;
  isLikedByCurrentUser: boolean;
} 