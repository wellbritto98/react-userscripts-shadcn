# Configuração do shadcn/ui no React Userscripts

Este projeto agora está configurado para usar o shadcn/ui, uma biblioteca de componentes React moderna e acessível.

## ✅ O que foi configurado

### 1. Dependências instaladas
- `@types/react` e `@types/react-dom` - Tipos TypeScript para React
- `@vitejs/plugin-react` - Plugin React para Vite
- `class-variance-authority` - Utilitário para variantes de classes
- `clsx` - Utilitário para concatenação de classes
- `tailwind-merge` - Merge inteligente de classes Tailwind
- `lucide-react` - Ícones para React
- `@radix-ui/react-slot` - Primitivo Slot do Radix UI

### 2. Configurações atualizadas

#### `vite.config.ts`
- Adicionado plugin React com JSX clássico
- Configurado path alias `@` para `./src`
- Configurado para suprimir avisos de dependências externas

#### `tsconfig.app.json`
- Configurado para usar JSX clássico (`"jsx": "react"`)
- Adicionado path mapping para `@/*`

#### `src/App.css`
- Adicionadas variáveis CSS do shadcn/ui
- Configurado tema claro e escuro
- Adicionados estilos base

#### `components.json`
- Arquivo de configuração do shadcn/ui criado
- Configurado para usar TypeScript e Tailwind CSS

### 3. Estrutura de arquivos criada
```
src/
├── lib/
│   └── utils.ts          # Função utilitária cn() para merge de classes
└── components/
    └── ui/
        └── button.tsx     # Componente Button do shadcn/ui
```

## 🚀 Como usar

### Adicionando novos componentes

Para adicionar um novo componente do shadcn/ui:

```bash
npx shadcn@latest add [component-name]
```

Exemplos:
```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

### Usando componentes no código

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function MyComponent() {
  return (
    <div className={cn("flex gap-4", "p-4")}>
      <Button variant="default">Botão Padrão</Button>
      <Button variant="outline">Botão Outline</Button>
      <Button variant="destructive">Botão Destrutivo</Button>
    </div>
  );
}
```

### Função utilitária `cn()`

A função `cn()` em `@/lib/utils` combina `clsx` e `tailwind-merge` para:
- Concatenar classes condicionalmente
- Resolver conflitos entre classes Tailwind

```tsx
import { cn } from "@/lib/utils";

// Exemplo de uso
const buttonClass = cn(
  "px-4 py-2",
  isActive && "bg-blue-500",
  "bg-gray-500" // Esta classe será sobrescrita se isActive for true
);
```

## 🎨 Personalização

### Temas
O projeto está configurado com variáveis CSS para temas claro e escuro. Você pode personalizar as cores editando as variáveis em `src/App.css`.

### Componentes
Todos os componentes do shadcn/ui são totalmente customizáveis. Você pode modificar os arquivos em `src/components/ui/` conforme necessário.

## 📦 Build

O projeto continua funcionando normalmente:

```bash
# Build de produção
npm run build

# Preview local
npm run preview

# Desenvolvimento com watch
npm start
```

O userscript gerado incluirá todos os estilos do shadcn/ui inline, mantendo a compatibilidade com userscript managers.

## 🔧 Troubleshooting

### Problemas de build
Se encontrar problemas de build relacionados ao JSX, verifique se:
- `tsconfig.app.json` tem `"jsx": "react"`
- `vite.config.ts` usa `react({ jsxRuntime: 'classic' })`

### Problemas de importação
Se os imports com `@/` não funcionarem:
- Verifique se o path está configurado em `tsconfig.json` e `tsconfig.app.json`
- Verifique se o alias está configurado em `vite.config.ts`

### Estilos não aplicados
Se os estilos do shadcn/ui não aparecerem:
- Verifique se `@import "tailwindcss";` está no topo do `src/App.css`
- Verifique se as variáveis CSS foram adicionadas corretamente