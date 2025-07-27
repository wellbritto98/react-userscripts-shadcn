import { useState, useEffect, useCallback } from 'react';
import { postRepository } from '@/lib/repositories';
import { PostWithUser } from '@/lib/firestore-models';
import { useAuth } from '@/hooks/useAuth';
import { userRepository } from '@/lib/repositories';

interface UseInfinitePostsOptions {
  type: 'feed' | 'user' | 'public';
  userId?: string;
  limit?: number;
}

export function useInfinitePosts({ type, userId, limit = 10 }: UseInfinitePostsOptions) {
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);

  // Carregar posts iniciais
  const loadInitialPosts = useCallback(async () => {
    if (!authUser && type === 'feed') return;

    setLoading(true);
    setError(null);

    try {
      let initialPosts: PostWithUser[] = [];

      switch (type) {
        case 'feed':
          if (authUser) {
            // Buscar usuários que o usuário segue
            const following = await userRepository.getFollowing(authUser.uid, 100);
            const followingIds = following.map(user => user.id).filter((id): id is string => id !== undefined);
            
            // Incluir o próprio usuário na lista
            const allUserIds = [authUser.uid, ...followingIds];
            
            console.log('Feed - Usuário atual:', authUser.uid);
            console.log('Feed - Seguindo:', followingIds);
            console.log('Feed - Todos os IDs:', allUserIds);
            
            if (allUserIds.length > 0) {
              initialPosts = await postRepository.getFeedPosts(authUser.uid, allUserIds, limit);
              console.log('Feed - Posts encontrados:', initialPosts.length);
            }
          }
          break;

        case 'user':
          if (userId) {
            const userPosts = await postRepository.getPostsByUser(userId, limit);
            initialPosts = await postRepository.getPostsWithUser(userPosts);
          }
          break;

        case 'public':
          const publicPosts = await postRepository.getPublicPosts(limit);
          initialPosts = await postRepository.getPostsWithUser(publicPosts);
          break;
      }

      setPosts(initialPosts);
      setHasMore(initialPosts.length === limit);
      
      // Salvar último documento para paginação
      if (initialPosts.length > 0) {
        setLastDoc(initialPosts[initialPosts.length - 1]);
      }

    } catch (err) {
      console.error('Erro ao carregar posts:', err);
      setError('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, [type, userId, limit, authUser]);

  // Carregar mais posts
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);
    setError(null);

    try {
      let morePosts: PostWithUser[] = [];

      switch (type) {
        case 'feed':
          if (authUser) {
            const following = await userRepository.getFollowing(authUser.uid, 100);
            const followingIds = following.map(user => user.id).filter((id): id is string => id !== undefined);
            
            // Incluir o próprio usuário na lista
            const allUserIds = [authUser.uid, ...followingIds];
            
            if (allUserIds.length > 0) {
              morePosts = await postRepository.getFeedPosts(authUser.uid, allUserIds, limit);
            }
          }
          break;

        case 'user':
          if (userId) {
            const userPosts = await postRepository.getPostsByUser(userId, limit);
            morePosts = await postRepository.getPostsWithUser(userPosts);
          }
          break;

        case 'public':
          const publicPosts = await postRepository.getPublicPosts(limit);
          morePosts = await postRepository.getPostsWithUser(publicPosts);
          break;
      }

      // Filtrar posts que já existem (evitar duplicatas)
      const newPosts = morePosts.filter(newPost => 
        !posts.some(existingPost => existingPost.id === newPost.id)
      );

      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setLastDoc(newPosts[newPosts.length - 1]);
        setHasMore(newPosts.length === limit);
      } else {
        setHasMore(false);
      }

    } catch (err) {
      console.error('Erro ao carregar mais posts:', err);
      setError('Erro ao carregar mais posts');
    } finally {
      setLoadingMore(false);
    }
  }, [type, userId, limit, hasMore, loadingMore, lastDoc, posts, authUser]);

  // Atualizar post específico (para likes, comentários, etc.)
  const updatePost = useCallback((postId: string, updates: Partial<PostWithUser>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  }, []);

  // Remover post
  const removePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  // Recarregar posts
  const refresh = useCallback(() => {
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    loadInitialPosts();
  }, [loadInitialPosts]);

  // Carregar posts iniciais quando as dependências mudam
  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return {
    posts,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMorePosts,
    updatePost,
    removePost,
    refresh
  };
} 