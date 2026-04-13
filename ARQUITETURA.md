# 🏗️ Arquitetura do Sistema - Portal Autopeças

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login      │  │  Dashboard   │  │  Components  │      │
│  │  - Auth      │  │  - Grid      │  │  - Cards     │      │
│  │  - Validation│  │  - Search    │  │  - Modal     │      │
│  │  - Error     │  │  - Filter    │  │  - Navbar    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▼                  ▼                 ▼               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Services Layer (supabaseClient.js)                  │   │
│  │  - Initialização Supabase                            │   │
│  │  - Métodos reutilizáveis                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ▼                                    │
└─────────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Supabase + PostgreSQL)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌─────────────────────────────────┐ │
│  │   PostgreSQL     │  │   Supabase Auth (JWT)           │ │
│  │  - fornecedores  │  │  - Session Management           │ │
│  │  - favoritos     │  │  - Password Hashing             │ │
│  │  - users (auth)  │  │  - Email Verification           │ │
│  └──────────────────┘  └─────────────────────────────────┘ │
│         ▲                         ▲                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  RLS (Row Level Security) - Políticas de Acesso     │  │
│  │  - fornecedores: READ para autenticados             │  │
│  │  - favoritos: READ/WRITE apenas do usuário          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### Login
```
User Input
    ↓
Login Component
    ↓
supabaseClient.auth.signInWithPassword()
    ↓
Supabase Backend
    ↓
JWT Token + Session
    ↓
App State (user) atualizado
    ↓
Redireciona para Dashboard
```

### Carregar Fornecedores
```
Dashboard Mount
    ↓
loadData() chamado
    ↓
supabase.from('fornecedores').select()
    ↓
PostgreSQL Query + RLS Check
    ↓
Array de fornecedores retornado
    ↓
State (suppliers) atualizado
    ↓
Grid renderizado
```

### Adicionar aos Favoritos
```
Click no ❤️
    ↓
handleToggleFavorite(supplierId)
    ↓
supabase.from('favoritos').insert()
    ↓
RLS Check: auth.uid() === user_id
    ↓
Inserção no banco + State atualizado
    ↓
Botão ❤️ fica preenchido
```

## 📁 Estrutura de Arquivos Detalhada

```
portal-autopeças/
│
├── 📄 Configuração & Deploy
│   ├── vite.config.js              # Configuração Vite
│   ├── netlify.toml               # Configuração Netlify
│   ├── package.json               # Dependências
│   ├── .env.example               # Template variáveis
│   └── .env.local                 # Variáveis (não commitar)
│
├── 📂 src/
│   │
│   ├── 📄 App.jsx                 # Componente raiz + auth
│   ├── 📄 main.jsx                # Entry point
│   ├── 📄 index.css               # Estilos globais
│   │
│   ├── 📂 pages/                  # Páginas principais
│   │   ├── Login.jsx              # Página de login
│   │   ├── Login.css              # Estilos login
│   │   ├── Dashboard.jsx          # Página principal
│   │   └── Dashboard.css          # Estilos dashboard
│   │
│   ├── 📂 components/             # Componentes reutilizáveis
│   │   ├── Navbar.jsx             # Barra de navegação
│   │   ├── Navbar.css
│   │   ├── SupplierCard.jsx       # Card do fornecedor
│   │   ├── SupplierCard.css
│   │   ├── SupplierModal.jsx      # Modal com detalhes
│   │   └── SupplierModal.css
│   │
│   └── 📂 services/               # Lógica de negócio
│       └── supabaseClient.js      # Cliente Supabase
│
├── 📂 public/
│   └── _redirects                 # Redirect SPA (Netlify)
│
├── 📄 index.html                  # HTML principal
│
├── 📄 README.md                   # Documentação principal
├── 📄 GUIA_RAPIDO.md             # Guia de início rápido
├── 📄 SUPABASE_SETUP.md          # Setup banco de dados
├── 📄 DEPLOY_NETLIFY.md          # Guia de deploy
├── 📄 ARQUITETURA.md             # Este arquivo
└── 📄 ADICIONAR_FORNECEDORES.md  # Como adicionar fornecedores
```

## 🔐 Fluxo de Segurança (RLS)

### Autenticação
```
1. Usuário faz login
2. Supabase gera JWT Token
3. Token armazenado em session
4. Header Authorization: Bearer {token} em cada requisição
```

