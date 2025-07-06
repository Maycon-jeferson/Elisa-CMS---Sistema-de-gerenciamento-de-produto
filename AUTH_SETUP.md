# 🔐 Configuração de Autenticação - Eliza CMS

## Visão Geral

O Eliza CMS agora utiliza autenticação baseada no banco de dados através da tabela `admins`, removendo completamente qualquer vestígio de login local. Este sistema é mais seguro e adequado para projetos open source.

## 📋 Pré-requisitos

- Supabase configurado
- Tabela `products` existente
- Tabela `site_settings` existente

## 🚀 Configuração

### 1. Executar Script SQL

Execute o script `admins_setup.sql` no SQL Editor do Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para **SQL Editor** no menu lateral
3. Execute o conteúdo do arquivo `admins_setup.sql`

Este script irá:
- Criar a tabela `admins`
- Configurar RLS (Row Level Security)
- Criar funções para verificação de credenciais
- Inserir um admin padrão

### 2. Credenciais Padrão

Após executar o script, você terá acesso com:

- **E-mail**: `admin@elizacms.com`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

### 3. Estrutura da Tabela `admins`

```sql
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Funcionalidades

### Autenticação
- ✅ Login baseado em banco de dados
- ✅ Hash de senha com bcrypt
- ✅ Tokens JWT simples (base64)
- ✅ Controle de sessão (24 horas)
- ✅ Registro de último login

### Segurança
- ✅ RLS (Row Level Security) configurado
- ✅ Senhas hasheadas com bcrypt
- ✅ Validação de credenciais
- ✅ Controle de admin ativo/inativo
- ✅ AdminManager removido em produção

### Interface
- ✅ Modal de login responsivo
- ✅ Informações do admin logado
- ✅ Botão de logout
- ✅ Gerenciamento de configurações
- ✅ Painel de administração (apenas desenvolvimento)

## 🛠️ Desenvolvimento

### Criar Novo Admin

Use o componente `AdminManager` para criar novos administradores (apenas em desenvolvimento):

```typescript
import AdminManager from '@/components/AdminManager'

// Adicione ao seu componente
<AdminManager />
```

### Página de Administração

Acesse `/admin` para gerenciar administradores (apenas em desenvolvimento):

```typescript
// A página /admin só está disponível em desenvolvimento
// Em produção, redireciona para a página inicial
```

### API de Autenticação

```typescript
import { AuthService } from '@/lib/auth'

// Verificar credenciais
const admin = await AuthService.verifyCredentials(email, password)

// Criar novo admin
const newAdmin = await AuthService.createAdmin(email, password, name)

// Listar admins
const admins = await AuthService.listAdmins()
```

### Contexto de Autenticação

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { isAuthenticated, currentAdmin, login, logout } = useAuth()
```

## 🔒 Segurança em Produção

### 1. Alterar Credenciais Padrão

```sql
-- Altere a senha do admin padrão
UPDATE admins 
SET password_hash = 'novo_hash_aqui' 
WHERE email = 'admin@elizacms.com';
```

### 2. Gerar Hash de Nova Senha

```typescript
import { generatePasswordHash } from '@/lib/auth'

const newHash = await generatePasswordHash('nova_senha_segura')
console.log(newHash) // Use este hash no UPDATE acima
```

### 3. Configurar RLS Adequadamente

Para produção, considere políticas mais restritivas:

```sql
-- Exemplo de política mais restritiva
CREATE POLICY "Apenas admins podem ver admins" ON admins
    FOR SELECT
    USING (auth.role() = 'authenticated');
```

### 4. AdminManager Automaticamente Removido

O AdminManager é automaticamente removido em produção:

```typescript
// O componente verifica o ambiente
if (process.env.NODE_ENV === 'production') {
  return null
}
```

### 5. Gerenciamento de Admins em Produção

Em produção, use o painel administrativo do Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para **Table Editor**
3. Selecione a tabela `admins`
4. Gerencie os administradores diretamente

## 🐛 Troubleshooting

### Erro de Login

1. **Verifique se a tabela existe**:
```sql
SELECT * FROM admins;
```

2. **Verifique se o admin está ativo**:
```sql
SELECT * FROM admins WHERE is_active = true;
```

3. **Teste a função de verificação**:
```sql
SELECT * FROM verify_admin_credentials('admin@elizacms.com', 'hash_da_senha');
```

### Erro de RLS

1. **Verifique as políticas**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'admins';
```

2. **Habilite RLS se necessário**:
```sql
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
```

### Erro de Upload

Se o upload de imagens falhar após a mudança:

1. Verifique se as políticas da tabela `products` estão corretas
2. Confirme se o bucket `produtos` existe
3. Verifique se as permissões estão adequadas

### AdminManager não aparece

Se o AdminManager não aparecer em desenvolvimento:

1. Verifique se `NODE_ENV` está definido como `development`
2. Confirme se você está logado como admin
3. Acesse `/admin` diretamente

## 📝 Logs

O sistema registra logs importantes no console:

- Tentativas de login
- Erros de autenticação
- Criação de admins
- Atualizações de último login

## 🔄 Migração

Se você estava usando o sistema anterior:

1. Execute o script `admins_setup.sql`
2. Remova qualquer código de autenticação local
3. Teste o login com as credenciais padrão
4. Crie novos admins conforme necessário

## 🚀 Deploy

### Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
NODE_ENV=production
```

### Verificações Pós-Deploy

1. **Teste o login** com credenciais válidas
2. **Confirme que o AdminManager não aparece** em produção
3. **Verifique se a página `/admin` redireciona** para a página inicial
4. **Teste as funcionalidades** de criação/edição de produtos

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

**Eliza CMS** - Sistema de Gerenciamento de Produtos Naturais
Autenticação baseada em banco de dados para projetos open source 