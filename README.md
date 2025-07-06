# Eliza CMS - Sistema de Gerenciamento de Produtos Naturais

Um sistema moderno e elegante para gerenciamento de produtos naturais, inspirado no design da Natura. Desenvolvido com Next.js, TypeScript e Framer Motion para uma experiência de usuário excepcional.

## ✨ Características

- **Design Inspirado na Natura**: Interface elegante com cores naturais e gradientes suaves
- **Animações Fluidas**: Transições suaves usando Framer Motion
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Autenticação Segura**: Sistema de login baseado em banco de dados
- **Gestão de Produtos**: CRUD completo para produtos naturais
- **Upload de Imagens**: Suporte para imagens de produtos
- **Interface Moderna**: Componentes elegantes com hover effects
- **Open Source**: Código aberto e seguro para projetos comerciais
- **Segurança em Produção**: AdminManager automaticamente removido

## 🎨 Design System

### Cores
- **Primária**: `#8b4513` (Marrom natural)
- **Secundária**: `#f4f1eb` (Bege claro)
- **Acento**: `#d2691e` (Laranja terracota)
- **Texto**: `#2c3e50` (Azul escuro)
- **Texto Secundário**: `#7f8c8d` (Cinza)

### Componentes
- **Header**: Navegação elegante com menu mobile
- **Hero Section**: Apresentação impactante com animações
- **Cards de Produtos**: Design moderno com hover effects
- **Modais**: Interface limpa para criação/edição

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Supabase** - Backend e banco de dados
- **Lucide React** - Ícones
- **Bcrypt.js** - Hash de senhas

## 📦 Instalação

```bash
# Clone o repositório
git clone git@github.com:Maycon-jeferson/elizacms.git

# Entre no diretório
cd elizacms

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute o servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração

### 1. Supabase Setup

1. Crie uma conta no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

### 2. Banco de Dados

Execute os scripts SQL na seguinte ordem:

1. **Tabela de produtos**: Execute `storage_setup.sql` ou `storage_setup_dev.sql`
2. **Tabela de configurações**: Execute `database_setup.sql`
3. **Tabela de admins**: Execute `admins_setup.sql`

### 3. Autenticação

Após executar o script `admins_setup.sql`, você terá acesso com:

- **E-mail**: `admin@elizacms.com`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

Para mais detalhes sobre autenticação, consulte [AUTH_SETUP.md](AUTH_SETUP.md).

### 4. Permissões de Administrador

Execute os scripts de permissões para configurar o acesso via interface web:

1. **Permissões para interface web**: Execute `web_admin_permissions.sql`

Para mais detalhes sobre gerenciamento via interface web, consulte [WEB_ADMIN_GUIDE.md](WEB_ADMIN_GUIDE.md).

## 📱 Funcionalidades

### Para Usuários
- Visualização de produtos naturais
- Filtros por categoria
- Visualização detalhada de imagens
- Interface responsiva

### Para Administradores
- Login seguro baseado em banco de dados
- Criação de produtos
- Edição de informações
- Upload de imagens
- Exclusão de produtos
- Gestão de estoque
- Configurações do site
- Gerenciamento de administradores (apenas desenvolvimento)
- **Gerenciamento via interface web** (produção)
- **Funções seguras** para operações no banco
- **Validação de autenticação** em todas as operações

## 🔐 Segurança

- **Autenticação**: Baseada em banco de dados com bcrypt
- **RLS**: Row Level Security configurado
- **Tokens**: JWT simples com expiração
- **Validação**: Todos os formulários validados
- **Open Source**: Código transparente e auditável
- **Produção Segura**: AdminManager automaticamente removido

## 🛠️ Desenvolvimento vs Produção

### Desenvolvimento
- ✅ AdminManager disponível em `/admin`
- ✅ Interface para criar/gerenciar admins
- ✅ Botão de administração visível
- ✅ Logs detalhados

### Produção
- ❌ AdminManager completamente removido
- ❌ Página `/admin` redireciona para home
- ❌ Botão de administração oculto
- ✅ Gerenciamento via interface web
- ✅ Políticas RLS configuradas
- ✅ Funções seguras para operações
- ✅ Validação de autenticação

## 🎯 Próximas Funcionalidades

- [ ] Sistema de categorias
- [ ] Filtros avançados
- [ ] Sistema de avaliações
- [ ] Relatórios de vendas
- [ ] Integração com pagamentos
- [ ] App mobile
- [ ] Autenticação OAuth
- [ ] Logs de auditoria

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Maycon Jeferson**
- GitHub: [@Maycon-jeferson](https://github.com/Maycon-jeferson)

---

Desenvolvido com ❤️ inspirado na beleza e simplicidade da natureza.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.