# 🔧 Troubleshooting - Portal Autopeças

Solução rápida para problemas comuns.

---

## ⚡ Problemas Rápidos

### Erro: "Variáveis de ambiente não configuradas"

**Mensagem no console:**
```
Variáveis de ambiente do Supabase não configuradas!
Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local
```

**Solução:**
1. Crie arquivo `.env.local` na raiz do projeto
2. Adicione suas credenciais:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```
3. Reinicie o servidor (`npm run dev`)

**Causa:** Arquivo `.env.local` faltando ou com valor vazio.

---

### Erro: "Cannot find module '@supabase/supabase-js'"

**Solução:**
```bash
npm install @supabase/supabase-js
```

**Causa:** Dependência não instalada.

---

### Erro: "Não consigo fazer login"

**Checklist:**
- [ ] Variáveis de ambiente corretas?
- [ ] Email e senha corretos?
- [ ] Email provider habilitado no Supabase?
- [ ] Primeira vez? Criar conta via "Cadastre-se"
- [ ] Cookies bloqueados no navegador?

**Solução Passo a Passo:**

1. **Verificar credenciais:**
```bash
# No arquivo .env.local
echo VITE_SUPABASE_URL
echo VITE_SUPABASE_ANON_KEY
# Devem ter valores!
```

2. **Verificar Email Provider:**
   - Supabase → Authentication → Providers
   - Email deve estar habilitado (verde)

3. **Limpar cookies:**
   - F12 → Application → Cookies → Delete All
   - Recarregar página

4. **Testar no Supabase Studio:**
   - Ir em: https://app.supabase.io
   - Authentication → Users
   - Ver se usuário foi criado

---

### Erro: "Tabelas não encontradas"

**Mensagem:**
```
relation "fornecedores" does not exist
```

**Solução:**

1. Abra Supabase SQL Editor
2. Execute scripts em [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Verifique:
   - Supabase → Table Editor
   - Deve aparecer `fornecedores` e `favoritos`

**Causa:** Scripts SQL não executados.

---

### Erro: "Página em branco após deploy"

**Solução:**

1. **Verificar Console (F12):**
   - Abrir DevTools
   - Aba Console
   - Procurar por erros vermelhos

2. **Checklist:**
   - [ ] `_redirects` existe em `public/`?
   - [ ] `netlify.toml` está correto?
   - [ ] Variáveis de ambiente configuradas no Netlify?
   - [ ] Build passou? Ver deploy log

3. **Netilify Deploy Log:**
   - Abrir site
   - Aba **Deploys**
   - Clicar no deploy
   - Ver **Deploy log**

---

### Erro: "CORS error" ou "Blocked by CORS"

**Mensagem:**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://seu-site.netlify.app' 
has been blocked by CORS policy
```

**Solução:**

1. **Atualizar Supabase Auth Config:**
   - Supabase → Authentication → URL Configuration
   - Adicionar seu site:
   ```
   https://seu-site.netlify.app
   ```

2. **Aguardar propagação:**
   - Pode levar 5-10 minutos
   - Tente recarregar a página

3. **Verificar .env:**
   - Certifique-se VITE_SUPABASE_URL está correto
   - Sem espaços em branco

---

### Erro: "API Error: Unauthorized"

**Mensagem no Console:**
```
Error: Unauthorized
```

**Possibilidades:**

1. **JWT Token Expirado:**
   - Logout e login novamente
   
2. **RLS Policy Bloqueando:**
   - Verificar políticas em Supabase
   - Ver SQL Editor → RLS Policies

3. **Supabase Key Inválida:**
   - Verificar `VITE_SUPABASE_ANON_KEY`
   - Ir em Supabase → Settings → API
   - Copiar key novamente

---

### Erro: "Cannot read property 'id' of undefined"

**Mensagem:**
```
TypeError: Cannot read property 'id' of undefined
```

**Causa:** Dados carregando antes de estarem prontos.

**Solução:**

