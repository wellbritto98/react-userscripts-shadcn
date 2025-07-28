import React, { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { activityRepository } from '@/lib/repositories';
import { useAuth } from '@/hooks/useAuth';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { user: authUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    if (!authUser) return;
    try {
      const count = await activityRepository.getUnreadCount(authUser.uid);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);
    }
  }, [authUser]);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  if (unreadCount === 0) return null;

  return (
    <Badge
      variant="destructive"
      className={`ppm:absolute ppm:-top-1 ppm:-right-1 ppm:min-w-[14px] ppm:h-[14px] ppm:text-[10px] ppm:flex ppm:items-center ppm:justify-center ppm:p-0 ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
} 