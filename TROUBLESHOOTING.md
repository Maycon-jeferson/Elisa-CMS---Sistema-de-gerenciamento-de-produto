# 🔧 Troubleshooting - Produtos Não Aparecem

## Problema
Os produtos não estão sendo exibidos na página principal do Eliza CMS.

## 🔍 Diagnóstico

### 1. Verificar no Console do Navegador
1. Abra o DevTools (F12)
2. Vá para a aba **Console**
3. Procure por erros relacionados a:
   - `loadProducts`
   - `supabase`
   - `products`
   - `RLS` ou `policy`

### 2. Usar o Componente de Teste
1. Em desenvolvimento, clique em **"Mostrar Teste de Conexão"**
2. Execute os testes
3. Verifique os resultados para identificar o problema

### 3. Verificar Variáveis de Ambiente
Confirme se o arquivo `.env.local` está configurado:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 🛠️ Soluções

### Solução 1: Executar Script de Correção
Execute o script `products_fix.sql` no SQL Editor do Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Execute o conteúdo do arquivo `products_fix.sql`
4. Verifique se os produtos de teste foram criados

### Solução 2: Verificar Tabela Products
No SQL Editor do Supabase, execute:
```sql
-- Verificar se a tabela existe
SELECT * FROM products LIMIT 5;

-- Verificar estrutura
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'products';

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'products';
```

### Solução 3: Recriar Políticas RLS
Se as políticas estiverem incorretas:
```sql
-- Remover políticas existentes
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos" ON products;

-- Criar políticas corretas
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT
    USING (true);

CREATE POLICY "Permitir criação de produtos" ON products
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir edição de produtos" ON products
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir exclusão de produtos" ON products
    FOR DELETE
    USING (true);
```

### Solução 4: Inserir Produtos de Teste
Se a tabela estiver vazia:
```sql
INSERT INTO products (name, description, price, category, in_stock) VALUES
('Óleo de Coco Natural', 'Óleo de coco extra virgem 100% natural', 25.90, 'Óleos', true),
('Sabonete de Argila', 'Sabonete artesanal com argila verde', 12.50, 'Higiene', true),
('Chá de Camomila', 'Chá orgânico de camomila relaxante', 8.90, 'Chás', true),
('Creme Hidratante', 'Creme hidratante com aloe vera', 32.00, 'Cosméticos', true);
```

## 🚨 Erros Comuns

### Erro: "relation 'products' does not exist"
**Causa**: A tabela `products` não foi criada
**Solução**: Execute o script `products_fix.sql`

### Erro: "new row violates row-level security policy"
**Causa**: Políticas RLS mal configuradas
**Solução**: Recrie as políticas RLS (Solução 3)

### Erro: "permission denied for table products"
**Causa**: Problema de permissões
**Solução**: Verifique se a chave anônima está correta

### Erro: "invalid input syntax for type decimal"
**Causa**: Formato de preço incorreto
**Solução**: Use números decimais (ex: 25.90, não "25,90")

## 🔄 Verificação Pós-Correção

1. **Recarregue a página** do navegador
2. **Execute o teste de conexão** novamente
3. **Verifique se os produtos aparecem**
4. **Teste criar um novo produto** (se estiver logado)

## 📋 Checklist de Verificação

- [ ] Tabela `products` existe no Supabase
- [ ] Políticas RLS estão configuradas corretamente
- [ ] Variáveis de ambiente estão corretas
- [ ] Não há erros no console do navegador
- [ ] A função `loadProducts` retorna dados
- [ ] Produtos existem na tabela
- [ ] Componente `ProductsTable` está renderizando

## 🆘 Se Nada Funcionar

1. **Verifique os logs** do Supabase no dashboard
2. **Teste a conexão** com um script SQL simples
3. **Reinicie o servidor** de desenvolvimento
4. **Limpe o cache** do navegador
5. **Verifique se o Supabase** está online

## 📞 Suporte

Se o problema persistir:
1. Execute o teste de conexão
2. Copie os resultados
3. Verifique os logs do console
4. Documente os passos que tentou

---

**Eliza CMS** - Guia de Troubleshooting para Problemas de Produtos 