```javascript
// ❌ Antes (pode causar erro)
{supplier.id}

// ✅ Depois (seguro)
{supplier?.id}

// ✅ Ou verificar antes
{supplier && supplier.id}
```

---

### Erro: "ReferenceError: supabase is not defined"

**Solução:**

1. Verificar import:
```javascript
// ✅ Correto
import { supabase } from '../services/supabaseClient';

// ❌ Errado
import supabase from '../services/supabaseClient';
```

2. Verificar arquivo `supabaseClient.js`:
```javascript
// Deve ter:
export const supabase = createClient(url, key);
```

---

## 🌐 Problemas de Network

### Conector
<table>
<tr>
<th>Erro</th>
<th>Causa</th>
<th>Solução</th>
</tr>
<tr>
<td>Timeout</td>
<td>Internet lenta</td>
<td>Aguardar ou usar WiFi melhor</td>
</tr>
<tr>
<td>404 Not Found</td>
<td>URL errada</td>
<td>Verificar VITE_SUPABASE_URL</td>
</tr>
<tr>
<td>503 Service Unavailable</td>
<td>Servidor Supabase down</td>
<td>Aguardar ou verificar status.supabase.com</td>
</tr>
<tr>
<td>No connection</td>
<td>Internet offline</td>
<td>Conectar à internet</td>
</tr>
</table>

---

## 💾 Problemas do Banco de Dados

### Não consigo inserir dados

**Checklist:**
- [ ] Tabela existe?
- [ ] Colunas têm tipos corretos?
- [ ] RLS policies permitem INSERT?
- [ ] Está autenticado?

**Testar:**
```sql
-- SQL Editor do Supabase
INSERT INTO fornecedores (nome, descricao, url, instrucoes)
VALUES ('Teste', 'Teste', 'https://teste.com', 'Teste');

SELECT * FROM fornecedores;
```

---

### Favoritos não salvam

**Verificar:**

1. **RLS Policies:**
```sql
-- Deve aparecer uma política assim:
SELECT * FROM favoritos 
-- Políticas devem permitir INSERT/SELECT/DELETE
```

2. **Console (F12):**
```javascript
// Ver erro exato
console.error('Erro:', error.message);
```

3. **Supabase Logs:**
   - Authentication → Logs
   - Ver requisições falhadas

---

### Dados desaparecem após recarregar

**Causa:** Dados salvos apenas no estado React, não no banco.

**Solução:**

```javascript
// ✅ Correto - Salvar no banco
const handleToggleFavorite = async (supplierId) => {
  try {
    const { error } = await supabase
      .from('favoritos')
      .insert([{ user_id, fornecedor_id: supplierId }]);
    
    if (error) throw error;
    setFavorites([...favorites, supplierId]); // Depois atualizar estado
  } catch (error) {
    console.error('Erro:', error);
  }
};

// ❌ Errado - Só no estado
const handleToggleFavorite = (supplierId) => {
  setFavorites([...favorites, supplierId]); // Perdido ao recarregar
};
```

---

## 🎨 Problemas de Estilo

### Estilos CSS não aplicando

**Checklist:**
- [ ] Classe CSS exportada/importada?
- [ ] Arquivo .css importado em component?
- [ ] Sem typo no nome da classe?
- [ ] Especificidade CSS menor?

**Solução:**

```javascript
// ✅ Correto
import './Dashboard.css';

export default function Dashboard() {
  return <div className="dashboard-main"> {/* */} </div>;
}
```

```css
/* Em Dashboard.css */
.dashboard-main {
  /* seus estilos */
}
```

---

### Layout quebrado em mobile

**Testar:**
1. F12 → Toggle device toolbar
2. Simular diferentes resoluções
3. Rodar em celular real

**Checklist:**
- [ ] Meta viewport no HTML?
- [ ] Media queries implementadas?
- [ ] Font size mínimo 16px (previne zoom)?
- [ ] Inputs com min-height 44px?

