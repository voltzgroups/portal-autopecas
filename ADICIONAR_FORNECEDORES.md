# ➕ Adicionar Novos Fornecedores

## 📌 Formas de Adicionar Fornecedores

### Opção 1: SQL Direto (Recomendado para Admin)

**Local**: Supabase → SQL Editor

#### Um Fornecedor
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Nome do Fornecedor',
  'Descrição breve sobre o fornecedor',
  'https://exemplo.com/login',
  'Instruções de como acessar (ex: Login via CNPJ e senha)',
  'https://logo.png'
);
```

#### Múltiplos Fornecedores
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES 
  (
    'Fornecedor 1',
    'Descrição 1',
    'https://url1.com',
    'Instruções 1',
    'https://logo1.png'
  ),
  (
    'Fornecedor 2',
    'Descrição 2',
    'https://url2.com',
    'Instruções 2',
    'https://logo2.png'
  ),
  (
    'Fornecedor 3',
    'Descrição 3',
    'https://url3.com',
    'Instruções 3',
    'https://logo3.png'
  );
```

---

### Opção 2: Via Admin Dashboard (Futuro)

Será desenvolvido um painel admin para:
- ✅ Criar fornecedores
- ✅ Editar fornecedores
- ✅ Deletar fornecedores
- ✅ Upload de logos
- ✅ Gerenciar acesso de usuários

---

## 📋 Campos Obrigatórios

### Nome
- **Tipo**: VARCHAR(255)
- **Obrigatório**: SIM
- **Exemplo**: "Rufato", "CHG Automotiva"
- **Dica**: Mantenha curto e descritivo

### Descrição
- **Tipo**: TEXT
- **Obrigatório**: SIM
- **Exemplo**: "Distribuidor de autopeças B2B com amplo catálogo"
- **Tamanho**: 50-200 caracteres recomendado

### URL
- **Tipo**: VARCHAR(500)
- **Obrigatório**: SIM
- **Formato**: https://exemplo.com
- **Dica**: Sempre usar HTTPS

### Instruções
- **Tipo**: TEXT
- **Obrigatório**: SIM
- **Exemplo**: "Login via CNPJ e senha"
- **Tamanho**: 30-100 caracteres

### Logo URL
- **Tipo**: VARCHAR(500)
- **Obrigatório**: NÃO
- **Padrão**: Placeholder se vazio
- **Formato**: https://exemplo.com/logo.png

---

## 🖼️ Usando Placeholders para Logo

Se não tiver logo, use:

### Placeholder via URL-generator
```
https://via.placeholder.com/150?text=NomeDoFornecedor
```

Exemplo:
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Novo Fornecedor',
  'Descrição',
  'https://exemplo.com',
  'Login via email',
  'https://via.placeholder.com/150?text=NovoFornecedor'
);
```

### Ou deixar vazio
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Novo Fornecedor',
  'Descrição',
  'https://exemplo.com',
  'Login via email',
  NULL  -- Mostrará ícone padrão no card
);
```

---

## 📸 Usando Logotipos Reais

### Upload de Logo no Supabase Storage

#### 1. Criar bucket
No Supabase → Storage → New Bucket
```
Bucket name: logos
Public: Sim
```

#### 2. Upload da logo
```javascript
const { data, error } = await supabase.storage
  .from('logos')
  .upload('fornecedor-nome.png', file);

// URL pública
const logoUrl = `${supabaseUrl}/storage/v1/object/public/logos/fornecedor-nome.png`;
```

#### 3. Usar em INSERT
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Fornecedor',
  'Descrição',
  'https://exemplo.com',
  'Instruções',
  'https://seu-projeto.supabase.co/storage/v1/object/public/logos/fornecedor-nome.png'
);
```

---

## 🔄 Exemplos Completos

### Exemplo 1: Fornecedor Simples
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Peças Rápidas',
  'Distribuidor de peças automotivas com entrega em 24h',
  'https://pecasrapidas.com.br/login',
  'Login via email e senha',
  'https://via.placeholder.com/150?text=PecasRapidas'
);
```

### Exemplo 2: Com Logo Real
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'MegaAuto',
  'Maior catálogo de peças do Brasil',
  'https://megaauto.com.br/b2b',
  'Login via CNPJ: 12.345.678/0001-90',
  'https://megaauto.com.br/logo.png'
);
```

### Exemplo 3: Sem Logo (Null)
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Fornecedor X',
  'Fornecedor em desenvolvimento',
  'https://fornecedor-x.com',
  'Em breve',
  NULL
);
```

