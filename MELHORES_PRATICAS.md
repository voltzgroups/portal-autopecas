# ⭐ Melhores Práticas - Portal Autopeças

## 🎯 Guia de Desenvolvimento

Este documento descreve as melhores práticas adotadas no projeto e como mantê-las.

---

## 📝 Código

### 1. Nomenclatura

#### Arquivos
```javascript
// ✅ Componentes: PascalCase
components/SupplierCard.jsx
components/SupplierModal.jsx

// ✅ CSS: kebab-case
components/SupplierCard.css

// ✅ Services: camelCase
services/supabaseClient.js

// ✅ Páginas: PascalCase
pages/Dashboard.jsx
pages/Login.jsx
```

#### Variáveis e Funções
```javascript
// ✅ Bom
const [suppliers, setSuppliers] = useState([]);
const handleCardClick = () => {};
const isFavorite = true;

// ❌ Ruim
const [supp, setSupp] = useState([]);
const onclick = () => {};
const favorite = true;
```

#### Constantes
```javascript
// ✅ Bom
const MAX_SUPPLIERS = 100;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PRIMARY_COLOR = '#2563eb';

// ❌ Ruim
const max_suppliers = 100;
const supabase_url = import.meta.env.VITE_SUPABASE_URL;
```

### 2. Comentários

#### Arquivo Principal
```javascript
/**
 * Dashboard.jsx - Página principal do portal
 * Exibe fornecedores, barra de busca e sistema de favoritos
 */
```

#### Função Complexa
```javascript
/**
 * Filtra fornecedores por termo de busca e favoritos
 * @param {Array} suppliers - Lista de fornecedores
 * @param {string} searchTerm - Termo de busca
 * @param {Array} favorites - IDs dos favoritos
 * @returns {Array} Fornecedores filtrados
 */
const filteredSuppliers = suppliers.filter((supplier) => {
  // ...
});
```

#### Lógica Não Óbvia
```javascript
// RLS Check: Supabase automaticamente valida se o usuário é o proprietário
const { error } = await supabase
  .from('favoritos')
  .delete()
  .eq('user_id', user.id)
  .eq('fornecedor_id', supplierId);
```

#### ❌ O que Evitar
```javascript
// ❌ Comentários óbvios
const name = supplier.name; // Pega o nome

// ❌ Comentários desatualizados
// TODO: Fazer isso em 2024
// FIXME: Bug que precisa consertar (from 2023)

// ❌ Comentários em excesso
// Loop através de cada fornecedor
suppliers.forEach((supplier) => {
```

### 3. Estrutura de Código

#### Ordem de Imports
```javascript
// 1. React e bibliotecas externas
import React, { useState, useEffect } from 'react';
import { Search, Heart } from 'lucide-react';

// 2. Modules internos
import { supabase } from '../services/supabaseClient';

// 3. Componentes
import SupplierCard from '../components/SupplierCard';
import Navbar from '../components/Navbar';

// 4. Estilos
import './Dashboard.css';
```

#### Ordem de Declarações em Componente
```javascript
export default function Dashboard({ user, onLogout }) {
  // 1. Estado
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Effects
  useEffect(() => {
    loadData();
  }, []);

  // 3. Handlers
  const handleCardClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  // 4. Lógica/Computações
  const filteredSuppliers = suppliers.filter(/*...*/);

  // 5. Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}
```

### 4. Tratamento de Erros

```javascript
// ✅ Bom - Try/Catch com mensagem clara
const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*');
    
    if (error) throw error;
    setSuppliers(data);
  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error);
    alert('Erro ao carregar fornecedores. Tente novamente.');
  }
};

// ❌ Ruim - Sem tratamento
const loadData = async () => {
  const { data } = await supabase.from('fornecedores').select('*');
  setSuppliers(data);
};
```

### 5. Performance

```javascript
// ✅ Bom - Usar keys em listas
{suppliers.map((supplier) => (
  <SupplierCard key={supplier.id} supplier={supplier} />
))}

// ❌ Ruim - Usar index como key
{suppliers.map((supplier, index) => (
  <SupplierCard key={index} supplier={supplier} />
))}

// ✅ Bom - Evitar criação de funções inline
const handleClick = () => setIsOpen(true);
<button onClick={handleClick}>Clique</button>

// ❌ Ruim - Função inline a cada render
<button onClick={() => setIsOpen(true)}>Clique</button>
```

