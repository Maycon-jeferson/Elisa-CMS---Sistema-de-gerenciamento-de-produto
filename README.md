# Eliza CMS - Sistema de Gerenciamento de Produtos Naturais

Um sistema moderno e elegante para gerenciamento de produtos naturais, inspirado no design da Natura. Desenvolvido com Next.js, TypeScript e Framer Motion para uma experiência de usuário excepcional.

## ✨ Características

- **Design Inspirado na Natura**: Interface elegante com cores naturais e gradientes suaves
- **Animações Fluidas**: Transições suaves usando Framer Motion
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Autenticação Segura**: Sistema de login administrativo
- **Gestão de Produtos**: CRUD completo para produtos naturais
- **Upload de Imagens**: Suporte para imagens de produtos
- **Interface Moderna**: Componentes elegantes com hover effects

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
- **Headless UI** - Componentes acessíveis

## 📦 Instalação

```bashas
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

1. Crie uma conta no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

## 📱 Funcionalidades

### Para Usuários
- Visualização de produtos naturais
- Filtros por categoria
- Visualização detalhada de imagens
- Interface responsiva

### Para Administradores
- Login seguro
- Criação de produtos
- Edição de informações
- Upload de imagens
- Exclusão de produtos
- Gestão de estoque

## 🎯 Próximas Funcionalidades

- [ ] Sistema de categorias
- [ ] Filtros avançados
- [ ] Sistema de avaliações
- [ ] Relatórios de vendas
- [ ] Integração com pagamentos
- [ ] App mobile

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