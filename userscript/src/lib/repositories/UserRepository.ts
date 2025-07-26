import { GenericRepository } from './GenericRepository';
import { User, UserProfile, FollowRelationship } from '../firestore-models';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export class UserRepository extends GenericRepository<User> {
  constructor() {
    super('users');
  }

  // Sobrescrever o método create para usar o UID do Firebase Auth como ID do documento
  async create(data: Omit<User, 'id'> & { uid?: string }): Promise<string> {
    if (data.uid) {
      // Se temos o UID, usar como ID do documento
      const docRef = doc(db, 'users', data.uid);
      await setDoc(docRef, {
        ...data,
        id: data.uid, // Garantir que o campo id também seja o UID
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return data.uid;
    } else {
      // Fallback para o método original se não tiver UID
      return super.create(data);
    }
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

  // Buscar usuários por termo de busca
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

  // Buscar usuários por displayName (prefixo)
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

  // Buscar usuário por UID (para usuários migrados)
  async findByUid(uid: string): Promise<User | null> {
    return this.getById(uid);
  }
} 