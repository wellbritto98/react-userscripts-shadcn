# Telas de Followers e Following

## Visão Geral

Implementamos as telas de **Followers** (Seguidores) e **Following** (Seguindo) que permitem visualizar e gerenciar as relações de seguimento entre usuários.

## Funcionalidades

### 📱 **FollowersScreen**
- **Lista de seguidores** do perfil atual ou de outro usuário
- **Botão de seguir/deixar de seguir** para cada seguidor
- **Navegação para perfil** ao clicar no usuário
- **Loading states** e feedback visual
- **Suporte a parâmetro de username** na URL

### 📱 **FollowingScreen**
- **Lista de usuários seguidos** pelo perfil atual ou outro usuário
- **Botão de deixar de seguir** para cada usuário seguido
- **Navegação para perfil** ao clicar no usuário
- **Remoção da lista** ao deixar de seguir
- **Suporte a parâmetro de username** na URL

## Rotas

### **Followers**
```
/followers          # Seguidores do usuário logado
/followers/:username # Seguidores de um usuário específico
```

### **Following**
```
/following          # Usuários seguidos pelo usuário logado
/following/:username # Usuários seguidos por um usuário específico
```

## Navegação

### **Do Perfil para as Listas**
No `UserProfileScreen`, as estatísticas de seguidores e seguindo são clicáveis:

```typescript
// Seguidores
<button onClick={() => navigate(`/followers/${user.username}`)}>
    <span>{user.followersCount}</span>
    <span>Seguidores</span>
</button>

// Seguindo
<button onClick={() => navigate(`/following/${user.username}`)}>
    <span>{user.followingCount}</span>
    <span>Seguindo</span>
</button>
```

### **Voltar ao Perfil**
Cada tela tem um botão de voltar que usa `navigate(-1)` para retornar à tela anterior.

## Funcionalidades por Tela

### **FollowersScreen**

#### **Carregamento de Dados**
```typescript
// Buscar seguidores
const followersList = await userRepository.getFollowers(targetUser.id, 50);

// Verificar se o usuário logado segue cada seguidor
for (const follower of followersList) {
    const isFollowing = await userRepository.isFollowing(authUser.uid, follower.id!);
    followingMap[follower.id!] = isFollowing;
}
```

#### **Ações Disponíveis**
- **Seguir**: Para usuários que o usuário logado não segue
- **Deixar de Seguir**: Para usuários que o usuário logado já segue
- **Ver Perfil**: Clique no card do usuário

#### **Estados dos Botões**
- **"Seguir"** (azul): Usuário não seguido
- **"Seguindo"** (outline): Usuário já seguido
- **Loading**: Durante a ação de seguir/deixar de seguir

### **FollowingScreen**

#### **Carregamento de Dados**
```typescript
// Buscar usuários seguidos
const followingList = await userRepository.getFollowing(targetUser.id, 50);
```

#### **Ações Disponíveis**
- **Deixar de Seguir**: Remove o usuário da lista
- **Ver Perfil**: Clique no card do usuário

#### **Estados dos Botões**
- **"Deixar de Seguir"** (vermelho): Remove da lista imediatamente
- **Loading**: Durante a ação de deixar de seguir

## Componentes de UI

### **Card de Usuário**
```typescript
<Card className="cursor-pointer hover:bg-gray-50 transition-colors">
    <CardContent className="flex items-center gap-4 py-4">
        <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
                {user.displayName}
            </div>
            <div className="text-gray-500 text-sm truncate">
                @{user.username}
            </div>
        </div>
        
        {/* Botão de ação */}
    </CardContent>
</Card>
```

### **Header com Navegação**
```typescript
<div className="flex items-center space-x-4 mb-4">
    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5" />
    </Button>
    <div>
        <h1 className="text-lg font-semibold text-gray-900">
            {isFollowers ? 'Seguidores' : 'Seguindo'}
        </h1>
        <p className="text-sm text-gray-600">
            @{targetUsername}
        </p>
    </div>
</div>
```

## Estados de Loading

### **Skeleton Loading**
```typescript
{loading ? (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <Card key={i}>
                <CardContent className="flex items-center gap-4 py-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="w-32 h-4 mb-2" />
                        <Skeleton className="w-20 h-3" />
                    </div>
                    <Skeleton className="w-20 h-8 rounded" />
                </CardContent>
            </Card>
        ))}
    </div>
) : (
    // Lista real
)}
```

### **Loading nos Botões**
```typescript
{loadingStates[userId] ? (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
) : (
    // Ícone e texto do botão
)}
```

## Permissões e Controles

### **FollowersScreen**
- **Botão de seguir**: Apenas se não for o próprio usuário
- **Verificação de estado**: Para cada seguidor
- **Acesso**: Qualquer usuário autenticado

### **FollowingScreen**
- **Botão de deixar de seguir**: Apenas no próprio perfil
- **Remoção da lista**: Imediata após deixar de seguir
- **Acesso**: Qualquer usuário autenticado

## Integração com Repository

### **Métodos Utilizados**
```typescript
// Buscar seguidores
userRepository.getFollowers(userId, limit)

// Buscar seguindo
userRepository.getFollowing(userId, limit)

// Verificar se segue
userRepository.isFollowing(followerId, followedId)

// Seguir usuário
userRepository.followUser(followerId, followedId)

// Deixar de seguir
userRepository.unfollowUser(followerId, followedId)
```

## Exemplo de Uso

### **Navegação Completa**
```typescript
// 1. Usuário clica em "Seguidores" no perfil
navigate(`/followers/${username}`);

// 2. Carrega lista de seguidores
const followers = await userRepository.getFollowers(userId, 50);

// 3. Usuário clica em um seguidor
navigate(`/profile/${followerUsername}`);

// 4. Usuário volta para a lista
navigate(-1);

// 5. Usuário segue/deixa de seguir
await userRepository.followUser(authUser.uid, followerId);
```

## Performance

### **Otimizações**
- **Limite de 50 usuários** por carregamento
- **Verificação em lote** do estado de seguimento
- **Loading states individuais** para cada ação
- **Remoção imediata** da lista ao deixar de seguir

### **Considerações**
- **Múltiplas requisições** para verificar estado de seguimento
- **Atualização em tempo real** dos contadores
- **Cache de estado** para melhor UX

## Estilos e UX

### **Hover Effects**
- **Cards clicáveis** com hover suave
- **Botões com feedback visual**
- **Transições suaves** para melhor UX

### **Responsividade**
- **Layout adaptativo** para diferentes tamanhos
- **Textos truncados** para evitar overflow
- **Espaçamento consistente** entre elementos

## Troubleshooting

### **Problemas Comuns**

#### **1. Usuário não encontrado**
```typescript
if (!targetUser || !targetUser.id) {
    console.error('Usuário não encontrado');
    return;
}
```

#### **2. Erro ao seguir/deixar de seguir**
```typescript
try {
    await userRepository.followUser(authUser.uid, userId);
} catch (error) {
    console.error('Erro ao seguir:', error);
}
```

#### **3. Estado inconsistente**
```typescript
// Recarregar estado após ação
const updatedUser = await userRepository.findByUsername(username);
if (updatedUser) {
    setProfileUser(updatedUser);
}
``` 