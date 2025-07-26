export interface User {
  id?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isPrivate?: boolean;
}

export interface UserProfile extends Omit<User, 'email'> {
  // Para exibição pública, sem email
}

export interface FollowRelationship {
  followerId: string;
  followedId: string;
  followedAt: Date;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  postsCount: number;
} 