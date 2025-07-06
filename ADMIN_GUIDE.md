# 👨‍💼 Guia do Administrador - Supabase Dashboard

## Visão Geral

Este guia explica como o administrador pode gerenciar produtos diretamente via Supabase Dashboard, com permissões seguras e funções específicas.

## 🔐 Permissões Configuradas

### ✅ O que o administrador pode fazer:
- **Visualizar** todos os produtos (público)
- **Criar** novos produtos (apenas admin)
- **Editar** produtos existentes (apenas admin)
- **Excluir** produtos (apenas admin)
- **Gerenciar** configurações do site (apenas admin)

### 🛡️ Segurança:
- Políticas RLS configuradas
- Verificação de autenticação
- Funções específicas para Dashboard
- Logs de operações

## 🚀 Como Acessar

### 1. Acessar o Supabase Dashboard
1. Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Faça login se necessário

### 2. Navegar para Table Editor
1. No menu lateral, clique em **Table Editor**
2. Selecione a tabela **products**
3. Você verá todos os produtos listados

## 📋 Operações Básicas

### Visualizar Produtos
- Todos os produtos são visíveis publicamente
- Use filtros e ordenação do Table Editor
- Visualize detalhes completos de cada produto

### Criar Novo Produto
1. Clique em **Insert Row**
2. Preencha os campos:
   - **name**: Nome do produto (obrigatório)
   - **description**: Descrição detalhada
   - **price**: Preço em decimal (ex: 25.90)
   - **category**: Categoria do produto
   - **image**: URL da imagem (opcional)
   - **in_stock**: Marque se está em estoque
3. Clique em **Save**

### Editar Produto
1. Clique no produto que deseja editar
2. Modifique os campos necessários
3. Clique em **Save**

### Excluir Produto
1. Clique no produto que deseja excluir
2. Clique em **Delete**
3. Confirme a exclusão

## 🔧 Funções Avançadas

### Usar Funções SQL
No **SQL Editor**, você pode usar funções específicas:

#### Inserir Produto
```sql
SELECT dashboard_insert_product(
    'Nome do Produto',
    'Descrição do produto',
    29.90,
    'Categoria',
    'https://url-da-imagem.jpg',
    true
);
```

#### Atualizar Produto
```sql
SELECT dashboard_update_product(
    1, -- ID do produto
    'Novo Nome',
    'Nova descrição',
    35.90,
    'Nova categoria'
);
```

#### Excluir Produto
```sql
SELECT dashboard_delete_product(1); -- ID do produto
```

#### Listar Todos os Produtos
```sql
SELECT * FROM dashboard_list_products();
```

#### Ver Estatísticas
```sql
SELECT * FROM dashboard_product_stats();
```

## 📊 Estatísticas Disponíveis

A função `dashboard_product_stats()` retorna:
- **total_products**: Total de produtos
- **products_in_stock**: Produtos em estoque
- **products_out_of_stock**: Produtos sem estoque
- **total_value**: Valor total do inventário
- **categories_count**: Número de categorias

## 🎯 Exemplos Práticos

### Adicionar Produto Natural
```sql
SELECT dashboard_insert_product(
    'Óleo Essencial de Lavanda',
    'Óleo essencial 100% natural, extraído de lavanda orgânica. Ideal para relaxamento e aromaterapia.',
    45.90,
    'Óleos Essenciais',
    'https://exemplo.com/lavanda.jpg',
    true
);
```

### Atualizar Preço
```sql
SELECT dashboard_update_product(
    1,
    NULL, -- manter nome
    NULL, -- manter descrição
    49.90, -- novo preço
    NULL, -- manter categoria
    NULL, -- manter imagem
    NULL  -- manter estoque
);
```

### Marcar como Sem Estoque
```sql
SELECT dashboard_update_product(
    1,
    NULL, NULL, NULL, NULL, NULL, false
);
```

## 🔍 Consultas Úteis

### Produtos por Categoria
```sql
SELECT category, COUNT(*) as total
FROM products 
GROUP BY category 
ORDER BY total DESC;
```

### Produtos Mais Caros
```sql
SELECT name, price, category 
FROM products 
ORDER BY price DESC 
LIMIT 10;
```

### Produtos Sem Imagem
```sql
SELECT id, name, category 
FROM products 
WHERE image IS NULL OR image = '';
```

### Produtos Criados Recentemente
```sql
SELECT name, created_at 
FROM products 
ORDER BY created_at DESC 
LIMIT 5;
```

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
- Use URLs válidas e acessíveis
- Mantenha proporções consistentes
- Otimize o tamanho das imagens

### 5. Estoque
- Atualize o status de estoque regularmente
- Monitore produtos com baixo estoque
- Mantenha informações precisas

## 🚨 Troubleshooting

### Erro: "permission denied"
- Verifique se está logado como admin
- Confirme se as políticas RLS estão ativas
- Execute o script `admin_permissions.sql`

### Erro: "invalid input syntax"
- Verifique o formato dos dados
- Use números decimais para preços
- Confirme que campos obrigatórios estão preenchidos

### Produtos não aparecem
- Verifique se a tabela existe
- Confirme se há dados na tabela
- Execute o script `products_fix.sql`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Execute as funções de diagnóstico
3. Consulte a documentação do Supabase
4. Teste as operações básicas primeiro

---

**Eliza CMS** - Guia do Administrador para Supabase Dashboard 