### Autorização (RLS)
```
SELECT * FROM fornecedores
├─ RLS Check: ✅ Usuário autenticado? SIM
└─ Resultado: Retorna todos os fornecedores

SELECT * FROM favoritos WHERE user_id = ...
├─ RLS Check: ✅ auth.uid() = user_id? SIM
└─ Resultado: Retorna favoritos do usuário

INSERT INTO favoritos
├─ RLS Check: ✅ auth.uid() = user_id? SIM
└─ Resultado: Insere com sucesso

DELETE FROM favoritos
├─ RLS Check: ✅ auth.uid() = user_id? SIM
└─ Resultado: Deleta com sucesso
```

## 🧩 Componentes e Responsabilidades

### App.jsx
**Responsabilidade**: Autenticação global e roteamento
```
- useEffect: Verifica sessão ao montar
- onAuthStateChange: Escuta mudanças de auth
- Renderiza condicional: Login ou Dashboard
```

### Login.jsx
**Responsabilidade**: Autenticação de usuários
```
- Estado: email, password, isLoading, error, isSignUp
- signUp: Cria nova conta
- signIn: Autentica usuário existente
- Validação: Email, Senha
```

### Dashboard.jsx
**Responsabilidade**: Página principal (grid, busca, favoritos)
```
- Estado: suppliers, favorites, searchTerm, selectedSupplier
- loadData: Busca fornecedores e favoritos
- handleToggleFavorite: Adiciona/remove dos favoritos
- handleCardClick: Abre modal
- Filtragem: Por busca e favoritos
```

### SupplierCard.jsx
**Responsabilidade**: Renderizar um card de fornecedor
```
- Props: supplier, isFavorite, onCardClick, onFavoriteToggle
- Exibe: Logo, nome, descrição
- Ações: Click para abrir modal, favoritar
```

### SupplierModal.jsx
**Responsabilidade**: Modal com detalhes do fornecedor
```
- Props: supplier, isOpen, onClose
- Exibe: Informações completas, instruções
- Ação: Botão para abrir fornecedor em nova aba
```

### Navbar.jsx
**Responsabilidade**: Barra de navegação
```
- Props: user, onLogout
- Exibe: Logo, email do usuário
- Ação: Logout
```

### supabaseClient.js
**Responsabilidade**: Inicializar cliente Supabase
```
- Cria instância do cliente
- Exporta para uso em toda app
- Variáveis de ambiente
```

## 🔄 Estado Global (sem Redux/Context)

O projeto usa **prop drilling** simples. Para escalar:

### Opção 1: Context API
```jsx
const AuthContext = createContext();
const FavoritesContext = createContext();

// Usar em todos os componentes
```

### Opção 2: Zustand (recomendado)
```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  favorites: [],
  toggleFavorite: (id) => { /* lógica */ }
}));
```

## 🧪 Métodos Supabase Usados

### Autenticação
```javascript
supabase.auth.signUp()           // Registrar
supabase.auth.signInWithPassword() // Login
supabase.auth.signOut()          // Logout
supabase.auth.getSession()       // Verificar sessão
supabase.auth.onAuthStateChange()// Escutar mudanças
```

### Database
```javascript
supabase.from('table').select()  // SELECT
supabase.from('table').insert()  // INSERT
supabase.from('table').delete()  // DELETE
.eq('column', value)             // WHERE column = value
.order('column')                 // ORDER BY
```

## 📊 Schema do Banco de Dados

### Tabela: fornecedores
```sql
┌─────────────────────────────────────────┐
│          fornecedores                   │
├─────────────────────────────────────────┤
│ id (BIGINT) [PK]                        │
│ nome (VARCHAR) [NOT NULL, INDEX]        │
│ descricao (TEXT) [NOT NULL]             │
│ url (VARCHAR) [NOT NULL]                │
│ instrucoes (TEXT) [NOT NULL]            │
│ logo_url (VARCHAR)                      │
│ created_at (TIMESTAMP)                  │
│ updated_at (TIMESTAMP)                  │
└─────────────────────────────────────────┘
```

