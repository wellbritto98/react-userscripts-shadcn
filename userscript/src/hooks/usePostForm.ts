import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { postRepository } from '@/lib/repositories';
import { userRepository } from '@/lib/repositories';

export interface MentionUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export function usePostForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<MentionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Buscar usuários para mentions
  const searchMentions = useCallback(async (searchTerm: string): Promise<MentionUser[]> => {
    if (searchTerm.length < 2) return [];
    
    try {
      const users = await userRepository.searchUsersImproved(searchTerm, 10);
      return users
        .filter(user => user.id) // Filtrar usuários sem ID
        .map(user => ({
          id: user.id!,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl
        }));
    } catch (error) {
      console.error('Erro ao buscar usuários para mention:', error);
      return [];
    }
  }, []);

  // Adicionar mention
  const addMention = useCallback((user: MentionUser) => {
    setMentions(prev => {
      const exists = prev.find(m => m.id === user.id);
      if (exists) return prev;
      return [...prev, user];
    });
    
    setTags(prev => {
      const exists = prev.find(tag => tag === user.username);
      if (exists) return prev;
      return [...prev, user.username];
    });
  }, []);

  // Remover mention
  const removeMention = useCallback((userId: string) => {
    setMentions(prev => prev.filter(m => m.id !== userId));
    setTags(prev => {
      const user = mentions.find(m => m.id === userId);
      if (user) {
        return prev.filter(tag => tag !== user.username);
      }
      return prev;
    });
  }, [mentions]);

  // Validar formulário
  const validateForm = useCallback(() => {
    if (!imageUrl.trim()) {
      throw new Error('URL da imagem é obrigatória');
    }
    
    if (!caption.trim()) {
      throw new Error('Descrição é obrigatória');
    }

    // Validar se a URL da imagem é válida
    try {
      new URL(imageUrl);
    } catch {
      throw new Error('URL da imagem inválida');
    }
  }, [imageUrl, caption]);

  // Submeter post
  const submitPost = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('Usuário não autenticado');
    }

    validateForm();
    setLoading(true);

    try {
      await postRepository.createPost({
        userId: user.uid,
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        location: location.trim(),
        isPublic,
        tags
      });

      // Limpar formulário
      setImageUrl('');
      setCaption('');
      setLocation('');
      setIsPublic(true);
      setTags([]);
      setMentions([]);
      
      // Navegar de volta
      navigate('/profile');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, imageUrl, caption, location, isPublic, tags, validateForm, navigate]);

  return {
    // Estado
    imageUrl,
    setImageUrl,
    caption,
    setCaption,
    location,
    setLocation,
    isPublic,
    setIsPublic,
    tags,
    setTags,
    mentions,
    setMentions,
    loading,
    imageError,
    setImageError,
    
    // Ações
    searchMentions,
    addMention,
    removeMention,
    submitPost,
    validateForm
  };
} 