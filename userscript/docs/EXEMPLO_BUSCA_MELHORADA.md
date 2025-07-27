# Exemplo de Uso da Busca Melhorada

## Testando no Console do Navegador

### 1. Importar o Repository
```javascript
// No console do navegador
import { userRepository } from './lib/repositories';
```

### 2. Executar Migração (Uma vez)
```javascript
// Migrar todos os usuários existentes
await userRepository.migrateAllUsersToSearchFields();
```

### 3. Testar Busca
```javascript
// Buscar usuários com "joao"
const results = await userRepository.searchUsersImproved("joao", 10);
console.log("Resultados:", results);

// Buscar com acentos
const results2 = await userRepository.searchUsersImproved("joão", 10);
console.log("Resultados com acentos:", results2);

// Buscar por displayName
const results3 = await userRepository.searchUsersImproved("maria", 10);
console.log("Resultados por displayName:", results3);
```

### 4. Comparar com Busca Antiga
```javascript
// Busca antiga (só prefixo)
const oldResults = await userRepository.searchUsers("joao", 10);
console.log("Busca antiga:", oldResults);

// Busca nova (qualquer parte)
const newResults = await userRepository.searchUsersImproved("joao", 10);
console.log("Busca nova:", newResults);
```

## Exemplos de Busca

### Cenários de Teste
```javascript
// Usuários de exemplo para testar
const testUsers = [
  { username: "joao123", displayName: "João Silva" },
  { username: "maria_joao", displayName: "Maria João" },
  { username: "joao_silva", displayName: "João da Silva" },
  { username: "user_joao", displayName: "Usuário João" },
  { username: "ana", displayName: "Ana Maria" }
];

// Buscar "joao"
const results = await userRepository.searchUsersImproved("joao", 10);
// Resultado esperado: joao123, joao_silva, maria_joao, user_joao

// Buscar "maria"
const results2 = await userRepository.searchUsersImproved("maria", 10);
// Resultado esperado: maria_joao, ana (se displayName contém "maria")

// Buscar "silva"
const results3 = await userRepository.searchUsersImproved("silva", 10);
// Resultado esperado: joao_silva, joao123 (se displayName contém "silva")
```

## Debugging

### Verificar Campos de Busca
```javascript
// Verificar se um usuário tem os campos de busca
const user = await userRepository.getById("user_id");
console.log("Campos de busca:", {
  searchGrams2: user.searchGrams2,
  searchGrams3: user.searchGrams3,
  searchText: user.searchText
});
```

### Testar Normalização
```javascript
// Importar funções utilitárias
import { normalizeSearchText, generateNGrams } from './lib/utils';

// Testar normalização
console.log(normalizeSearchText("João Silva")); // "joao silva"
console.log(normalizeSearchText("MARIA")); // "maria"

// Testar n-grams
console.log(generateNGrams("joao", 2)); // ["jo", "ao"]
console.log(generateNGrams("joao", 3)); // ["joa", "oao"]
```

### Verificar Score de Relevância
```javascript
import { calculateSearchScore } from './lib/utils';

const user = { username: "joao123", displayName: "João Silva", followersCount: 100 };
const score = calculateSearchScore(user, "joao", { searchGrams2: [], searchGrams3: [] });
console.log("Score:", score); // Deve ser alto para startsWith
```

## Performance

### Medir Tempo de Busca
```javascript
// Medir performance
const start = performance.now();
const results = await userRepository.searchUsersImproved("joao", 20);
const end = performance.now();
console.log(`Busca levou ${end - start}ms`);
```

### Comparar Performance
```javascript
// Comparar busca antiga vs nova
const oldStart = performance.now();
const oldResults = await userRepository.searchUsers("joao", 10);
const oldEnd = performance.now();

const newStart = performance.now();
const newResults = await userRepository.searchUsersImproved("joao", 10);
const newEnd = performance.now();

console.log(`Busca antiga: ${oldEnd - oldStart}ms`);
console.log(`Busca nova: ${newEnd - newStart}ms`);
```

## Troubleshooting

### Problemas Comuns

#### 1. Usuários sem campos de busca
```javascript
// Verificar usuários sem campos de busca
const allUsers = await userRepository.find({});
const usersWithoutSearch = allUsers.filter(u => !u.searchGrams2);
console.log("Usuários sem campos de busca:", usersWithoutSearch.length);

// Migrar usuários faltantes
if (usersWithoutSearch.length > 0) {
  await userRepository.migrateAllUsersToSearchFields();
}
```

#### 2. Busca não retorna resultados
```javascript
// Verificar se o termo tem pelo menos 2 caracteres
const term = "a"; // Muito curto
const results = await userRepository.searchUsersImproved(term, 10);
console.log("Resultados:", results); // Deve ser vazio

// Verificar normalização
console.log("Termo normalizado:", normalizeSearchText(term));
```

#### 3. Performance lenta
```javascript
// Reduzir limite para melhor performance
const results = await userRepository.searchUsersImproved("joao", 10); // Menos resultados

// Usar debounce no frontend (já implementado no FindScreen)
```

## Integração com Frontend

### Hook Personalizado
```javascript
// hooks/useSearch.js
import { useState, useEffect } from 'react';
import { userRepository } from '../lib/repositories';

export function useSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await userRepository.searchUsersImproved(search, 20);
        setResults(searchResults);
      } catch (error) {
        console.error('Erro na busca:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [search]);

  return { search, setSearch, results, loading };
}
```

### Uso no Componente
```javascript
// Componente de busca
function SearchComponent() {
  const { search, setSearch, results, loading } = useSearch();

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar usuários..."
      />
      
      {loading && <div>Carregando...</div>}
      
      {results.map(user => (
        <div key={user.id}>
          {user.displayName} (@{user.username})
        </div>
      ))}
    </div>
  );
}
``` 