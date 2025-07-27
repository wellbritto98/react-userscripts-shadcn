# Busca Melhorada de Usuários com N-Grams

## Visão Geral

Implementamos uma busca de usuários melhorada usando n-grams no Firestore, que permite busca por texto em qualquer parte do username e displayName, com suporte a acentos e case-insensitive.

## Como Funciona

### 1. Normalização de Texto
- Remove acentos (João → Joao)
- Converte para minúsculas
- Remove espaços extras
- Unifica username + displayName em um único texto de busca

### 2. Geração de N-Grams
- **2-grams**: "joao" → ["jo", "ao"]
- **3-grams**: "joao" → ["joa", "oao"]
- Permite busca por qualquer parte do texto

### 3. Estrutura de Dados
```typescript
interface User {
  // ... campos existentes
  searchGrams2?: string[];  // 2-grams para busca
  searchGrams3?: string[];  // 3-grams para busca
  searchText?: string;      // Texto normalizado
}
```

### 4. Algoritmo de Busca
1. **Normaliza** o termo de busca
2. **Gera n-grams** do termo (2-gram e 3-gram)
3. **Consulta Firestore** com `array-contains-any`
4. **Filtra no cliente** para garantir que contém todos os n-grams
5. **Calcula score** de relevância
6. **Ordena** por score e limita resultados

### 5. Score de Relevância
- **startsWith username**: +100 pontos
- **startsWith displayName**: +80 pontos
- **contains username**: +50 pontos
- **contains displayName**: +40 pontos
- **followersCount**: +0.01 por seguidor (tie-break)

## Implementação

### Funções Utilitárias (`utils.ts`)
- `normalizeSearchText()`: Normaliza texto
- `generateNGrams()`: Gera n-grams
- `generateUserSearchGrams()`: Gera todos os campos de busca
- `calculateSearchScore()`: Calcula score de relevância

### UserRepository
- `searchUsersImproved()`: Nova busca com n-grams
- `updateSearchFields()`: Atualiza campos quando username/displayName mudam
- `migrateAllUsersToSearchFields()`: Migra usuários existentes

### FindScreen
- **Debounce**: 300ms para evitar muitas requisições
- **Mínimo 2 caracteres**: Só busca com 2+ caracteres
- **Busca automática**: Não precisa pressionar Enter
- **Loading states**: Feedback visual durante busca

## Migração

### Script de Migração
```typescript
import { migrateSearchFields } from '@/lib/migrate-search-fields';

// Executar uma vez para migrar todos os usuários
await migrateSearchFields();
```

### Componente Admin
- Tela de administração para executar migração
- Feedback visual do progresso
- Tratamento de erros

## Vantagens

### ✅ Prós
- **Busca em qualquer parte**: Não só prefixo
- **Suporte a acentos**: Normalização automática
- **Case-insensitive**: Funciona com maiúsculas/minúsculas
- **Score inteligente**: Resultados mais relevantes primeiro
- **Sem serviços externos**: Usa apenas Firestore
- **Debounce**: Performance otimizada

### ⚠️ Limitações
- **Tamanho do documento**: Aumenta com arrays de n-grams
- **Limite do Firestore**: `array-contains-any` aceita até 10 valores
- **Post-filtering**: Necessário para garantir precisão

## Uso

### Busca Automática
```typescript
// No FindScreen - busca automática com debounce
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  const results = await userRepository.searchUsersImproved(term, 20);
}, [debouncedSearch]);
```

### Migração de Usuários Existentes
```typescript
// Executar uma vez
await userRepository.migrateAllUsersToSearchFields();
```

### Atualização Manual
```typescript
// Quando username ou displayName mudam
await userRepository.updateSearchFields(userId, newUsername, newDisplayName);
```

## Performance

### Otimizações
- **Debounce 300ms**: Evita requisições desnecessárias
- **Limite 50**: Busca mais resultados antes do filtro
- **Post-filtering**: Remove resultados irrelevantes
- **Cache de n-grams**: Calculados uma vez por usuário

### Custos
- **Leitura**: 2 consultas por busca (2-gram + 3-gram)
- **Escrita**: Campos extras no documento do usuário
- **Storage**: ~200-500 bytes por usuário (arrays de n-grams)

## Exemplo de Uso

```typescript
// Buscar usuários
const results = await userRepository.searchUsersImproved("joao", 20);

// Resultados ordenados por relevância
// 1. "joao123" (startsWith username)
// 2. "maria_joao" (contains username)
// 3. "joao_silva" (startsWith username)
// 4. "user_joao" (contains username)
```

## Configuração

### Variáveis Importantes
- **Debounce delay**: 300ms
- **Mínimo caracteres**: 2
- **Limite inicial**: 50 (antes do filtro)
- **Limite final**: 20 (após filtro)
- **N-grams**: 2-gram e 3-gram

### Personalização
```typescript
// Ajustar score de relevância
export function calculateSearchScore(user, term, grams) {
  let score = 0;
  
  // Personalizar pesos
  if (user.username.startsWith(term)) score += 100;
  if (user.displayName.startsWith(term)) score += 80;
  
  return score;
}
``` 