# 👨‍💼 Guia do Administrador - Interface Web

## Visão Geral

Este guia explica como o administrador pode gerenciar produtos através da interface web do Eliza CMS, sem necessidade de acesso ao Supabase Dashboard.

## 🔐 Permissões Configuradas

### ✅ O que o administrador pode fazer:
- **Visualizar** todos os produtos (público)
- **Criar** novos produtos (apenas admin autenticado)
- **Editar** produtos existentes (apenas admin autenticado)
- **Excluir** produtos (apenas admin autenticado)
- **Gerenciar** configurações do site (apenas admin autenticado)

### 🛡️ Segurança:
- Políticas RLS configuradas
- Verificação de autenticação via JWT
- Funções seguras no banco de dados
- Validação de admin ativo

## 🚀 Como Acessar

### 1. Login no Sistema
1. Acesse a página principal do Eliza CMS
2. Clique no botão **"Administração"** (visível apenas em desenvolvimento)
3. Use as credenciais:
   - **E-mail**: `admin@elizacms.com`
   - **Senha**: `admin123`

### 2. Interface de Administração
Após o login, você terá acesso a:
- **Tabela de Produtos**: Visualizar e gerenciar produtos
- **Botão "Novo Produto"**: Criar novos produtos
- **Ações por Produto**: Editar e excluir produtos existentes

## 📋 Operações Disponíveis

### Visualizar Produtos
- Todos os produtos são exibidos em uma tabela elegante
- Filtros por categoria disponíveis
- Informações completas: nome, descrição, preço, categoria, estoque
- Visualização de imagens em modal

### Criar Novo Produto
1. Clique no botão **"Novo Produto"**
2. Preencha os campos:
   - **Nome**: Nome do produto (obrigatório)
   - **Descrição**: Descrição detalhada (opcional)
   - **Preço**: Preço em decimal (obrigatório)
   - **Categoria**: Categoria do produto (obrigatório)
   - **Imagem**: Upload de arquivo ou URL (opcional)
   - **Em Estoque**: Marque se está disponível
3. Clique em **"Criar Produto"**

### Editar Produto
1. Clique no ícone de **editar** (lápis) na linha do produto
2. Modifique os campos necessários
3. Clique em **"Salvar Alterações"**

### Excluir Produto
1. Clique no ícone de **excluir** (lixeira) na linha do produto
2. Confirme a exclusão no diálogo
3. O produto será removido permanentemente

## 🎨 Interface e Design

### Design System
- **Cores Naturais**: Marrom, bege e terracota
- **Animações Suaves**: Transições elegantes
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Acessibilidade**: Interface intuitiva e fácil de usar

### Componentes Principais
- **Header**: Navegação e botão de administração
- **Tabela de Produtos**: Lista organizada com filtros
- **Modais**: Interface limpa para criação/edição
- **Filtros**: Seleção por categoria
- **Visualização de Imagens**: Modal para imagens grandes

## 🔧 Funcionalidades Técnicas

### Autenticação Segura
- Login baseado em banco de dados
- Tokens JWT com expiração
- Verificação de admin ativo
- Logout automático

### Operações Seguras
- Todas as operações verificam autenticação
- Funções seguras no banco de dados
- Validação de dados no frontend e backend
- Tratamento de erros robusto

### Upload de Imagens
- Suporte para arquivos de imagem
- Compressão automática
- Armazenamento no Supabase Storage
- URLs públicas para acesso

## 📊 Gerenciamento de Dados

### Estrutura dos Produtos
```typescript
interface Product {
  id: number
  name: string
  description?: string
  price: number
  category: string
  image?: string
  in_stock?: boolean
}
```

### Validações
- **Nome**: Obrigatório, não pode estar vazio
- **Preço**: Obrigatório, deve ser número positivo
- **Categoria**: Obrigatório, não pode estar vazio
- **Descrição**: Opcional
- **Imagem**: Opcional, URL válida ou arquivo
- **Estoque**: Booleano, padrão true

## 🎯 Exemplos de Uso

### Adicionar Produto Natural
1. Clique em **"Novo Produto"**
2. Preencha:
   - Nome: "Óleo Essencial de Lavanda"
   - Descrição: "Óleo essencial 100% natural, extraído de lavanda orgânica"
   - Preço: 45.90
   - Categoria: "Óleos Essenciais"
   - Imagem: Faça upload ou cole URL
   - Em Estoque: ✓
3. Clique em **"Criar Produto"**

### Atualizar Preço
1. Clique no ícone de editar do produto
2. Modifique o preço para 49.90
3. Clique em **"Salvar Alterações"**

### Marcar como Sem Estoque
1. Clique no ícone de editar do produto
2. Desmarque "Em Estoque"
3. Clique em **"Salvar Alterações"**

## ⚠️ Boas Práticas

### 1. Nomes de Produtos
- Use nomes descritivos e claros
- Mantenha consistência na nomenclatura
- Evite caracteres especiais desnecessários

### 2. Preços
- Use sempre formato decimal (25.90, não 25,90)
- Mantenha consistência na formatação
- Atualize preços regularmente

### 3. Categorias
- Use categorias consistentes
- Evite criar muitas categorias similares
- Mantenha uma hierarquia lógica

### 4. Imagens
- Use imagens de boa qualidade
- Mantenha proporções consistentes
- Otimize o tamanho das imagens

### 5. Estoque
- Atualize o status de estoque regularmente
- Monitore produtos com baixo estoque
- Mantenha informações precisas

## 🚨 Troubleshooting

### Erro: "Admin não autenticado"
- Verifique se está logado
- Tente fazer logout e login novamente
- Confirme se as credenciais estão corretas

### Erro: "Erro ao criar produto"
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se o preço é um número válido
- Verifique se a URL da imagem é válida

### Produtos não aparecem
- Verifique se há produtos cadastrados
- Tente recarregar a página
- Verifique os filtros de categoria

### Upload de imagem falha
- Verifique se o arquivo é uma imagem válida
- Confirme se o tamanho não excede 5MB
- Tente usar uma URL externa

## 🔄 Próximos Passos

### Configuração Inicial
1. Execute o script `web_admin_permissions.sql` no Supabase
2. Configure credenciais seguras em produção
3. Teste todas as operações básicas

### Manutenção
1. Monitore regularmente os produtos
2. Atualize preços e estoque
3. Mantenha as categorias organizadas
4. Faça backup regular dos dados

### Segurança
1. Altere as credenciais padrão
2. Monitore logs de acesso
3. Mantenha o sistema atualizado
4. Faça logout ao terminar as operações

## 📞 Suporte

Se encontrar problemas:
1. Verifique se está logado corretamente
2. Confirme se as permissões estão configuradas
3. Teste as operações básicas primeiro
4. Consulte os logs do navegador

---

**Eliza CMS** - Sistema de gerenciamento via interface web configurado com sucesso! 🎉 