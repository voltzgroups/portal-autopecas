# Deploy no Netlify - Portal Autopeças

## 1. Preparar o Projeto

### 1.1 Build Local
Primeiro, teste o build localmente:

```bash
npm run build
```

Verifique se foi criada a pasta `dist/` com os arquivos compilados.

### 1.2 Limpar e Verificar
```bash
# Limpar dependências e reinstalar
rm -r node_modules
npm install

# Verificar se tudo está funcionando
npm run build
npm run preview
```

## 2. Preparar Repositório Git

### 2.1 Inicializar Git (se necessário)
```bash
cd portal-autopeças
git init
git add .
git commit -m "Initial commit: Portal autopeças com React + Supabase"
```

### 2.2 Criar `.gitignore`

Certifique-se de que o arquivo existe e contém:

```
# Dependencies
node_modules
.npm

# Production
dist
build

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

### 2.3 Enviar para GitHub/GitLab

```bash
# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/portal-autopeças.git

# Fazer push
git branch -M main
git push -u origin main
```

## 3. Conectar com Netlify

### 3.1 Opção 1: Via Web (Recomendado)

1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Sign up"** (ou faça login)
3. Clique em **"Connect to Git"**
4. Escolha o provedor (GitHub, GitLab, Bitbucket)
5. Autorize o acesso ao Netlify
6. Selecione o repositório `portal-autopeças`
7. Configure as opções de build:
   - **Base directory**: (deixar vazio)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 3.2 Configurar Variáveis de Ambiente

Na tela de build, antes de fazer deploy:

1. Clique em **"Advanced build settings"**
2. Clique em **"New variable"**
3. Adicione as variáveis:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua_chave_publica_aqui
```

4. Clique em **"Deploy site"**

### 3.3 Opção 2: Via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Iniciar deploy
netlify deploy --prod
```

## 4. Configurações Pós-Deploy

### 4.1 Atualizar URL no Supabase

No painel do Supabase, em **Authentication** → **URL Configuration**:

Adicione a URL do seu site:
```
https://seu-site.netlify.app
```

### 4.2 Configurar Redirect (Single Page Application)

No Netlify:

1. Crie um arquivo `public/_redirects`:

```
/* /index.html 200
```

Ou configure em `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4.3 Configurar Headers de Segurança (Opcional)

Crie `netlify.toml` na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 5. Domínio Customizado

### 5.1 Configurar no Netlify

1. Na aba **Site settings** do Netlify
2. Clique em **Domain management**
3. Clique em **Add custom domain**
4. Digite seu domínio
5. Siga as instruções para configurar DNS

### 5.2 Atualizar URL no Supabase

Repita o passo 4.1 com o novo domínio:
```
https://seu-dominio.com
```

## 6. Variáveis de Ambiente por Ambiente

### Desenvolvimento
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=dev-key
```

### Staging
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_staging
```

### Produção
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_producao
```

## 7. Monitoramento

### 7.1 Logs no Netlify
- Acesse **Deploys** → clique no deploy
- Veja **Deploy log** para erros de build

### 7.2 Verificar no Browser
- Abra o Console (F12)
- Verifique se há erros de conexão com Supabase

### 7.3 Testar Funcionalidades
1. **Login**: Teste com email/senha
2. **Dashboard**: Verifique se fornecedores carregam
3. **Favoritos**: Adicione um fornecedor aos favoritos
4. **Modal**: Clique em um fornecedor para abrir o modal
5. **Link Externo**: Teste o botão "Abrir Fornecedor"

## 8. Auto-Deploy

Com a integração Git configurada:

1. Faça um `git push` para `main`
2. Netlify detecta automaticamente
3. Inicia o build
4. Faz deploy automático se bem-sucedido

## 9. Troubleshooting Deploy

### Build falha
```bash
# Verificar build localmente
npm run build

# Limpar cache do Netlify
netlify cache:clear
```

### Variáveis de ambiente não carregam
- Verifique se estão configuradas no Netlify
- Reinicie o deploy
- Use `console.log(import.meta.env)` para debug

### Página em branco
- Verifique `_redirects` ou `netlify.toml`
- Acesse browser console (F12)
- Verifique erros de rede/Supabase

### Autenticação não funciona
- Verifique URL do site em Supabase Auth Config
- Certifique-se das variáveis de ambiente
- Limpe cookies do browser e tente novamente

## 10. Performance

### Otimizações Recomendadas

1. **Build Analysis**
   ```bash
   npm run build -- --analyze
   ```

2. **Compressão automática** (Netlify faz automaticamente)

3. **Cache assets**
   - Netlify CDN cuida disso automaticamente

4. **Monitoring**
   - Acesse Analytics no Netlify
   - Monitore tempo de carregamento

## Checklist Final

- [x] `.env.local` configurado
- [x] `npm run build` funciona
- [x] Repositório no Git
- [x] Conectado ao Netlify
- [x] Variáveis de ambiente no Netlify
- [x] URL adicionada no Supabase
- [x] `_redirects` ou `netlify.toml` configurado
- [x] Domínio customizado (opcional)
- [x] Testadas todas as funcionalidades
- [x] HTTPS ativo (automático no Netlify)

## Links Úteis

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Supabase Hosting](https://supabase.com/docs/guides/hosting)
- [Environment Variables Vite](https://vitejs.dev/guide/env-and-mode.html)

## Suporte

Em caso de problemas:
1. Verifique os logs do deploy no Netlify
2. Consulte a documentação oficial
3. Abra uma issue no repositório GitHub
