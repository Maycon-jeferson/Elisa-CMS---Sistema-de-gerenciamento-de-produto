# 🚀 Guia de Configuração Inicial - Eliza CMS

## Passo a Passo Completo

### 1. Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase
- Git instalado

### 2. Clone e Instalação

```bash
# Clone o repositório
git clone https://github.com/Maycon-jeferson/elizacms.git
cd elizacms

# Instale as dependências
npm install
```

### 3. Configuração do Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote a URL e a chave anônima do projeto

### 4. Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 5. Configuração do Banco de Dados

No SQL Editor do Supabase, execute os scripts na seguinte ordem:

#### 5.1 Tabela de Produtos
Execute o conteúdo de `storage_setup_dev.sql` (para desenvolvimento) ou `storage_setup.sql` (para produção).

#### 5.2 Tabela de Configurações
Execute o conteúdo de `database_setup.sql`.

#### 5.3 Tabela de Admins
Execute o conteúdo de `admins_setup.sql`.

### 6. Configuração do Storage

1. No Supabase, vá para **Storage**
2. Crie um bucket chamado `produtos`
3. Marque como **público**
4. Configure o limite de arquivo para 5MB
5. Configure os tipos MIME permitidos como `image/*`

### 7. Teste a Instalação

```bash
# Execute o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 8. Primeiro Login

Use as credenciais padrão:
- **E-mail**: `admin@elizacms.com`
- **Senha**: `admin123`

### 9. Alterar Senha (Recomendado)

1. Faça login com as credenciais padrão
2. Use o componente AdminManager para criar um novo admin
3. Faça logout e faça login com o novo admin
4. Remova o admin padrão se desejar

## 🐛 Troubleshooting

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se a URL e chave estão corretas no Supabase

### Erro de Upload de Imagens
- Verifique se o bucket `produtos` foi criado
- Confirme se o bucket é público
- Verifique as políticas RLS

### Erro de Login
- Execute novamente o script `admins_setup.sql`
- Verifique se a tabela `admins` foi criada
- Confirme se o admin padrão foi inserido

### Erro de RLS
- Verifique se as políticas foram criadas corretamente
- Execute `SELECT * FROM pg_policies WHERE tablename = 'admins';`

## 📚 Próximos Passos

1. **Personalize o site**: Use as configurações para alterar textos e informações
2. **Adicione produtos**: Crie seus primeiros produtos
3. **Configure domínio**: Configure seu domínio personalizado
4. **Deploy**: Faça deploy em Vercel, Netlify ou outro serviço

## 🔒 Segurança em Produção

1. Altere as credenciais padrão
2. Configure HTTPS
3. Remova o componente AdminManager
4. Configure backups automáticos
5. Monitore logs de acesso

---

**Eliza CMS** - Sistema de Gerenciamento de Produtos Naturais
Configuração inicial para projetos open source 