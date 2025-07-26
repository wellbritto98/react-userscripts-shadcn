export interface Comment {
  id?: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  parentCommentId?: string; // Para comentários aninhados
}

export interface CommentWithUser extends Comment {
  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
    displayName?: string;
  };
} 