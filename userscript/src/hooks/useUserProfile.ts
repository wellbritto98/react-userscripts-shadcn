import { useState, useEffect } from 'react';
import { User } from '../lib/firestore-models';
import { userRepository } from '../lib/repositories';
import { useAuth } from './useAuth';

export function useUserProfile() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser?.email) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Buscar perfil do usuário por email
        const profile = await userRepository.findByEmail(authUser.email);
        setUserProfile(profile);
      } catch (err) {
        setError('Erro ao carregar perfil do usuário');
        console.error('Erro ao buscar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser?.email]);

  const updateProfile = async (updates: Partial<User>) => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      await userRepository.update(userProfile.id, {
        ...updates,
        updatedAt: new Date()
      });
      
      // Atualizar estado local
      setUserProfile(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    } catch (err) {
      setError('Erro ao atualizar perfil');
      console.error('Erro ao atualizar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!authUser?.email) return;

    try {
      setLoading(true);
      setError(null);
      
      const profile = await userRepository.findByEmail(authUser.email);
      setUserProfile(profile);
    } catch (err) {
      setError('Erro ao atualizar perfil');
      console.error('Erro ao atualizar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    loading,
    error,
    updateProfile,
    refreshProfile
  };
} 