### Exemplo 4: Batch com Múltiplos
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES 
  ('Fornecedor A', 'Descrição A', 'https://a.com', 'Login: email', NULL),
  ('Fornecedor B', 'Descrição B', 'https://b.com', 'Login: CNPJ', NULL),
  ('Fornecedor C', 'Descrição C', 'https://c.com', 'Login: CPF', NULL),
  ('Fornecedor D', 'Descrição D', 'https://d.com', 'Login: código', NULL);
```

---

## ✏️ Editar Fornecedor Existente

```sql
UPDATE fornecedores
SET 
  nome = 'Novo Nome',
  descricao = 'Nova descrição',
  url = 'https://novo-url.com',
  instrucoes = 'Novas instruções',
  logo_url = 'https://novo-logo.png',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

---

## 🗑️ Deletar Fornecedor

```sql
-- Deleta fornecedor (seus favoritos serão deletados automaticamente por FK)
DELETE FROM fornecedores
WHERE id = 1;
```

---

## 🔍 Verificar Fornecedores Cadastrados

```sql
-- Ver todos
SELECT id, nome, descricao, url FROM fornecedores ORDER BY nome;

-- Ver com contagem de favoritos
SELECT 
  f.id, 
  f.nome, 
  f.descricao,
  COUNT(fav.id) as total_favoritos
FROM fornecedores f
LEFT JOIN favoritos fav ON f.id = fav.fornecedor_id
GROUP BY f.id, f.nome, f.descricao
ORDER BY total_favoritos DESC;

-- Ver apenas um
SELECT * FROM fornecedores WHERE id = 1;
```

---

## 📱 Testando no Frontend

### 1. Adicionar via SQL
```sql
INSERT INTO fornecedores (nome, descricao, url, instrucoes, logo_url)
VALUES (
  'Teste Fornecedor',
  'Este é um teste',
  'https://teste.com',
  'Teste login',
  NULL
);
```

### 2. Recarregar Dashboard
- Abra o Dashboard
- Clique em "Atualizar" ou recarregue a página (F5)
- Novo fornecedor aparecerá na grid

### 3. Testar Funcionalidades
- ✅ Buscar pelo nome
- ✅ Adicionar aos favoritos
- ✅ Abrir modal
- ✅ Acessar link externo

---

## 🛡️ Boas Práticas

### ✅ Faça
```sql
-- ✅ Validar URLs
https://exemplo.com

-- ✅ Descrições claras
'Distribuidor de peças com 20 anos de mercado'

-- ✅ Instruções específicas
'Login via CNPJ: 12.345.678/0001-90 e senha'

-- ✅ Nomes únicos
'Fornecedor A' é melhor que 'Fornecedor'
```

### ❌ Evite
```sql
-- ❌ URLs sem HTTPS
http://exemplo.com

-- ❌ Descrições muito longas
'Este é um fornecedor que vende peças automotivas para carros...'

-- ❌ Instruções vagas
'Fazer login normalmente'

-- ❌ Nomes duplicados
Dois fornecedores com mesmo nome
```

---

## 🚀 Automação (Futuro)

### Via API (Supabase Functions)
```javascript
// Supabase Edge Function
exports.addSupplier = async (req) => {
  const { nome, descricao, url, instrucoes, logo_url } = req.body;
  
  const { data, error } = await supabase
    .from('fornecedores')
    .insert([{ nome, descricao, url, instrucoes, logo_url }]);
  
  return new Response(JSON.stringify(data));
};
```

### Via Admin Dashboard (Futuro)
```jsx
// Componente para admin adicionar fornecedor
<AdminSupplierForm onSubmit={handleAddSupplier} />
```

---

## 📊 Status Atual

**Fornecedores no Sistema:**
- Rufato
- CHG Automotiva
- (Sua escolha!)

**Próximo Passo**: Adicione mais fornecedores conforme necessário!

---

## 💡 Dicas

1. **Teste Links**: Certifique-se que URL é válida antes de adicionar
2. **Logo Otimizada**: Usar imagens até 200x200px para melhor performance
3. **Descrição Concisa**: 50-100 caracteres é ideal
4. **Instrução Clara**: Seja específico (CNPJ, email, código, etc)
5. **Backup**: Sempre faça backup do banco antes de deletar em massa

---

## 📞 Suporte

Se tiver dúvidas:
1. Verifique exemplos acima
2. Consulte [ARQUITETURA.md](./ARQUITETURA.md) → Schema
3. Abra issue no GitHub
4. Contacte suporte Supabase

---

**Pronto para adicionar fornecedores! 🚗**
