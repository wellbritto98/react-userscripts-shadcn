export interface Post {
  id?: string;
  userId: string;
  imageUrl: string;
  caption?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  commentCount: number;
  isPublic: boolean;
  tags?: string[];
}

export interface PostWithUser extends Post {
  user?: {
    id: string;
    username: string;
    avatarUrl?: string;
    displayName?: string;
  };
}

export interface PostStats {
  likeCount: number;
  commentCount: number;
} 