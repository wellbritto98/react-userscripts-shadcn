import { GenericRepository } from './GenericRepository';
import { Post, PostWithUser } from '../firestore-models';
import { UserRepository } from './UserRepository';
import { ActivityEvents } from '../events/ActivityEvents';

export class PostRepository extends GenericRepository<Post> {
  private userRepository: UserRepository;

  constructor() {
    super('posts');
    this.userRepository = new UserRepository();
  }

  // Buscar posts de um usuário específico
  async getPostsByUser(userId: string, limitCount: number = 20): Promise<Post[]> {
    return this.find({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Buscar posts públicos (feed geral)
  async getPublicPosts(limitCount: number = 20): Promise<Post[]> {
    return this.find({
      where: [{ field: 'isPublic', operator: '==', value: true }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Buscar posts onde um usuário foi marcado
  async getPostsByTaggedUser(username: string, limitCount: number = 20): Promise<Post[]> {
    return this.find({
      where: [
        { field: 'tags', operator: 'array-contains', value: username },
        { field: 'isPublic', operator: '==', value: true }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Buscar posts de usuários que o usuário segue (feed personalizado)
  async getFeedPosts(userId: string, followingIds: string[], limitCount: number = 20): Promise<PostWithUser[]> {
    if (followingIds.length === 0) {
      return [];
    }

    const posts = await this.find({
      where: [
        { field: 'userId', operator: 'in', value: followingIds },
        { field: 'isPublic', operator: '==', value: true }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    // Enriquecer posts com dados do usuário
    const postsWithUser: PostWithUser[] = [];
    for (const post of posts) {
      const user = await this.userRepository.getById(post.userId);
      if (user) {
        postsWithUser.push({
          ...post,
          user: {
            id: user.id!,
            username: user.username,
            avatarUrl: user.avatarUrl,
            displayName: user.displayName
          }
        });
      }
    }

    return postsWithUser;
  }

  // Buscar posts por tags
  async getPostsByTags(tags: string[], limitCount: number = 20): Promise<Post[]> {
    return this.find({
      where: [
        { field: 'tags', operator: 'array-contains-any', value: tags },
        { field: 'isPublic', operator: '==', value: true }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Buscar posts populares (mais curtidos)
  async getPopularPosts(limitCount: number = 20): Promise<Post[]> {
    return this.find({
      where: [{ field: 'isPublic', operator: '==', value: true }],
      orderBy: [{ field: 'likeCount', direction: 'desc' }],
      limit: limitCount
    });
  }

  // Criar post e atualizar contador do usuário
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'>): Promise<string> {
    const postId = await this.create({
      ...postData,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Atualizar contador de posts do usuário
    await this.userRepository.updatePostsCount(postData.userId, 1);

    // Criar atividades de menção se houver tags
    if (postData.tags && postData.tags.length > 0) {
      await ActivityEvents.onPostMentioned(postId, postData.userId, postData.tags);
    }

    return postId;
  }

  // Deletar post e atualizar contador do usuário
  async deletePost(postId: string): Promise<void> {
    const post = await this.getById(postId);
    if (post) {
      await this.delete(postId);
      // Atualizar contador de posts do usuário
      await this.userRepository.updatePostsCount(post.userId, -1);
    }
  }

  // Atualizar contador de curtidas
  async updateLikeCount(postId: string, increment: number): Promise<void> {
    const post = await this.getById(postId);
    if (post) {
      const newCount = Math.max(0, post.likeCount + increment);
      await this.update(postId, { likeCount: newCount });
    }
  }

  // Atualizar contador de comentários
  async updateCommentCount(postId: string, increment: number): Promise<void> {
    const post = await this.getById(postId);
    if (post) {
      const newCount = Math.max(0, post.commentCount + increment);
      await this.update(postId, { commentCount: newCount });
    }
  }

  // Buscar posts com dados do usuário
  async getPostsWithUser(posts: Post[]): Promise<PostWithUser[]> {
    const postsWithUser: PostWithUser[] = [];
    
    for (const post of posts) {
      const user = await this.userRepository.getById(post.userId);
      if (user) {
        postsWithUser.push({
          ...post,
          user: {
            id: user.id!,
            username: user.username,
            avatarUrl: user.avatarUrl,
            displayName: user.displayName
          }
        });
      }
    }

    return postsWithUser;
  }
} 