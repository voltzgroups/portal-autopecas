# AutoHub - Portal de Autopeças B2B 🚗

Um sistema web moderno para gerenciar e acessar fornecedores de autopeças, construído com **React (Vite)** e **Supabase**.

## 🎯 Funcionalidades

- ✅ **Autenticação Segura**: Login com email/senha via Supabase Auth
- ✅ **Dashboard Moderno**: Interface estilo SaaS com cards responsivos
- ✅ **Busca e Filtro**: Encontre fornecedores por nome ou descrição
- ✅ **Sistema de Favoritos**: Salve seus fornecedores preferidos
- ✅ **Modal Informativo**: Veja detalhes completos antes de acessar
- ✅ **Links Seguros**: Abra fornecedores em nova aba
- ✅ **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Deploy Pronto**: Configurado para Netlify

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI library
- **Vite** - Build tool rápido
- **CSS3** - Estilos modernos com variáveis CSS
- **Lucide React** - Ícones SVG

### Backend
- **Supabase** - Firebase alternativa
  - PostgreSQL para banco de dados
  - Auth para autenticação
  - RLS (Row Level Security) para segurança

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta no Supabase (gratuita)

## 🚀 Início Rápido

### 1. Clonar o Projeto

```bash
git clone https://github.com/seu-usuario/portal-autopeças.git
cd portal-autopeças
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Supabase

Siga o guia completo em [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Criar conta no Supabase
2. Obter credenciais (URL e Anon Key)
3. Criar tabelas (SQL scripts inclusos)
4. Inserir fornecedores iniciais

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

### 5. Executar Localmente

```bash
npm run dev
```

Acesse: http://localhost:5173

## 📁 Estrutura do Projeto

```
portal-autopeças/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Barra de navegação
│   │   ├── Navbar.css
│   │   ├── SupplierCard.jsx        # Card do fornecedor
│   │   ├── SupplierCard.css
│   │   ├── SupplierModal.jsx       # Modal com detalhes
│   │   └── SupplierModal.css
│   ├── pages/
│   │   ├── Login.jsx               # Página de login
│   │   ├── Login.css
│   │   ├── Dashboard.jsx           # Página principal
│   │   └── Dashboard.css
│   ├── services/
│   │   └── supabaseClient.js       # Cliente Supabase
│   ├── App.jsx                     # Componente raiz
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Estilos globais
├── public/
│   └── _redirects                  # Config Netlify
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .env.local                      # Não commit!
├── SUPABASE_SETUP.md               # Guia Supabase
├── DEPLOY_NETLIFY.md               # Guia Deploy
└── README.md                       # Este arquivo
```

## 💻 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor local em http://localhost:5173

# Build
npm run build        # Compila para produção em ./dist

# Preview
npm run preview      # Visualiza build local

# Lint (se configurado)
npm run lint         # Verifica código
```

## 🎨 Design

### Cores
- **Primária**: `#2563eb` (Azul)
- **Secundária**: `#1f2937` (Cinza escuro)
- **Sucesso**: `#10b981` (Verde)
- **Perigo**: `#ef4444` (Vermelho)

### Componentes
- **Cards**: Hover com elevação e borda colorida
- **Modal**: Overlay escuro com animação slide-up
- **Botões**: Estados hover e active bem definidos
- **Inputs**: Focus com box-shadow e mudança de cor

## 🔐 Segurança

- **RLS (Row Level Security)**: Apenas usuários veem seus dados
- **Autenticação**: Via Supabase Auth
- **Envio Seguro**: Credenciais de ambiente
- **Validação**: Inputs sanitizados no cliente

## 📊 Banco de Dados

### Tabela: `fornecedores`
```sql
id              BIGINT PRIMARY KEY
nome            VARCHAR(255)
descricao       TEXT
url             VARCHAR(500)
instrucoes      TEXT
logo_url        VARCHAR(500)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabela: `favoritos`
```sql
id              BIGINT PRIMARY KEY
user_id         UUID (FK: auth.users)
fornecedor_id   BIGINT (FK: fornecedores)
created_at      TIMESTAMP
UNIQUE(user_id, fornecedor_id)
```

## 🌐 Deploy

### Netlify (Recomendado)

Siga o guia completo em [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)

**Resumo rápido:**

1. Fazer push para GitHub
2. Conectar repositório no Netlify
3. Configurar variáveis de ambiente
4. Fazer deploy automático

**URLs importantes:**
- Site: https://seu-site.netlify.app
- Admin: https://app.netlify.com

### Outras Plataformas

Compatível com qualquer plataforma que suporte:
- Node.js 16+
- Build command: `npm run build`
- Output directory: `dist`

Exemplos: Vercel, GitHub Pages, AWS Amplify, etc.

## 📝 Como Usar

### 1. Fazer Login

```
Email: seu@email.com
Senha: sua_senha
```

**Primeira vez?** Clique em "Não tem conta? Cadastre-se"

### 2. Explorar Fornecedores

- Veja todos os fornecedores em cards
- Use a barra de busca para filtrar
- Clique no coração para adicionar aos favoritos

### 3. Acessar um Fornecedor

1. Clique no card do fornecedor
2. Leia as instruções de acesso no modal
3. Clique em "Abrir Fornecedor"
4. Será aberto em uma nova aba

### 4. Gerenciar Favoritos

- Clique no coração nos cards para favoritar
- Filtre por "Favoritos" no botão na barra
- Sua lista é salva no banco de dados

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
**Solução**: Crie `.env.local` com suas credenciais Supabase

### Erro: "Não consigo fazer login"
**Solução**: 
- Verifique email/senha
- Certifique-se que Email Auth está habilitado no Supabase
- Limpe cookies e tente novamente

### Erro: "Tabelas não encontradas"
**Solução**: Execute os scripts SQL no Supabase conforme [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Página em branco após fazer deploy
**Solução**: Verifique arquivo `_redirects` ou `netlify.toml`

## 📚 Documentação

- [Supabase Setup](./SUPABASE_SETUP.md) - Configurar banco de dados
- [Deploy Netlify](./DEPLOY_NETLIFY.md) - Fazer deploy
- [React Docs](https://react.dev) - Documentação React
- [Vite Docs](https://vitejs.dev) - Documentação Vite
- [Supabase Docs](https://supabase.com/docs) - Documentação Supabase

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova-feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👨‍💻 Autor

Criado para gerenciamento de fornecedores de autopeças.

**Desenvolvido com ❤️ usando React + Supabase**

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Abra uma Issue no GitHub
3. Consulte a comunidade Supabase

## 🗺️ Roadmap

- [ ] Integração com WhatsApp Web
- [ ] Notificações de atualizações de fornecedores
- [ ] Dashboard admin para gerenciar fornecedores
- [ ] Histórico de acessos
- [ ] Ratings e comentários de fornecedores
- [ ] Download de catálogos PDF
- [ ] Integração com CRM

## ✨ Changelog

### v1.0.0 (2026-04-13)
- ✅ Autenticação Supabase
- ✅ Dashboard com fornecedores
- ✅ Sistema de favoritos
- ✅ Barra de busca e filtro
- ✅ Modal informativo
- ✅ Design responsivo
- ✅ Deploy Netlify pronto

---

**Obrigado por usar AutoHub!** 🎉
