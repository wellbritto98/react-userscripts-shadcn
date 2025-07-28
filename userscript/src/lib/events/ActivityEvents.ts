import { activityRepository } from '../repositories';

// Eventos de atividade
export const ActivityEvents = {
  // Like em post
  async onPostLiked(postId: string, actorId: string) {
    try {
      await activityRepository.createPostLikeActivity(postId, actorId);
    } catch (error) {
      console.error('Erro ao criar atividade de like:', error);
    }
  },

  // Comentário em post
  async onPostCommented(postId: string, commentId: string, actorId: string, commentText: string) {
    try {
      await activityRepository.createCommentActivity(postId, commentId, actorId, commentText);
    } catch (error) {
      console.error('Erro ao criar atividade de comentário:', error);
    }
  },

  // Follow
  async onUserFollowed(followedId: string, followerId: string) {
    try {
      await activityRepository.createFollowActivity(followedId, followerId);
    } catch (error) {
      console.error('Erro ao criar atividade de follow:', error);
    }
  },

  // Like em comentário
  async onCommentLiked(commentId: string, actorId: string) {
    try {
      await activityRepository.createCommentLikeActivity(commentId, actorId);
    } catch (error) {
      console.error('Erro ao criar atividade de like em comentário:', error);
    }
  },

  // Menção em post
  async onPostMentioned(postId: string, actorId: string, mentionedUsers: string[]) {
    try {
      await activityRepository.createMentionActivity(postId, actorId, mentionedUsers);
    } catch (error) {
      console.error('Erro ao criar atividade de menção:', error);
    }
  }
}; 