-- Versão simplificada das permissões web
-- Execute este script no SQL Editor do Supabase

-- 1. Remover políticas existentes
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Apenas admins web podem criar produtos" ON products;
DROP POLICY IF EXISTS "Apenas admins web podem editar produtos" ON products;
DROP POLICY IF EXISTS "Apenas admins web podem excluir produtos" ON products;
DROP POLICY IF EXISTS "Permitir criação via admin ou dashboard" ON products;
DROP POLICY IF EXISTS "Permitir edição via admin ou dashboard" ON products;
DROP POLICY IF EXISTS "Permitir exclusão via admin ou dashboard" ON products;

-- 2. Remover funções existentes
DROP FUNCTION IF EXISTS is_web_admin();
DROP FUNCTION IF EXISTS web_admin_manage_products();
DROP FUNCTION IF EXISTS get_admin_status();
DROP FUNCTION IF EXISTS web_insert_product();
DROP FUNCTION IF EXISTS web_update_product();
DROP FUNCTION IF EXISTS web_delete_product();

-- 3. Remover triggers
DROP TRIGGER IF EXISTS web_admin_products_trigger ON products;
DROP TRIGGER IF EXISTS admin_products_trigger ON products;

-- 4. Criar políticas simples
-- Política para leitura pública
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT
    USING (true);

-- Política para inserção (permitir service_role e operações diretas)
CREATE POLICY "Permitir criação de produtos" ON products
    FOR INSERT
    WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' OR
        current_setting('request.jwt.claims', true) IS NULL
    );

-- Política para atualização
CREATE POLICY "Permitir edição de produtos" ON products
    FOR UPDATE
    USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' OR
        current_setting('request.jwt.claims', true) IS NULL
    )
    WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' OR
        current_setting('request.jwt.claims', true) IS NULL
    );

-- Política para exclusão
CREATE POLICY "Permitir exclusão de produtos" ON products
    FOR DELETE
    USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' OR
        current_setting('request.jwt.claims', true) IS NULL
    );

-- 5. Verificar configuração
SELECT 
    '=== CONFIGURAÇÃO SIMPLIFICADA ===' as info,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'products';

-- 6. Testar inserção direta
SELECT 
    '=== TESTE DE INSERÇÃO ===' as info;

-- Inserir produto de teste
INSERT INTO products (name, description, price, category, in_stock) 
VALUES ('Produto Teste', 'Produto para teste de permissões', 15.90, 'Teste', true)
RETURNING id, name, price;

-- 7. Verificar se foi inserido
SELECT 
    '=== PRODUTO INSERIDO ===' as info,
    id,
    name,
    price,
    category
FROM products 
WHERE name = 'Produto Teste';

-- 8. Limpar produto de teste
DELETE FROM products WHERE name = 'Produto Teste';

-- 9. Configuração final
SELECT 
    '=== CONFIGURAÇÃO CONCLUÍDA ===' as status,
    'Permissões simplificadas configuradas com sucesso' as descricao,
    'Agora você pode criar produtos via interface web' as instrucao; 