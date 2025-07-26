import { GenericRepository } from './GenericRepository';
import { Like } from '../firestore-models';
import { PostRepository } from './PostRepository';
import { CommentRepository } from './CommentRepository';

export class LikeRepository extends GenericRepository<Like> {
  private postRepository: PostRepository;
  private commentRepository: CommentRepository;

  constructor() {
    super('likes');
    this.postRepository = new PostRepository();
    this.commentRepository = new CommentRepository();
  }

  // Curtir um post ou comentário
  async like(userId: string, targetId: string, targetType: 'post' | 'comment'): Promise<void> {
    // Verificar se já curtiu
    const existingLike = await this.findOne({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'targetId', operator: '==', value: targetId },
        { field: 'targetType', operator: '==', value: targetType }
      ]
    });

    if (existingLike) {
      return; // Já curtiu
    }

    // Criar curtida
    await this.create({
      userId,
      targetId,
      targetType,
      createdAt: new Date()
    });

    // Atualizar contador
    if (targetType === 'post') {
      await this.postRepository.updateLikeCount(targetId, 1);
    } else {
      await this.commentRepository.updateLikeCount(targetId, 1);
    }
  }

  // Descurtir um post ou comentário
  async unlike(userId: string, targetId: string, targetType: 'post' | 'comment'): Promise<void> {
    // Buscar curtida existente
    const existingLike = await this.findOne({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'targetId', operator: '==', value: targetId },
        { field: 'targetType', operator: '==', value: targetType }
      ]
    });

    if (!existingLike) {
      return; // Não curtiu
    }

    // Remover curtida
    await this.delete(existingLike.id!);

    // Atualizar contador
    if (targetType === 'post') {
      await this.postRepository.updateLikeCount(targetId, -1);
    } else {
      await this.commentRepository.updateLikeCount(targetId, -1);
    }
  }

  // Verificar se um usuário curtiu
  async isLiked(userId: string, targetId: string, targetType: 'post' | 'comment'): Promise<boolean> {
    const like = await this.findOne({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'targetId', operator: '==', value: targetId },
        { field: 'targetType', operator: '==', value: targetType }
      ]
    });

    return !!like;
  }

  // Buscar usuários que curtiram um post
  async getUsersWhoLikedPost(postId: string, limitCount: number = 20): Promise<string[]> {
    const likes = await this.find({
      where: [
        { field: 'targetId', operator: '==', value: postId },
        { field: 'targetType', operator: '==', value: 'post' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    return likes.map(like => like.userId);
  }

  // Buscar usuários que curtiram um comentário
  async getUsersWhoLikedComment(commentId: string, limitCount: number = 20): Promise<string[]> {
    const likes = await this.find({
      where: [
        { field: 'targetId', operator: '==', value: commentId },
        { field: 'targetType', operator: '==', value: 'comment' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    return likes.map(like => like.userId);
  }

  // Buscar curtidas de um usuário
  async getLikesByUser(userId: string, limitCount: number = 20): Promise<Like[]> {
    return this.find({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Buscar posts curtidos por um usuário
  async getPostsLikedByUser(userId: string, limitCount: number = 20): Promise<string[]> {
    const likes = await this.find({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'targetType', operator: '==', value: 'post' }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    return likes.map(like => like.targetId);
  }

  // Contar curtidas de um post ou comentário
  async getLikeCount(targetId: string, targetType: 'post' | 'comment'): Promise<number> {
    const likes = await this.find({
      where: [
        { field: 'targetId', operator: '==', value: targetId },
        { field: 'targetType', operator: '==', value: targetType }
      ]
    });

    return likes.length;
  }
} 