---

## 🎨 CSS e Estilos

### 1. Convenções CSS

```css
/* ✅ Bom - BEM-like naming */
.supplier-card { }
.supplier-card__header { }
.supplier-card__content { }
.supplier-card:hover { }

/* ✅ Bom - Utility classes */
.flex { }
.gap-2 { }
.mb-4 { }

/* ❌ Ruim - Nomes não descritivos */
.main { }
.header { }
.btn-style { }

/* ❌ Ruim - Cores hardcoded */
.card {
  background-color: #2563eb;  /* Use variáveis CSS */
}
```

### 2. Variáveis CSS

```css
/* ✅ Usar variáveis para tudo reutilizável */
:root {
  --primary: #2563eb;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.component {
  color: var(--primary);
  padding: var(--spacing-2);
  box-shadow: var(--shadow-md);
}

/* ❌ Evitar valores hardcoded */
.component {
  color: #2563eb;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3. Responsividade

```css
/* ✅ Mobile-first approach */
.grid {
  grid-template-columns: 1fr;  /* Mobile */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);  /* Tablet */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);  /* Desktop */
  }
}

/* ❌ Evitar Desktop-first */
.grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 4. Organização de CSS

```css
/* 1. Seletor base */
.component {
  /* Layout: position, display, grid, flex */
  display: flex;
  
  /* Box: width, height, padding, margin, border */
  width: 100%;
  padding: 1rem;
  
  /* Tipografia: font, color, text */
  font-size: 1rem;
  color: var(--text);
  
  /* Visual: background, shadow, opacity */
  background: white;
  box-shadow: var(--shadow-sm);
  
  /* Animação */
  transition: all 0.2s ease;
}

/* 2. Pseudo-classes */
.component:hover {
  box-shadow: var(--shadow-md);
}

.component:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--focus-ring);
}

/* 3. Estados */
.component.active {
  background: var(--primary);
}

.component.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 4. Responsivo */
@media (max-width: 768px) {
  .component {
    padding: 0.75rem;
  }
}
```

---

## 🗂️ Organização de Pasta

### Estrutura Recomendada
```
src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   └── Header.test.jsx
│   ├── Card/
│   │   ├── Card.jsx
│   │   └── Card.css
│   └── Button/
│       ├── Button.jsx
│       └── Button.css
│
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   └── hooks/ (futuro)
│   └── Login/
│       ├── Login.jsx
│       └── Login.css
│
├── services/
│   ├── supabaseClient.js
│   ├── api.js (futuro)
│   └── auth.js (futuro)
│
├── hooks/ (futuro)
│   ├── useAuth.js
│   └── useFavorites.js
│
├── utils/ (futuro)
│   ├── validators.js
│   └── formatters.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧪 Testes (Futuro)

### Exemplo de Teste
```javascript
// Dashboard.test.jsx
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('deve renderizar fornecedores', () => {
    render(<Dashboard user={{ id: '123' }} onLogout={() => {}} />);
    expect(screen.getByText(/Fornecedores/i)).toBeInTheDocument();
  });
});
```

---

## 🚀 Git e Versionamento

### Commits
```bash
# ✅ Bom - Descritivo e curto
git commit -m "feat: Adicionar sistema de favoritos"
git commit -m "fix: Corrigir erro na validação de email"
git commit -m "refactor: Otimizar query de fornecedores"
git commit -m "docs: Atualizar guia de setup"

# ❌ Ruim - Vago
git commit -m "Update"
git commit -m "Fix bug"
git commit -m "Changes"
```

### Branching Strategy
```bash
# Feature
git checkout -b feature/nova-funcionalidade

# Bug fix
git checkout -b fix/nome-do-bug

# Improvement
git checkout -b improvement/otimizar-performance

# Documentação
git checkout -b docs/atualizar-readme
```

### `.gitignore`
```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
.vscode/
.idea/
*.log
```

---

## 📊 Segurança

### ✅ Faça

```javascript
// ✅ Usar variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ✅ Validar inputs
if (!email.includes('@')) {
  return { error: 'Email inválido' };
}

// ✅ Usar HTTPS
const url = 'https://exemplo.com';

// ✅ RLS no Supabase
CREATE POLICY "Usuário vê apenas seus dados"
ON tabela FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

