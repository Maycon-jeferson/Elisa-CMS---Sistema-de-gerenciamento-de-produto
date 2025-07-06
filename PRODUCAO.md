# 🚀 Eliza CMS - Guia de Produção

## Configuração do Supabase para Produção

### 1. Configurar Storage Bucket

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para **Storage** no menu lateral
3. Clique em **New bucket**
4. Configure:
   - **Name**: `produtos`
   - **Public bucket**: ✅ Marque como público
   - **File size limit**: 5MB (ou conforme necessário)
   - **Allowed MIME types**: `image/*`
5. Clique em **Create bucket**

### 2. Executar Script SQL de Segurança

#### Para Desenvolvimento:
1. Vá para **SQL Editor** no menu lateral
2. Execute o script `storage_setup_dev.sql` que está na raiz do projeto
3. Este script configura políticas mais permissivas para desenvolvimento

#### Para Produção:
1. Vá para **SQL Editor** no menu lateral
2. Execute o script `storage_setup.sql` que está na raiz do projeto
3. Este script configura:
   - RLS (Row Level Security) para a tabela `products`
   - Políticas de segurança para o bucket `produtos`
   - Função para autenticação com chave secreta

### 3. Verificar Tabelas

Certifique-se de que as seguintes tabelas existem:

#### Tabela `products`
```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela `site_settings`
```sql
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  whatsapp_number VARCHAR(20),
  site_name VARCHAR(255),
  title VARCHAR(255),
  subtitle TEXT,
  slogan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Variáveis de Ambiente

### 1. Criar arquivo `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Chave secreta para autenticação (deve ser a mesma do script SQL)
NEXT_PUBLIC_APP_SECRET_KEY=eliza_cms_2024_secure
```

### 2. Atualizar `src/lib/supabase.ts`

Substitua as URLs e chaves hardcoded pelas variáveis de ambiente:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

## Deploy

### Opção 1: Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard do Vercel
3. Deploy automático a cada push

### Opção 2: Netlify

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `.next`

### Opção 3: Servidor Próprio

1. Build do projeto:
```bash
npm run build
npm start
```

## Segurança em Produção

### ✅ Implementado

- **RLS (Row Level Security)**: Todas as operações de escrita requerem chave secreta
- **Autenticação local**: Sistema de login simples para administradores
- **Validação de dados**: Todos os formulários validam entrada
- **Compressão de imagens**: Imagens são comprimidas antes do upload
- **Sanitização**: URLs e dados são sanitizados

### 🔒 Recomendações Adicionais

1. **HTTPS**: Sempre use HTTPS em produção
2. **Rate Limiting**: Configure rate limiting no seu servidor/proxy
3. **CORS**: Configure CORS adequadamente se necessário
4. **Backup**: Configure backups automáticos do Supabase
5. **Monitoramento**: Use ferramentas como Sentry para monitorar erros

## Manutenção

### Backup do Banco

O Supabase oferece backups automáticos, mas você pode exportar dados manualmente:

```sql
-- Exportar produtos
SELECT * FROM products;

-- Exportar configurações
SELECT * FROM site_settings;
```

### Atualizações

1. **Dependências**: Mantenha as dependências atualizadas
2. **Supabase**: O Supabase é atualizado automaticamente
3. **Next.js**: Atualize o Next.js conforme necessário

## Troubleshooting

### Erro de Upload de Imagem

Se o upload de imagens falhar:

1. Verifique se o bucket `produtos` existe
2. Confirme se as políticas RLS estão corretas
3. Verifique se a chave secreta está configurada

### Erro de Autenticação

Se as operações de escrita falharem:

1. Verifique se a função `set_app_secret_key()` existe
2. Confirme se a chave secreta está correta
3. Verifique se as políticas RLS estão ativas

### Performance

Para melhorar a performance:

1. **CDN**: Use CDN para imagens (Supabase já oferece)
2. **Caching**: Configure cache adequado
3. **Otimização**: Use `next/image` para otimização automática

## Suporte

Para suporte técnico ou dúvidas sobre produção, consulte:

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Eliza CMS** - Sistema de Gerenciamento de Produtos Naturais
Desenvolvido com Next.js, Supabase e TypeScript 