# 🚀 Guia Rápido - Portal Autopeças

## ⚡ 5 Minutos para Começar

### 1️⃣ Setup Inicial (2 min)

```bash
# Clonar ou extrair projeto
cd portal-autopeças

# Instalar dependências
npm install
```

### 2️⃣ Configurar Supabase (1 min)

1. Ir em https://supabase.com
2. Criar novo projeto (gratuito)
3. Copiar as credenciais:
   - **Project URL** (VITE_SUPABASE_URL)
   - **Anon Key** (VITE_SUPABASE_ANON_KEY)
4. Criar arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3️⃣ Criar Tabelas no Supabase (1 min)

1. No Supabase → SQL Editor
2. Copiar e executar scripts de [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Pronto! Tabelas criadas

### 4️⃣ Rodar Localmente (1 min)

```bash
npm run dev
```

Acessar: http://localhost:5173

### 5️⃣ Testar

1. **Login**: Criar conta ou fazer login
2. **Dashboard**: Ver fornecedores
3. **Favoritos**: Adicionar aos favoritos (coração)
4. **Modal**: Clicar no card para abrir modal
5. **Link**: Clicar em "Abrir Fornecedor" (abre em nova aba)

---

## 📦 Stack

```
React 18 (Vite) + Supabase (PostgreSQL)
├── Frontend: React, CSS3, Lucide Icons
└── Backend: Supabase Auth + RLS
```

---

## 📂 Principais Pastas

```
/src
  /components     → Card, Modal, Navbar
  /pages         → Login, Dashboard
  /services      → Supabase Client
  App.jsx        → Autenticação e Routing
```

---

## 🎨 Customizações Rápidas

### Trocar Logo/Título

**Em `Navbar.jsx`:**
```jsx
<h1>Seu Título Aqui</h1>
```

### Alterar Cores Principais

**Em `index.css`:**
```css
:root {
  --primary: #2563eb;        /* Azul */
  --primary-dark: #1d4ed8;   /* Azul escuro */
  /* ... mais cores */
}
```

### Adicionar Novo Fornecedor

**No Supabase SQL Editor:**
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Nome do Fornecedor',
  'Descrição',
  'https://link.com',
  'Instruções de login',
  'https://logo.url'
);
```

### Trocar Navbar Color

**Em `Navbar.css`:**
```css
.navbar {
  background: linear-gradient(135deg, #SEU_COR 0%, #SEU_COR_ESCURA 100%);
}
```

---

## 🚢 Deploy (2 passos)

### Opção 1: Netlify (Recomendado)

1. **Push para GitHub**
   ```bash
   git add .
   git commit -m "First commit"
   git push
   ```

2. **Conectar Netlify**
   - https://netlify.com → Connect to Git
   - Selecionar repositório
   - Adicionar variáveis de ambiente
   - Deploy automático! ✅

### Opção 2: Vercel

1. **Fazer push**
2. **https://vercel.com** → Import Git Repository
3. **Configurar variáveis**
4. **Deploy**

---

## 🔑 Variáveis de Ambiente

**Desenvolvimento:**
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=dev-key-local
```

**Produção:**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica
```

⚠️ **NUNCA comite `.env.local` no Git!**

---

## 🧪 Testes Rápidos

```bash
# Build local
npm run build

# Visualizar build
npm run preview

# Verificar se tudo está ok
npm run build && npm run preview
```

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Não conseguo fazer login" | Verifique `.env.local` e email provider no Supabase |
| "Tabelas não encontradas" | Execute scripts SQL em SUPABASE_SETUP.md |
| "Página em branco" | Verifique console (F12) para erros |
| "CORS error" | Verifique URL em Supabase Auth Config |

---

## 📚 Links Importantes

- 📖 [README Completo](./README.md) - Documentação full
- 🗄️ [Supabase Setup](./SUPABASE_SETUP.md) - Banco de dados
- 🚀 [Deploy Netlify](./DEPLOY_NETLIFY.md) - Deploy em produção
- 🎨 [React Docs](https://react.dev)
- ⚡ [Vite Docs](https://vitejs.dev)

---

## 💡 Dicas

✅ **Usar Supabase localmente** → `supabase start` (para debug)

✅ **Verificar RLS policies** → Supabase SQL Editor

✅ **Testar em diferentes resoluções** → F12 → Responsive Design Mode

✅ **Usar Componentes** → Reutilizável e escalável

✅ **Adicionar logs** → `console.log()` no dev, remove em prod

---

## 🎯 Próximos Passos

1. ✅ Setup local
2. ✅ Configurar Supabase
3. ✅ Testar funcionalidades
4. ✅ Customizar (cores, textos, fornecedores)
5. ✅ Fazer deploy
6. 🔜 Monitorar em produção

---

## 📞 Precisa de Ajuda?

1. Leia o [README.md](./README.md) completo
2. Verifique [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Abra issue no GitHub
4. Consulte comunidade Supabase

---

**Happy Coding! 🚀**
