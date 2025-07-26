// Hook personalizado para gerenciar autenticação Firebase
import { useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { userRepository } from '../lib/repositories';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: {
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

/**
 * Hook personalizado para gerenciar autenticação Firebase
 * @returns Estado da autenticação e ações disponíveis
 */
export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Monitora mudanças no estado de autenticação
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Função para fazer login com email e senha
   * @param email - Email do usuário
   * @param password - Senha do usuário
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
      console.log(auth.currentUser);
      navigate("/profile");

    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função para registrar novo usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param userData - Dados adicionais do usuário
   */
  const register = async (
    email: string, 
    password: string, 
    userData?: {
      username: string;
      displayName: string;
      bio?: string;
      avatarUrl?: string;
    }
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Se temos dados adicionais, criar perfil no Firestore
      if (userData && user) {
        // Verificar se o username já existe
        const existingUser = await userRepository.findByUsername(userData.username);
        if (existingUser) {
          // Se o username já existe, deletar o usuário criado e mostrar erro
          await user.delete();
          setError('Este nome de usuário já está em uso.');
          return;
        }
        
        // Criar perfil no Firestore
        await userRepository.create({
          username: userData.username,
          email: email,
          displayName: userData.displayName,
          bio: userData.bio || '',
          avatarUrl: userData.avatarUrl || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          isPrivate: false
        });
      }
      
      navigate("/login");
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função para fazer logout
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
      navigate("/login")  
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpa mensagens de erro
   */
  const clearError = (): void => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    setError
  };
}

/**
 * Converte códigos de erro do Firebase em mensagens amigáveis
 * @param errorCode - Código de erro do Firebase
 * @returns Mensagem de erro em português
 */
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/email-already-in-use':
      return 'Este email já está em uso.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    default:
      return 'Erro de autenticação. Tente novamente.';
  }
}