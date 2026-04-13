# Setup Supabase - Portal Autopeças

## 1. Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Sign Up"
3. Crie uma conta com sua escolha de autenticação
4. Crie um novo projeto (escolha uma região próxima)

## 2. Obter Credenciais

1. No painel do Supabase, acesse **Settings** → **API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Cole em `.env.local`:

```env
VITE_SUPABASE_URL=https://sua-instancia.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

## 3. Criar Tabelas

### Tabela: `fornecedores`

1. Acesse **SQL Editor** no Supabase
2. Execute o seguinte SQL:

```sql
-- Criar tabela fornecedores
CREATE TABLE fornecedores (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  instrucoes TEXT NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar índices
CREATE INDEX idx_fornecedores_nome ON fornecedores(nome);

-- Enable RLS (Row Level Security)
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer usuário autenticado pode ver fornecedores
CREATE POLICY "Fornecedores visíveis para usuários autenticados"
ON fornecedores FOR SELECT
TO authenticated
USING (true);
```

### Tabela: `favoritos`

```sql
-- Criar tabela favoritos
CREATE TABLE favoritos (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fornecedor_id BIGINT NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, fornecedor_id)
);

-- Adicionar índices
CREATE INDEX idx_favoritos_user_id ON favoritos(user_id);
CREATE INDEX idx_favoritos_fornecedor_id ON favoritos(fornecedor_id);

-- Enable RLS
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver seus próprios favoritos
CREATE POLICY "Favoritos apenas do usuário"
ON favoritos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Usuários só podem inserir seus próprios favoritos
CREATE POLICY "Inserir próprios favoritos"
ON favoritos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só podem deletar seus próprios favoritos
CREATE POLICY "Deletar próprios favoritos"
ON favoritos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## 4. Inserir Fornecedores Iniciais

Execute no **SQL Editor**:

```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES 
  (
    'Rufato',
    'Distribuidor de autopeças B2B com amplo catálogo de peças para diversos modelos de veículos.',
    'https://www.b2brufato.com.br/Rufato_B2B/PAGE_Login/0J8AAKiX4QHDAg',
    'Login via email e senha. Utilize suas credenciais cadastradas no sistema.',
    'https://via.placeholder.com/150?text=Rufato'
  ),
  (
    'CHG Automotiva',
    'Loja B2B especializada em peças automotivas com entrega rápida e suporte ao cliente.',
    'https://loja.chg.com.br/entrada',
    'Login via CNPJ e senha. Insira seu número de CNPJ e a senha da sua conta.',
    'https://via.placeholder.com/150?text=CHG'
  );
```

## 5. Configurar Autenticação

1. No Supabase, acesse **Authentication** → **Providers**
2. Habilite **Email**
3. Acesse **Auth** → **URL Configuration**
4. Adicione as URLs do seu site (para desenvolvimento e produção)

### URLs Recomendadas:

**Desenvolvimento:**
```
Site URL: http://localhost:5173
Redirect URLs: http://localhost:5173
```

**Produção (Netlify):**
```
Site URL: https://seu-site.netlify.app
Redirect URLs: https://seu-site.netlify.app
```

## 6. Políticas de Segurança (RLS)

As políticas já foram criadas acima, mas aqui está o resumo:

- **fornecedores**: Visível para todos os usuários autenticados (somente leitura)
- **favoritos**: Cada usuário só pode ver e gerenciar seus próprios favoritos

## 7. Testar Conexão

1. Preencha o `.env.local` com suas credenciais
2. Execute `npm run dev`
3. Faça login com um email/senha
4. Você deve ver os fornecedores listados no dashboard

## Troubleshooting

### "Variáveis de ambiente não configuradas"
- Verifique se o `.env.local` está na raiz do projeto
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### "Erro de autenticação"
- Verifique as credenciais em `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Certifique-se de que o Email provider está habilitado

### "Tabelas não encontradas"
- Execute novamente os scripts SQL
- Verifique se você está no banco de dados correto

## Próximos Passos

1. Configurar um email customizado para recuperação de senha (Supabase Email Templates)
2. Adicionar mais fornecedores conforme necessário
3. Implementar webhooks para sincronização com sistemas externos
4. Configurar backup automático do banco de dados