### Tabela: favoritos
```sql
┌─────────────────────────────────────────┐
│          favoritos                      │
├─────────────────────────────────────────┤
│ id (BIGINT) [PK]                        │
│ user_id (UUID) [FK, NOT NULL, INDEX]    │
│ fornecedor_id (BIGINT) [FK, NOT NULL]   │
│ created_at (TIMESTAMP)                  │
│ UNIQUE(user_id, fornecedor_id)          │
└─────────────────────────────────────────┘
```

## 🎨 Estilo & CSS

### Organização
```
index.css                 # Variáveis CSS + utilitários
Component.css             # Estilos específicos do componente

Classes:
  .container              # Max width
  .card                   # Estilo padrão de card
  .grid-cols-X            # Grid responsivo
  .btn                    # Botões
  .flex / .flex-col       # Flexbox utilities
```

### Sistema de Cores (CSS Variables)
```css
--primary: #2563eb       /* Azul principal */
--primary-dark: #1d4ed8  /* Azul escuro */
--secondary: #1f2937     /* Cinza escuro */
--success: #10b981       /* Verde */
--danger: #ef4444        /* Vermelho */
--light: #f3f4f6         /* Cinza claro */
```

## 📱 Responsividade

### Breakpoints
```css
Mobile-first approach:
- 0px+      → Mobile (padrão)
- 640px+    → Tablet pequeno
- 768px+    → Tablet
- 1024px+   → Desktop
- 1280px+   → Desktop grande
```

### Ajustes Principais
```
Grid: auto-fill minmax(280px, 1fr) → 1fr em mobile
Navbar: flex-wrap em 640px
Modal: 90vw em mobile, 600px max em desktop
Search: 100% em mobile, flex: 1 em desktop
```

## 🚀 Performance

### Otimizações Implementadas
```
✅ Lazy loading de componentes (React.lazy)
✅ CSS minificado em produção (Vite)
✅ Assets com hash para cache busting
✅ RLS no banco (sem dados sensíveis no frontend)
✅ Sem re-renders desnecessários
```

### Melhorias Futuras
```
⬜ Image optimization (next/image)
⬜ Code splitting por rota
⬜ Service Worker / PWA
⬜ Infinite scroll em tabelas grandes
⬜ Memoização com useMemo / useCallback
```

## 🔌 Extensibilidade

### Adicionar Nova Funcionalidade

#### 1. Nova Página
```
1. Criar /pages/NovaPagina.jsx
2. Criar /pages/NovaPagina.css
3. Importar em App.jsx
4. Adicionar rota
```

#### 2. Novo Componente
```
1. Criar /components/NovoComponent.jsx
2. Criar /components/NovoComponent.css
3. Definir props e handlers
4. Reutilizar em múltiplos lugares
```

#### 3. Novo Método Supabase
```
1. Adicionar em supabaseClient.js ou novo arquivo
2. Exportar função
3. Usar em componentes
4. Tratar erros
```

#### 4. Nova Tabela
```
1. Criar SQL no Supabase
2. Adicionar RLS policies
3. Usar em Dashboard ou nova página
4. Atualizar documentação
```

## 📚 Documentação

- **README.md**: Visão geral + instruções
- **GUIA_RAPIDO.md**: 5 minutos para começar
- **SUPABASE_SETUP.md**: Setup banco de dados
- **DEPLOY_NETLIFY.md**: Deploy em produção
- **ARQUITETURA.md**: Este arquivo
- **ADICIONAR_FORNECEDORES.md**: Como estender

## 🔍 Debugging

### Browser DevTools
```
F12 → Network → Ver requisições Supabase
F12 → Console → Logs e erros
F12 → Storage → Session/JWT token
F12 → Application → Cookies
```

### Supabase Studio
```
Acesso direto ao banco
SQL Editor para queries
Auth para gerenciar usuários
Logs de requisições
```

### Logs Locais
```javascript
console.log('variável:', variável);
console.error('erro:', erro);
// Remover em produção ou usar DEBUG env var
```

## 🎓 Padrões Usados

- **Componentes Funcionais**: Todos usam hooks (useState, useEffect)
- **Props Drilling**: Simples para projeto pequeno
- **CSS Modules**: Escopo local (se precisar, converter para CSS Modules)
- **Async/Await**: Promises com async/await
- **Try/Catch**: Tratamento de erros
- **Mobile-First**: CSS responsivo começando do mobile

---

**Pronto para escalar e estender! 🚀**
