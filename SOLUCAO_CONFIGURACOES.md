# 🔧 Solução para Configurações não sendo Modificadas

## Problema Identificado

As configurações do site não estavam sendo salvas no banco de dados porque:

1. **Sistema de Autenticação Incorreto**: As funções `saveSiteSettings` e `updateSiteSettings` estavam verificando autenticação do Supabase, mas o sistema usa autenticação customizada com localStorage.

2. **Possível Falta da Tabela**: A tabela `site_settings` pode não existir no banco de dados.

3. **🚨 NOVO: Políticas RLS Bloqueando Operações**: Row Level Security está habilitado na tabela `site_settings` e bloqueando INSERT/UPDATE.

## Soluções Implementadas

### 1. ✅ Corrigido Sistema de Autenticação

As funções agora verificam a autenticação usando o sistema customizado:

```typescript
// Antes (incorreto)
const { data: { user } } = await supabase.auth.getUser()

// Depois (correto)
const token = localStorage.getItem('admin_token')
const admin = AuthService.verifyToken(token)
```

### 2. ✅ Adicionado Recarregamento Automático

Após salvar as configurações:
- Atualiza o localStorage
- Recarrega a página para aplicar mudanças em todos os componentes

### 3. ✅ Script SQL para Verificar/Criar Tabela

Execute o arquivo `check_site_settings.sql` no SQL Editor do Supabase.

### 4. ✅ Script SQL para Corrigir RLS

Execute o arquivo `fix_site_settings_rls.sql` no SQL Editor do Supabase.

## Passos para Resolver

### Passo 1: Executar Script de RLS (IMPORTANTE!)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Execute o conteúdo do arquivo `fix_site_settings_rls.sql`
4. Este script vai:
   - Verificar o status atual do RLS
   - Remover políticas existentes
   - Desabilitar RLS na tabela site_settings
   - Inserir configurações padrão se necessário

### Passo 2: Verificar Resultado

Após executar o script, você deve ver:
- `RLS DISABLED` com `rowsecurity: false`
- Dados inseridos na tabela

### Passo 3: Testar Configurações

1. Faça login como administrador
2. Clique no ícone de configurações no header
3. Modifique algum campo
4. Clique em "Salvar Configurações"
5. Verifique se a página recarrega e as mudanças aparecem

### Passo 4: Verificar no Banco

Execute esta query no SQL Editor para verificar se os dados foram salvos:

```sql
SELECT * FROM site_settings ORDER BY updated_at DESC;
```

## Por que Desabilitar RLS?

O sistema usa autenticação customizada com localStorage, não o sistema de auth do Supabase. As políticas RLS padrão do Supabase esperam usuários autenticados via `supabase.auth`, mas nosso sistema usa tokens customizados.

**Alternativa**: Se você quiser manter RLS, pode usar as políticas comentadas no final do script `fix_site_settings_rls.sql`.

## Estrutura da Tabela

```sql
CREATE TABLE site_settings (
    id BIGSERIAL PRIMARY KEY,
    whatsapp_number VARCHAR(20) NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    slogan VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Campos Configuráveis

- **whatsapp_number**: Número do WhatsApp (apenas números)
- **site_name**: Nome do site
- **title**: Título principal
- **subtitle**: Subtítulo/descrição
- **slogan**: Slogan da marca

## Debug

Se ainda houver problemas:

1. **Verificar Console**: Abra o DevTools e veja se há erros
2. **Verificar Autenticação**: Confirme se está logado como admin
3. **Verificar Tabela**: Execute `SELECT COUNT(*) FROM site_settings;`
4. **Verificar RLS**: Execute `SELECT rowsecurity FROM pg_tables WHERE tablename = 'site_settings';`

## Logs Úteis

As funções agora logam informações úteis no console:
- "Usuário não autenticado"
- "Token inválido ou expirado"
- "Erro ao salvar configurações"
- "Configurações salvas com sucesso"

## Erro Específico: RLS Policy

Se você ver este erro:
```
new row violates row-level security policy for table "site_settings"
```

**Solução**: Execute o script `fix_site_settings_rls.sql` para desabilitar RLS.

## Próximos Passos

Após resolver:
1. Teste todas as funcionalidades
2. Verifique se as configurações aparecem no header e hero section
3. Teste o WhatsApp com o novo número
4. Confirme que as mudanças persistem após recarregar a página 