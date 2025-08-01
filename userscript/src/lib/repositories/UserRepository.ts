import { GenericRepository } from './GenericRepository';
import { User, UserProfile, FollowRelationship } from '../firestore-models';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { generateUserSearchGrams, normalizeSearchText, generateNGrams, calculateSearchScore } from '../utils';
import { ActivityEvents } from '../events/ActivityEvents';

export class UserRepository extends GenericRepository<User> {
  constructor() {
    super('users');
  }

  // Sobrescrever o método create para usar o UID do Firebase Auth como ID do documento
  async create(data: Omit<User, 'id'> & { uid?: string }): Promise<string> {
    // Gerar campos de busca
    const searchData = generateUserSearchGrams(data.username, data.displayName);
    
    const userData = {
      ...data,
      ...searchData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (data.uid) {
      // Se temos o UID, usar como ID do documento
      const docRef = doc(db, 'users', data.uid);
      await setDoc(docRef, {
        ...userData,
        id: data.uid, // Garantir que o campo id também seja o UID
      });
      return data.uid;
    } else {
      // Fallback para o método original se não tiver UID
      return super.create(userData);
    }
  }

  // Atualizar campos de busca quando username ou displayName mudam
  async updateSearchFields(userId: string, username?: string, displayName?: string): Promise<void> {
    const user = await this.getById(userId);
    if (!user) return;

    const newUsername = username || user.username;
    const newDisplayName = displayName !== undefined ? displayName : user.displayName;
    
    const searchData = generateUserSearchGrams(newUsername, newDisplayName);
    
    await this.update(userId, {
      ...(username && { username: newUsername }),
      ...(displayName !== undefined && { displayName: newDisplayName }),
      ...searchData,
      updatedAt: new Date()
    });
  }

  // Buscar usuário por email
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: [{ field: 'email', operator: '==', value: email }]
    });
  }

  // Buscar usuário por username
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({
      where: [{ field: 'username', operator: '==', value: username }]
    });
  }

  // Busca melhorada com n-grams
  async searchUsersImproved(searchTerm: string, limitCount: number = 50): Promise<UserProfile[]> {
    const normalizedTerm = normalizeSearchText(searchTerm);
    
    if (normalizedTerm.length < 2) {
      return [];
    }

    // Gerar n-grams do termo de busca
    const termGrams2 = generateNGrams(normalizedTerm, 2);
    const termGrams3 = generateNGrams(normalizedTerm, 3);

    // Limitar a 10 n-grams para array-contains-any
    const limitedGrams2 = termGrams2.slice(0, 10);
    const limitedGrams3 = termGrams3.slice(0, 10);

    // Buscar por 2-grams
    const usersBy2Grams = await this.find({
      where: [{ field: 'searchGrams2', operator: 'array-contains-any', value: limitedGrams2 }],
      limit: limitCount
    });

    // Buscar por 3-grams
    const usersBy3Grams = await this.find({
      where: [{ field: 'searchGrams3', operator: 'array-contains-any', value: limitedGrams3 }],
      limit: limitCount
    });

    // Combinar resultados e remover duplicados
    const allUsers = [...usersBy2Grams, ...usersBy3Grams];
    const uniqueUsers = allUsers.filter((user, idx, arr) => 
      arr.findIndex(u => u.id === user.id) === idx
    );

    // Filtrar no cliente para garantir que contém todos os n-grams do termo
    const filteredUsers = uniqueUsers.filter(user => {
      const userGrams = {
        searchGrams2: user.searchGrams2 || [],
        searchGrams3: user.searchGrams3 || []
      };

      // Verificar se contém todos os 2-grams do termo
      const hasAll2Grams = termGrams2.every(gram => 
        userGrams.searchGrams2.includes(gram)
      );

      // Verificar se contém todos os 3-grams do termo
      const hasAll3Grams = termGrams3.every(gram => 
        userGrams.searchGrams3.includes(gram)
      );

      return hasAll2Grams && hasAll3Grams;
    });

    // Calcular scores e ordenar
    const scoredUsers = filteredUsers.map(user => ({
      user,
      score: calculateSearchScore(user, searchTerm, {
        searchGrams2: user.searchGrams2 || [],
        searchGrams3: user.searchGrams3 || []
      })
    }));

    // Ordenar por score (decrescente) e limitar
    const sortedUsers = scoredUsers
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount)
      .map(item => item.user);

    // Converter para UserProfile
    return sortedUsers.map(user => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isPrivate: user.isPrivate
    }));
  }

  // Buscar usuários por termo de busca (método legado - manter para compatibilidade)
  async searchUsers(searchTerm: string, limitCount: number = 10): Promise<UserProfile[]> {
    // Nota: Firestore não suporta busca por texto completo nativamente
    // Esta é uma implementação básica que busca por username
    const users = await this.find({
      where: [
        { field: 'username', operator: '>=', value: searchTerm },
        { field: 'username', operator: '<=', value: searchTerm + '\uf8ff' }
      ],
      limit: limitCount
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isPrivate: user.isPrivate
    }));
  }

  // Buscar usuários por displayName (prefixo) - método legado
  async searchUsersByDisplayName(searchTerm: string, limitCount: number = 10): Promise<UserProfile[]> {
    const users = await this.find({
      where: [
        { field: 'displayName', operator: '>=', value: searchTerm },
        { field: 'displayName', operator: '<=', value: searchTerm + '\uf8ff' }
      ],
      limit: limitCount
    });
    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isPrivate: user.isPrivate
    }));
  }

  // Seguir usuário
  async followUser(followerId: string, followedId: string): Promise<void> {
    const followData: Omit<FollowRelationship, 'id'> = {
      followerId,
      followedId,
      followedAt: new Date()
    };

    // Adiciona à subcoleção followers do usuário seguido
    await addDoc(collection(db, 'users', followedId, 'followers'), followData);
    
    // Adiciona à subcoleção following do usuário seguidor
    await addDoc(collection(db, 'users', followerId, 'following'), followData);

    // Atualiza contadores
    await this.updateFollowersCount(followedId, 1);
    await this.updateFollowingCount(followerId, 1);

    // Criar atividade de follow
    await ActivityEvents.onUserFollowed(followedId, followerId);
  }

  // Deixar de seguir usuário
  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    // Remove da subcoleção followers
    const followersQuery = query(
      collection(db, 'users', followedId, 'followers'),
      where('followerId', '==', followerId)
    );
    const followersSnapshot = await getDocs(followersQuery);
    followersSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Remove da subcoleção following
    const followingQuery = query(
      collection(db, 'users', followerId, 'following'),
      where('followedId', '==', followedId)
    );
    const followingSnapshot = await getDocs(followingQuery);
    followingSnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Atualiza contadores
    await this.updateFollowersCount(followedId, -1);
    await this.updateFollowingCount(followerId, -1);
  }

  // Verificar se um usuário segue outro
  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    const followersQuery = query(
      collection(db, 'users', followedId, 'followers'),
      where('followerId', '==', followerId)
    );
    const snapshot = await getDocs(followersQuery);
    return !snapshot.empty;
  }

  // Buscar seguidores de um usuário
  async getFollowers(userId: string, limitCount: number = 20): Promise<UserProfile[]> {
    const followersQuery = query(
      collection(db, 'users', userId, 'followers'),
      orderBy('followedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(followersQuery);
    const followerIds = snapshot.docs.map(doc => doc.data().followerId);
    
    if (followerIds.length === 0) return [];

    const users = await this.find({
      where: [{ field: 'id', operator: 'in', value: followerIds }]
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isPrivate: user.isPrivate
    }));
  }

  // Buscar quem um usuário segue
  async getFollowing(userId: string, limitCount: number = 20): Promise<UserProfile[]> {
    const followingQuery = query(
      collection(db, 'users', userId, 'following'),
      orderBy('followedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(followingQuery);
    const followedIds = snapshot.docs.map(doc => doc.data().followedId);
    
    if (followedIds.length === 0) return [];

    const users = await this.find({
      where: [{ field: 'id', operator: 'in', value: followedIds }]
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isPrivate: user.isPrivate
    }));
  }

  // Atualizar contador de seguidores
  private async updateFollowersCount(userId: string, increment: number): Promise<void> {
    const user = await this.getById(userId);
    if (user) {
      const newCount = (user.followersCount || 0) + increment;
      await this.update(userId, { followersCount: Math.max(0, newCount) });
    }
  }

  // Atualizar contador de seguindo
  private async updateFollowingCount(userId: string, increment: number): Promise<void> {
    const user = await this.getById(userId);
    if (user) {
      const newCount = (user.followingCount || 0) + increment;
      await this.update(userId, { followingCount: Math.max(0, newCount) });
    }
  }

  // Atualizar contador de posts
  async updatePostsCount(userId: string, increment: number): Promise<void> {
    const user = await this.getById(userId);
    if (user) {
      const newCount = (user.postsCount || 0) + increment;
      await this.update(userId, { postsCount: Math.max(0, newCount) });
    }
  }

  // Migrar usuário existente para usar UID como ID do documento
  async migrateUserToUid(userId: string, uid: string): Promise<void> {
    try {
      // Buscar usuário atual
      const user = await this.getById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Criar novo documento com UID como ID
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        ...user,
        id: uid, // Atualizar o campo id para o UID
        updatedAt: new Date()
      });

      // Deletar documento antigo
      await this.delete(userId);

      console.log(`Usuário migrado: ${userId} -> ${uid}`);
    } catch (error) {
      console.error('Erro ao migrar usuário:', error);
      throw error;
    }
  }

  // Migrar todos os usuários existentes para incluir campos de busca
  async migrateAllUsersToSearchFields(): Promise<void> {
    try {
      console.log('Iniciando migração dos campos de busca...');
      
      const allUsers = await this.find({});
      let migratedCount = 0;
      
      for (const user of allUsers) {
        // Pular se já tem os campos de busca
        if (user.searchGrams2 && user.searchGrams3) {
          continue;
        }
        
        // Gerar campos de busca
        const searchData = generateUserSearchGrams(user.username, user.displayName);
        
        // Atualizar usuário
        await this.update(user.id!, {
          ...searchData,
          updatedAt: new Date()
        });
        
        migratedCount++;
        
        // Log a cada 10 usuários migrados
        if (migratedCount % 10 === 0) {
          console.log(`${migratedCount} usuários migrados...`);
        }
      }
      
      console.log(`Migração concluída! ${migratedCount} usuários atualizados.`);
    } catch (error) {
      console.error('Erro na migração:', error);
      throw error;
    }
  }

  // Buscar usuário por UID (para usuários migrados)
  async findByUid(uid: string): Promise<User | null> {
    return this.getById(uid);
  }
} 