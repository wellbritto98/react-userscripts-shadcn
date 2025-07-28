import { GenericRepository } from './GenericRepository';
import { Activity, ActivityWithActor } from '../firestore-models';
import { UserRepository } from './UserRepository';
import { PostRepository } from './PostRepository';
import { CommentRepository } from './CommentRepository';

export class ActivityRepository extends GenericRepository<Activity> {
  private userRepository: UserRepository;
  private postRepository: PostRepository;
  private commentRepository: CommentRepository;

  constructor() {
    super('activities');
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
    this.commentRepository = new CommentRepository();
  }

  // Criar uma nova atividade
  async createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'isRead'>): Promise<string> {
    const activity: Omit<Activity, 'id'> = {
      ...activityData,
      createdAt: new Date(),
      isRead: false
    };
    return this.create(activity);
  }

  // Buscar atividades de um usuário
  async getActivitiesByUser(userId: string, limitCount: number = 50): Promise<ActivityWithActor[]> {
    console.log('🔍 ActivityRepository.getActivitiesByUser - userId:', userId, 'limit:', limitCount);
    
    // Debug: ver todas as atividades primeiro
    await this.debugGetAllActivities();
    
    const activities = await this.find({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    console.log('📊 ActivityRepository.getActivitiesByUser - atividades encontradas:', activities.length);
    console.log('📋 ActivityRepository.getActivitiesByUser - atividades:', activities);

    // Converter Timestamps para Date objects
    const activitiesWithConvertedDates = activities.map(activity => ({
      ...activity,
      createdAt: this.convertFirestoreTimestamp(activity.createdAt)
    }));

    console.log('📅 ActivityRepository.getActivitiesByUser - atividades com datas convertidas:', activitiesWithConvertedDates);

    const enrichedActivities = await this.enrichActivitiesWithActor(activitiesWithConvertedDates);
    
    console.log('🎯 ActivityRepository.getActivitiesByUser - atividades enriquecidas:', enrichedActivities.length);
    console.log('✨ ActivityRepository.getActivitiesByUser - atividades enriquecidas:', enrichedActivities);

    return enrichedActivities;
  }

  // Buscar atividades não lidas de um usuário
  async getUnreadActivities(userId: string, limitCount: number = 50): Promise<ActivityWithActor[]> {
    const activities = await this.find({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false }
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
      limit: limitCount
    });

    const activitiesWithConvertedDates = activities.map(activity => ({
      ...activity,
      createdAt: this.convertFirestoreTimestamp(activity.createdAt)
    }));

    return this.enrichActivitiesWithActor(activitiesWithConvertedDates);
  }

  // Marcar atividades como lidas
  async markAsRead(activityIds: string[]): Promise<void> {
    const updates = activityIds.map(id => 
      this.update(id, { isRead: true })
    );
    await Promise.all(updates);
  }

  // Marcar todas as atividades de um usuário como lidas
  async markAllAsRead(userId: string): Promise<void> {
    const unreadActivities = await this.find({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false }
      ]
    });

    const updates = unreadActivities.map(activity => 
      this.update(activity.id!, { isRead: true })
    );
    await Promise.all(updates);
  }

  // Contar atividades não lidas
  async getUnreadCount(userId: string): Promise<number> {
    const unreadActivities = await this.find({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false }
      ]
    });
    return unreadActivities.length;
  }

  // Converter Timestamp do Firestore para Date
  private convertFirestoreTimestamp(timestamp: any): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    } else if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp);
    } else {
      console.warn('⚠️ ActivityRepository.convertFirestoreTimestamp - timestamp inválido:', timestamp);
      return new Date();
    }
  }

  // Método de debug para ver todas as atividades
  async debugGetAllActivities(): Promise<Activity[]> {
    console.log('🔍 ActivityRepository.debugGetAllActivities - buscando todas as atividades...');
    const allActivities = await this.find({});
    console.log('📊 ActivityRepository.debugGetAllActivities - total de atividades na coleção:', allActivities.length);
    console.log('📋 ActivityRepository.debugGetAllActivities - todas as atividades:', allActivities);
    return allActivities;
  }

  // Enriquecer atividades com dados do ator
  private async enrichActivitiesWithActor(activities: Activity[]): Promise<ActivityWithActor[]> {
    console.log('🔄 ActivityRepository.enrichActivitiesWithActor - iniciando enriquecimento de', activities.length, 'atividades');
    
    const activitiesWithActor: ActivityWithActor[] = [];

    for (const activity of activities) {
      console.log('👤 ActivityRepository.enrichActivitiesWithActor - processando atividade:', activity.id, 'actorId:', activity.actorId);
      
      const actor = await this.userRepository.getById(activity.actorId);
      console.log('👤 ActivityRepository.enrichActivitiesWithActor - ator encontrado:', actor ? actor.username : 'NÃO ENCONTRADO');
      
      const enrichedActivity: ActivityWithActor = {
        ...activity,
        actor: actor ? {
          id: actor.id!,
          username: actor.username,
          avatarUrl: actor.avatarUrl,
          displayName: actor.displayName
        } : undefined
      };

      // Enriquecer com dados do target se disponível
      if (activity.targetId && activity.targetType) {
        try {
          if (activity.targetType === 'post') {
            const post = await this.postRepository.getById(activity.targetId);
            if (post) {
              enrichedActivity.target = {
                id: post.id!,
                type: 'post',
                preview: post.imageUrl
              };
              console.log('📷 ActivityRepository.enrichActivitiesWithActor - target post encontrado:', post.id);
            }
          } else if (activity.targetType === 'comment') {
            const comment = await this.commentRepository.getById(activity.targetId);
            if (comment) {
              enrichedActivity.target = {
                id: comment.id!,
                type: 'comment',
                preview: comment.text
              };
              console.log('💬 ActivityRepository.enrichActivitiesWithActor - target comment encontrado:', comment.id);
            }
          }
        } catch (error) {
          console.error('❌ ActivityRepository.enrichActivitiesWithActor - erro ao enriquecer target:', error);
        }
      }

      activitiesWithActor.push(enrichedActivity);
    }

    console.log('✅ ActivityRepository.enrichActivitiesWithActor - enriquecimento concluído, retornando', activitiesWithActor.length, 'atividades');
    return activitiesWithActor;
  }

  // Criar atividade de like em post
  async createPostLikeActivity(postId: string, actorId: string): Promise<void> {
    const post = await this.postRepository.getById(postId);
    if (!post) return;

    await this.createActivity({
      userId: post.userId,
      actorId,
      targetId: postId,
      targetType: 'post',
      actionType: 'like'
    });
  }

  // Criar atividade de comentário
  async createCommentActivity(postId: string, commentId: string, actorId: string, commentText: string): Promise<void> {
    const post = await this.postRepository.getById(postId);
    if (!post) return;

    await this.createActivity({
      userId: post.userId,
      actorId,
      targetId: commentId,
      targetType: 'comment',
      actionType: 'comment',
      text: commentText
    });
  }

  // Criar atividade de follow
  async createFollowActivity(followedId: string, followerId: string): Promise<void> {
    await this.createActivity({
      userId: followedId,
      actorId: followerId,
      targetId: followedId,
      targetType: 'user',
      actionType: 'follow'
    });
  }

  // Criar atividade de like em comentário
  async createCommentLikeActivity(commentId: string, actorId: string): Promise<void> {
    const comment = await this.commentRepository.getById(commentId);
    if (!comment) return;

    await this.createActivity({
      userId: comment.userId,
      actorId,
      targetId: commentId,
      targetType: 'comment',
      actionType: 'like_comment'
    });
  }

  // Criar atividade de menção
  async createMentionActivity(postId: string, actorId: string, mentionedUsers: string[]): Promise<void> {
    const activities = mentionedUsers.map(userId =>
      this.createActivity({
        userId,
        actorId,
        targetId: postId,
        targetType: 'post',
        actionType: 'mention'
      })
    );
    await Promise.all(activities);
  }

  // Deletar atividades relacionadas a um post
  async deleteActivitiesByPost(postId: string): Promise<void> {
    const activities = await this.find({
      where: [
        { field: 'targetId', operator: '==', value: postId },
        { field: 'targetType', operator: '==', value: 'post' }
      ]
    });

    const deletes = activities.map(activity => this.delete(activity.id!));
    await Promise.all(deletes);
  }

  // Deletar atividades relacionadas a um comentário
  async deleteActivitiesByComment(commentId: string): Promise<void> {
    const activities = await this.find({
      where: [
        { field: 'targetId', operator: '==', value: commentId },
        { field: 'targetType', operator: '==', value: 'comment' }
      ]
    });

    const deletes = activities.map(activity => this.delete(activity.id!));
    await Promise.all(deletes);
  }
} 