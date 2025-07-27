# Funcionalidade AddPost

## Visão Geral

A funcionalidade AddPost permite aos usuários criar novas publicações com imagens, descrições, localização e marcar outros usuários.

## Características Principais

### 1. Upload de Imagem via URL
- **Método**: O usuário cola uma URL de imagem (não há upload de arquivo)
- **Validação**: Verifica se a URL é válida e se a imagem carrega corretamente
- **Preview**: Mostra a imagem em tempo real conforme o usuário cola a URL

### 2. Proporção Padrão 1:1
- **Formato**: Quadrado (1:1) como Instagram
- **Container**: `aspect-square` CSS para manter proporção
- **Corte**: `object-cover` para ajustar imagens de outras proporções
- **Dica**: Interface mostra claramente a proporção recomendada

### 3. Sistema de Mentions (@)
- **Detecção**: Detecta automaticamente quando o usuário digita `@`
- **Busca**: Usa `userRepository.searchUsersImproved()` para buscar usuários
- **Sugestões**: Dropdown com avatares e nomes dos usuários
- **Navegação**: Setas do teclado para navegar nas sugestões
- **Seleção**: Enter para selecionar, Escape para fechar
- **Tags**: Adiciona automaticamente usernames às tags do post

### 4. Campos do Post
- **imageUrl**: URL da imagem (obrigatório)
- **caption**: Descrição com suporte a mentions (obrigatório)
- **location**: Localização opcional
- **isPublic**: Toggle público/privado
- **tags**: Array de usernames mencionados (automático)

## Componentes

### AddPostScreen
- Interface principal para criação de posts
- Integração com AppBar dinâmico
- Validação de formulário
- Preview de imagem em tempo real

### usePostForm Hook
- Gerenciamento de estado do formulário
- Lógica de validação
- Integração com PostRepository
- Sistema de mentions

### MentionInput
- Input com suporte a mentions
- Detecção de @ em tempo real
- Dropdown de sugestões
- Navegação por teclado
- Badges para mentions selecionadas

## Fluxo de Uso

1. **Acesso**: Usuário navega para `/add-post`
2. **Imagem**: Cola URL da imagem → vê preview imediato
3. **Descrição**: Digita caption com @ para marcar pessoas
4. **Localização**: Adiciona localização (opcional)
5. **Privacidade**: Escolhe público ou privado
6. **Postar**: Clica "Compartilhar" → redireciona para perfil

## Validações

- **URL da imagem**: Deve ser válida e acessível
- **Descrição**: Campo obrigatório
- **Usuário**: Deve estar autenticado
- **Mentions**: Validação de usuários existentes

## Exemplo de Uso

```typescript
// Hook personalizado
const {
  imageUrl, setImageUrl,
  caption, setCaption,
  mentions, addMention,
  submitPost
} = usePostForm();

// Componente de input com mentions
<MentionInput
  value={caption}
  onChange={setCaption}
  mentions={mentions}
  onAddMention={addMention}
  searchMentions={searchMentions}
/>
```

## Considerações Técnicas

### Performance
- Debounce na busca de mentions
- Preview de imagem com loading states
- Validação assíncrona de URLs

### UX
- Feedback visual para erros de imagem
- Loading states durante operações
- Navegação por teclado nas mentions
- Dicas visuais sobre proporção

### Segurança
- Validação de URLs de imagem
- Sanitização de mentions
- Verificação de usuários existentes

## Próximas Melhorias

- [ ] Upload de arquivo local
- [ ] Editor de imagem básico
- [ ] Filtros e efeitos
- [ ] Agendamento de posts
- [ ] Rascunhos salvos
- [ ] Múltiplas imagens por post 