// ✅ Sanitizar dados no servidor
const { error } = await supabase.rpc('minha_funcao', { param: valor });
```

### ❌ Evite

```javascript
// ❌ Hardcode de credenciais
const apiKey = 'pk_live_123456';

// ❌ Confiar apenas em validação client-side
if (email) {
  // Enviar sem validar servidor
}

// ❌ Usar HTTP
const url = 'http://exemplo.com';

// ❌ Dados sensíveis no localStorage sem encriptação
localStorage.setItem('password', '123456');

// ❌ Comentários com secrets
// API Key: abc123def456
```

---

## ♻️ Escalabilidade

### Quando o Projeto Crescer

#### 1. Context API / Zustand
```javascript
// Quando houver muita prop drilling
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

#### 2. Splitting de Componentes
```javascript
// Dividir componentes grandes
// Dashboard.jsx → Dashboard.jsx + SuppliersList.jsx + SearchBar.jsx
```

#### 3. Custom Hooks
```javascript
// useSuppliers.js
export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  
  const loadSuppliers = async () => {
    // lógica compartilhada
  };
  
  return { suppliers, loadSuppliers };
};
```

#### 4. Supabase Functions
```javascript
// Para lógica server-side pesada
// supabase/functions/processar-dados.js
```

---

## 📚 Documentação

### README Deve Conter
- ✅ O que é o projeto
- ✅ Como instalar
- ✅ Como usar
- ✅ Estrutura de pastas
- ✅ Como contribuir
- ✅ Licença

### Comentários Devem
- ✅ Explicar o "por quê", não o "quê"
- ✅ Ser atualizados com o código
- ✅ Estar em português consistente
- ✅ Ser breves e claros

### Commits Devem
- ✅ Ser atômicos (uma funcionalidade por commit)
- ✅ Ter descrição clara
- ✅ Ter mensagem em português (consistente)
- ✅ Ser frequentes

---

## 🔄 Code Review Checklist

Antes de fazer push:

- [ ] Código segue convenções de nomenclatura
- [ ] Sem console.log em produção
- [ ] Tratamento de erros implementado
- [ ] CSS responsivo testado
- [ ] Sem variáveis de ambiente expostas
- [ ] Comentários explicativos adicionados
- [ ] Commits bem descritos
- [ ] Testes passam (se houver)

---

## 🎓 Padrões de Design

### Observer Pattern (já implementado)
```javascript
// Supabase Auth notifica sobre mudanças
const { data } = supabase.auth.onAuthStateChange((event, session) => {
  // Reagir a mudanças de autenticação
});
```

### Factory Pattern (futuro)
```javascript
// Criar diferentes tipos de cards
const createCard = (type) => {
  switch(type) {
    case 'supplier': return <SupplierCard />;
    case 'featured': return <FeaturedCard />;
  }
};
```

### Singleton Pattern (Supabase Client)
```javascript
// Um único cliente para toda app
export const supabase = createClient(url, key);
```

---

## 🛠️ Ferramentas Recomendadas

### IDE
- **VS Code** com extensões:
  - ESLint
  - Prettier
  - Vetur
  - Thunder Client (para testar APIs)

### Debugging
- **React DevTools** - Inspecionar componentes
- **Redux DevTools** - Estado (futuro)
- **Supabase Studio** - Banco de dados

### Performance
- **Lighthouse** - Auditoria de performance
- **Chrome DevTools** - Network e Memory

---

## 📋 Checklist de Deploy

Antes de fazer deploy:

- [ ] Variáveis de ambiente configuradas
- [ ] Testes passam localmente
- [ ] Build sem warnings: `npm run build`
- [ ] Responsividade testada em mobile
- [ ] Autenticação testada
- [ ] Favoritos testam (add/remove)
- [ ] Links externos abrem em nova aba
- [ ] Sem console.log em produção
- [ ] `.env.local` não está no Git
- [ ] Configurações Supabase atualizadas (URL de redirect)

---

## 📞 Quando Pedir Ajuda

✅ Procure documentação primeiro
✅ Tente isolar o problema
✅ Teste em ambiente local
✅ Verifique os logs (F12)
✅ Busque por erros similares
❌ Não ignore warnings
❌ Não faça push com erros

---

**Mantendo código limpo e profissional! 🚀**
