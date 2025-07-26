import { GenericRepository } from './GenericRepository';
import { Comment, CommentWithUser } from '../firestore-models';
import { UserRepository } from './UserRepository';
import { PostRepository } from './PostRepository';

export class CommentRepository extends GenericRepository<Comment> {
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  constructor() {
    super('comments');
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }

  // Buscar comentários de um post
  async getCommentsByPost(postId: string, limitCount: number = 50): Promise<Comment[]> {
    return this.find({
      where: [
        { field: 'postId', operator: '==', value: postId },
        { field: 'parentCommentId', operator: '==', value: null }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Buscar comentários com dados do usuário
  async getCommentsWithUser(comments: Comment[]): Promise<CommentWithUser[]> {
    const commentsWithUser: CommentWithUser[] = [];
    
    for (const comment of comments) {
      const user = await this.userRepository.getById(comment.userId);
      if (user) {
        commentsWithUser.push({
          ...comment,
          user: {
            id: user.id!,
            username: user.username,
            avatarUrl: user.avatarUrl,
            displayName: user.displayName
          }
        });
      }
    }

    return commentsWithUser;
  }

  // Buscar comentários de um post com dados do usuário
  async getCommentsByPostWithUser(postId: string, limitCount: number = 50): Promise<CommentWithUser[]> {
    const comments = await this.getCommentsByPost(postId, limitCount);
    return this.getCommentsWithUser(comments);
  }

  // Buscar respostas a um comentário
  async getRepliesToComment(commentId: string, limitCount: number = 20): Promise<CommentWithUser[]> {
    const replies = await this.find({
      where: [{ field: 'parentCommentId', operator: '==', value: commentId }],
      orderBy: [{ field: 'createdAt', direction: 'asc' }],
      limit: limitCount
    });

    return this.getCommentsWithUser(replies);
  }

  // Criar comentário e atualizar contador do post
  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likeCount'>): Promise<string> {
    const commentId = await this.create({
      ...commentData,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Atualizar contador de comentários do post
    await this.postRepository.updateCommentCount(commentData.postId, 1);

    return commentId;
  }

  // Deletar comentário e atualizar contador do post
  async deleteComment(commentId: string): Promise<void> {
    const comment = await this.getById(commentId);
    if (comment) {
      await this.delete(commentId);
      // Atualizar contador de comentários do post
      await this.postRepository.updateCommentCount(comment.postId, -1);
    }
  }

  // Atualizar contador de curtidas do comentário
  async updateLikeCount(commentId: string, increment: number): Promise<void> {
    const comment = await this.getById(commentId);
    if (comment) {
      const newCount = Math.max(0, comment.likeCount + increment);
      await this.update(commentId, { likeCount: newCount });
    }
  }

  // Buscar comentários de um usuário
  async getCommentsByUser(userId: string, limitCount: number = 20): Promise<CommentWithUser[]> {
    const comments = await this.find({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    return this.getCommentsWithUser(comments);
  }
} 