# Componente Tabs do Shadcn UI

Esta documentação explica como usar o componente oficial `Tabs` do Shadcn UI, que é muito mais robusto e acessível que implementações manuais.

## 🎯 **Por que usar o Tabs do Shadcn UI?**

### **✅ Vantagens**
- **Acessibilidade completa**: Suporte a navegação por teclado, screen readers
- **Gerenciamento de estado**: Controle automático de estados ativos
- **Animações suaves**: Transições nativas do Radix UI
- **Responsivo**: Funciona perfeitamente em todos os dispositivos
- **Customizável**: Fácil personalização via CSS

### **🔧 Componentes Disponíveis**
- `Tabs` - Container principal
- `TabsList` - Lista de triggers das tabs
- `TabsTrigger` - Botão de cada tab
- `TabsContent` - Conteúdo de cada tab

## 📦 **Instalação**

```bash
npx shadcn@latest add tabs
```

## 🚀 **Uso Básico**

### **Importação**
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

### **Estrutura Básica**
```typescript
<Tabs defaultValue="posts" className="w-full">
  <TabsList>
    <TabsTrigger value="posts">Posts</TabsTrigger>
    <TabsTrigger value="tagged">Marcado</TabsTrigger>
  </TabsList>
  <TabsContent value="posts">
    Conteúdo dos posts aqui
  </TabsContent>
  <TabsContent value="tagged">
    Conteúdo das fotos marcadas aqui
  </TabsContent>
</Tabs>
```

## 🎨 **Implementação no Perfil**

### **Tabs Estilizadas como Instagram**
```typescript
<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-200">
    <TabsTrigger 
      value="posts" 
      className="flex items-center space-x-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none bg-transparent shadow-none"
    >
      <Grid className="w-4 h-4" />
      <span className="text-sm font-medium">Posts</span>
    </TabsTrigger>
    
    <TabsTrigger 
      value="tagged" 
      className="flex items-center space-x-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none bg-transparent shadow-none"
    >
      <UserCheck className="w-4 h-4" />
      <span className="text-sm font-medium">Marcado</span>
    </TabsTrigger>
  </TabsList>

  <TabsContent value="posts" className="mt-6">
    {/* Conteúdo dos posts */}
  </TabsContent>

  <TabsContent value="tagged" className="mt-6">
    {/* Conteúdo das fotos marcadas */}
  </TabsContent>
</Tabs>
```

## 🔧 **Props Disponíveis**

### **Tabs**
- `defaultValue` - Tab inicial ativa
- `value` - Tab atualmente ativa (controlado)
- `onValueChange` - Callback quando tab muda
- `orientation` - "horizontal" | "vertical"
- `dir` - Direção do texto (ltr/rtl)

### **TabsList**
- `loop` - Permite loop entre tabs
- `className` - Classes CSS customizadas

### **TabsTrigger**
- `value` - Valor único da tab
- `disabled` - Desabilita a tab
- `className` - Classes CSS customizadas

### **TabsContent**
- `value` - Valor da tab correspondente
- `forceMount` - Força montagem do conteúdo
- `className` - Classes CSS customizadas

## 🎨 **Estilos Customizados**

### **Tabs com Bordas Inferiores**
```css
/* Estilo similar ao Instagram */
.tabs-trigger {
  @apply flex items-center space-x-2;
  @apply data-[state=active]:border-b-2;
  @apply data-[state=active]:border-blue-500;
  @apply data-[state=active]:text-blue-600;
  @apply rounded-none bg-transparent shadow-none;
}
```

### **Tabs com Ícones**
```typescript
<TabsTrigger value="posts" className="flex items-center space-x-2">
  <Grid className="w-4 h-4" />
  <span>Posts</span>
</TabsTrigger>
```

## 🔄 **Gerenciamento de Estado**

### **Estado Controlado**
```typescript
const [activeTab, setActiveTab] = useState('posts');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  {/* conteúdo */}
</Tabs>
```

### **Estado Não Controlado**
```typescript
<Tabs defaultValue="posts">
  {/* conteúdo */}
</Tabs>
```

## ♿ **Acessibilidade**

O componente Tabs do Shadcn UI já inclui:

- **Navegação por teclado**: Tab, Shift+Tab, Arrow keys
- **Screen readers**: ARIA labels e roles apropriados
- **Focus management**: Foco automático na tab ativa
- **Keyboard shortcuts**: Enter/Space para ativar

## 📱 **Responsividade**

### **Tabs Responsivas**
```typescript
<TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  <TabsTrigger value="posts">Posts</TabsTrigger>
  <TabsTrigger value="tagged">Marcado</TabsTrigger>
  <TabsTrigger value="saved">Salvos</TabsTrigger>
</TabsList>
```

### **Tabs Verticais (Mobile)**
```typescript
<Tabs orientation="vertical" className="flex flex-col md:flex-row">
  <TabsList className="flex-col md:flex-row">
    {/* triggers */}
  </TabsList>
  {/* content */}
</Tabs>
```

## 🚀 **Exemplos Avançados**

### **Tabs com Loading States**
```typescript
<TabsContent value="posts" className="mt-6">
  {loading ? (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
    </div>
  ) : (
    <PostsGrid posts={posts} />
  )}
</TabsContent>
```

### **Tabs com Estados Vazios**
```typescript
<TabsContent value="posts" className="mt-6">
  {posts.length > 0 ? (
    <PostsGrid posts={posts} />
  ) : (
    <EmptyState 
      icon={<Camera className="w-8 h-8" />}
      title="Nenhum Post Ainda"
      description="Quando você compartilhar fotos, elas aparecerão aqui."
    />
  )}
</TabsContent>
```

## 📋 **Melhores Práticas**

1. **Use valores descritivos**: `value="user-posts"` em vez de `value="tab1"`
2. **Mantenha consistência**: Use o mesmo padrão em toda a aplicação
3. **Teste acessibilidade**: Verifique navegação por teclado
4. **Estados vazios**: Sempre forneça feedback quando não há conteúdo
5. **Loading states**: Mostre skeleton durante carregamento

## 🔗 **Referências**

- [Documentação oficial do Shadcn UI Tabs](https://ui.shadcn.com/docs/components/tabs)
- [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs)
- [Acessibilidade de Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

O componente Tabs do Shadcn UI é a escolha certa para qualquer implementação de tabs, oferecendo acessibilidade, performance e flexibilidade de customização! 