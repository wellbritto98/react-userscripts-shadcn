export { GenericRepository } from './GenericRepository';
export { UserRepository } from './UserRepository';
export { PostRepository } from './PostRepository';
export { CommentRepository } from './CommentRepository';
export { LikeRepository } from './LikeRepository';
export { ActivityRepository } from './ActivityRepository';

// Instâncias singleton dos repositórios
import { UserRepository } from './UserRepository';
import { PostRepository } from './PostRepository';
import { CommentRepository } from './CommentRepository';
import { LikeRepository } from './LikeRepository';
import { ActivityRepository } from './ActivityRepository';

export const userRepository = new UserRepository();
export const postRepository = new PostRepository();
export const commentRepository = new CommentRepository();
export const likeRepository = new LikeRepository();
export const activityRepository = new ActivityRepository(); 