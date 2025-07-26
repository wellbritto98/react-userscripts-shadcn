# Estrutura do Firestore - Mini Instagram

Esta documentação descreve a estrutura completa do banco de dados Firestore para o mini Instagram, incluindo modelos, repositórios e exemplos de uso.

## 📁 Estrutura das Coleções

### 1. `users` - Usuários
```typescript
{
  id: string,
  username: string,
  email: string,
  avatarUrl?: string,
  bio?: string,
  displayName?: string,
  createdAt: Date,
  updatedAt: Date,
  followersCount: number,
  followingCount: number,
  postsCount: number,
  isPrivate: boolean
}
```

**Subcoleções:**
- `users/{userId}/followers` - Usuários que seguem este usuário
- `users/{userId}/following` - Usuários que este usuário segue

### 2. `posts` - Posts
```typescript
{
  id: string,
  userId: string,
  imageUrl: string,
  caption?: string,
  location?: string,
  createdAt: Date,
  updatedAt: Date,
  likeCount: number,
  commentCount: number,
  isPublic: boolean,
  tags?: string[]
}
```

### 3. `comments` - Comentários
```typescript
{
  id: string,
  postId: string,
  userId: string,
  text: string,
  createdAt: Date,
  updatedAt: Date,
  likeCount: number,
  parentCommentId?: string // Para comentários aninhados
}
```

### 4. `likes` - Curtidas
```typescript
{
  id: string,
  userId: string,
  targetId: string, // ID do post ou comentário
  targetType: 'post' | 'comment',
  createdAt: Date
}
```

## 🛠️ Repositórios

### GenericRepository
Repositório base com operações CRUD genéricas:
- `create()`, `getById()`, `update()`, `delete()`
- `find()`, `findOne()` com filtros e ordenação
- `findWithPagination()` para paginação
- Operações em lote (`createBatch`, `updateBatch`, `deleteBatch`)
- Listeners em tempo real (`onSnapshot`, `onSnapshotById`)

### UserRepository
Repositório específico para usuários:
- `findByEmail()`, `findByUsername()`
- `searchUsers()` - busca por username
- `followUser()`, `unfollowUser()`, `isFollowing()`
- `getFollowers()`, `getFollowing()`
- `updatePostsCount()`, `updateFollowersCount()`, `updateFollowingCount()`

### PostRepository
Repositório específico para posts:
- `getPostsByUser()` - posts de um usuário
- `getPublicPosts()` - feed público
- `getFeedPosts()` - feed personalizado (usuários seguidos)
- `getPostsByTags()` - busca por tags
- `getPopularPosts()` - posts mais curtidos
- `createPost()`, `deletePost()` com atualização de contadores
- `updateLikeCount()`, `updateCommentCount()`
- `getPostsWithUser()` - posts com dados do usuário

### CommentRepository
Repositório específico para comentários:
- `getCommentsByPost()` - comentários de um post
- `getCommentsWithUser()` - comentários com dados do usuário
- `getRepliesToComment()` - respostas a comentários
- `createComment()`, `deleteComment()` com atualização de contadores
- `updateLikeCount()` - curtidas em comentários
- `getCommentsByUser()` - comentários de um usuário

### LikeRepository
Repositório específico para curtidas:
- `like()`, `unlike()` - curtir/descurtir posts ou comentários
- `isLiked()` - verificar se curtiu
- `getUsersWhoLikedPost()`, `getUsersWhoLikedComment()`
- `getLikesByUser()` - curtidas de um usuário
- `getPostsLikedByUser()` - posts curtidos por um usuário
- `getLikeCount()` - contar curtidas

## 📝 Exemplos de Uso

### Criar um usuário
```typescript
import { userRepository } from '@/lib/repositories';

const userId = await userRepository.create({
  username: 'jose_britto',
  email: 'jose@example.com',
  displayName: 'José Britto',
  bio: 'Desenvolvedor de software',
  avatarUrl: 'https://example.com/avatar.jpg',
  isPrivate: false
});
```

### Criar um post
```typescript
import { postRepository } from '@/lib/repositories';

const postId = await postRepository.createPost({
  userId: 'user123',
  imageUrl: 'https://example.com/image.jpg',
  caption: 'Check out this view!',
  location: 'São Paulo, SP',
  isPublic: true,
  tags: ['nature', 'photography']
});
```

### Buscar feed personalizado
```typescript
import { userRepository, postRepository } from '@/lib/repositories';

// Buscar IDs de usuários seguidos
const following = await userRepository.getFollowing('user123');
const followingIds = following.map(user => user.id!);

// Buscar posts do feed
const feedPosts = await postRepository.getFeedPosts('user123', followingIds, 20);
```

### Curtir um post
```typescript
import { likeRepository } from '@/lib/repositories';

await likeRepository.like('user123', 'post456', 'post');
```

### Comentar em um post
```typescript
import { commentRepository } from '@/lib/repositories';

const commentId = await commentRepository.createComment({
  postId: 'post456',
  userId: 'user123',
  text: 'Muito legal!'
});
```

### Seguir um usuário
```typescript
import { userRepository } from '@/lib/repositories';

await userRepository.followUser('user123', 'user456');
```

## 🔄 Relacionamentos

### Seguidores/Seguindo
- Usado subcoleções para performance
- Contadores mantidos sincronizados
- Busca rápida de quem segue/quem é seguido

### Posts e Usuários
- Posts referenciam usuários por ID
- Dados do usuário podem ser enriquecidos quando necessário
- Contadores de posts mantidos sincronizados

### Curtidas
- Tabela separada para flexibilidade
- Suporte a curtidas em posts e comentários
- Contadores mantidos sincronizados

### Comentários
- Referenciam posts por ID
- Suporte a comentários aninhados
- Contadores mantidos sincronizados

## ⚡ Performance e Escalabilidade

### Índices Recomendados
```javascript
// users
- email (ascending)
- username (ascending)

// posts
- userId (ascending) + createdAt (descending)
- isPublic (ascending) + createdAt (descending)
- tags (array-contains) + isPublic (ascending)

// comments
- postId (ascending) + createdAt (descending)
- userId (ascending) + createdAt (descending)

// likes
- userId (ascending) + targetId (ascending) + targetType (ascending)
- targetId (ascending) + targetType (ascending) + createdAt (descending)
```

### Otimizações
1. **Contadores**: Mantidos sincronizados para evitar contagens em tempo real
2. **Subcoleções**: Usadas para relacionamentos frequentes (seguidores)
3. **Denormalização**: Dados do usuário duplicados em posts quando necessário
4. **Paginação**: Implementada com `startAfter` para performance
5. **Listeners**: Suporte a atualizações em tempo real

## 🚀 Próximos Passos

1. **Configurar índices** no Firebase Console
2. **Implementar regras de segurança** do Firestore
3. **Adicionar validação** de dados
4. **Implementar cache** para consultas frequentes
5. **Adicionar funcionalidades** como stories, direct messages, etc. 