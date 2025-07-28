import { useState, useEffect, useCallback, useRef } from 'react';
import { activityRepository } from '@/lib/repositories';
import { ActivityWithActor } from '@/lib/firestore-models';
import { useAuth } from '@/hooks/useAuth';

interface UseActivitiesOptions {
  limit?: number;
  autoRefresh?: boolean;
}

export function useActivities({ limit = 50, autoRefresh = false }: UseActivitiesOptions = {}) {
  const { user: authUser } = useAuth();
  const [activities, setActivities] = useState<ActivityWithActor[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadActivities = useCallback(async () => {
    if (!authUser || loadingRef.current) return;
    
    console.log('🔄 useActivities.loadActivities - iniciando carregamento para usuário:', authUser.uid);
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const userActivities = await activityRepository.getActivitiesByUser(authUser.uid, limit);
      console.log('📊 useActivities.loadActivities - atividades carregadas:', userActivities.length);
      console.log('📋 useActivities.loadActivities - atividades:', userActivities);
      setActivities(userActivities);
      
      // Contar não lidas
      const unread = await activityRepository.getUnreadCount(authUser.uid);
      console.log('🔢 useActivities.loadActivities - não lidas:', unread);
      setUnreadCount(unread);
    } catch (err) {
      console.error('❌ useActivities.loadActivities - erro:', err);
      setError('Erro ao carregar atividades');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [authUser?.uid, limit]);

  const markAsRead = useCallback(async (activityIds: string[]) => {
    try {
      await activityRepository.markAsRead(activityIds);
      // Atualizar estado local
      setActivities(prev => 
        prev.map(activity => 
          activityIds.includes(activity.id!) 
            ? { ...activity, isRead: true }
            : activity
        )
      );
      // Recalcular contador
      const newUnread = await activityRepository.getUnreadCount(authUser?.uid || '');
      setUnreadCount(newUnread);
    } catch (error) {
      console.error('Erro ao marcar atividades como lidas:', error);
    }
  }, [authUser?.uid]);

  const markAllAsRead = useCallback(async () => {
    if (!authUser) return;
    try {
      await activityRepository.markAllAsRead(authUser.uid);
      setActivities(prev => prev.map(activity => ({ ...activity, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  }, [authUser?.uid]);

  const refresh = useCallback(() => {
    loadActivities();
  }, [loadActivities]);

  // Carregar atividades iniciais
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Auto-refresh se habilitado
  useEffect(() => {
    if (!autoRefresh || !authUser) return;
    
    const interval = setInterval(() => {
      loadActivities();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, authUser?.uid, loadActivities]);

  return {
    activities,
    loading,
    unreadCount,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  };
} 