---

### Cores diferentes em navegadores

**Causa:** Profiles de cor diferentes.

**Solução:**

```css
/* Forçar cores consistentes */
img {
  color-scheme: light dark;
}

/* Testar em Chrome, Firefox, Safari */
```

---

## 📱 Problemas de Responsividade

### Grid não se ajusta

**Verificar:**
```css
/* ✅ Correto */
.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* ❌ Errado */
.grid {
  grid-template-columns: 1fr 1fr 1fr; /* Fixo */
}
```

---

### Modal cortado em mobile

**Solução:**

```css
/* Garantir que modal cabe na tela */
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
  width: 90%;
  max-width: 600px;
}
```

---

## 🔐 Problemas de Segurança

### Erro: "Failed to load a worker script"

**Causa:** Supabase Worker Script bloqueado.

**Solução:**
1. Verificar Content Security Policy
2. Adicionar a `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "..."
```

---

### Dados sensíveis expostos

**Checklist:**
- [ ] `.env.local` no `.gitignore`?
- [ ] Sem API keys em componentes?
- [ ] RLS policies ativas?
- [ ] Sem hardcode de secrets?

```bash
# Verificar se .env.local está ignorado
git status
# Não deve aparecer .env.local
```

---

## 🚀 Problemas de Deploy

### Build falha no Netlify

**Verificar:**
1. Log do deploy (Netlify → Deploys → Deploy log)
2. Erros durante `npm run build`

**Solução:**

```bash
# Testar build localmente
npm run build

# Se falhar, ver erro
# Se passar localmente mas falhar no Netlify:
# → Limpar cache: netlify cache:clear
# → Redeployer
```

---

### Site mostra versão antiga

**Causa:** Cache do navegador.

**Solução:**
1. Hard refresh: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
2. Limpar cookies/cache do site
3. Modo incógnito
4. Aguardar propagação de CDN (5-10 min)

---

### Deploy lento

**Dicas:**
- Instalar Netlify CLI localmente
- Desabilitar build desnecessários
- Otimizar dependências (`npm audit`)

---

## 🤔 Problemas Estranhos

### "Funciona em dev mas não em prod"

**Checklist:**
- [ ] Variáveis de ambiente diferentes?
- [ ] API URLs diferentes?
- [ ] Permissões diferentes?
- [ ] Dados antigos em cache?

**Solução:**

```javascript
// Logar variáveis de ambiente
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);

// Não deve aparecer undefined
```

---

### Modal fica por trás do conteúdo

**Solução:**

```css
.modal-backdrop {
  z-index: 1000; /* Maior que outros elementos */
  position: fixed;
}
```

---

### Botão de logout não funciona

**Verificar:**

```javascript
// ✅ Correto
const handleLogout = async () => {
  await supabase.auth.signOut();
  onLogout(); // Callback do parent
};

// ❌ Errado
const handleLogout = () => {
  // Faltou await supabase.auth.signOut()
  onLogout();
};
```

---

## 📋 Checklist de Debug

Antes de reportar um bug:

- [ ] Recarregar a página (F5)
- [ ] Limpar cookies (F12 → Application → Clear storage)
- [ ] Testar em modo incógnito
- [ ] Verificar console (F12 → Console)
- [ ] Testar em outro navegador
- [ ] Ver Network tab para erros de API
- [ ] Verificar Supabase logs
- [ ] Fazer um `npm run build` local
- [ ] Reiniciar `npm run dev`
- [ ] Reiniciar máquina (último recurso!)

---

## 🎯 Quando Procurar Ajuda

Se ainda não resolveu:

1. Procure em [Documentação Supabase](https://supabase.com/docs)
2. Procure em [React Docs](https://react.dev)
3. Procure em [Stack Overflow](https://stackoverflow.com)
4. Abra issue no [Repositório GitHub](https://github.com)
5. Contacte [Supabase Support](https://supabase.com/support)

---

**Boa sorte! 🚀**
