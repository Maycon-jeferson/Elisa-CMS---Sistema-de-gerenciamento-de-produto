-- Script para configurar permissões do Supabase Dashboard
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar configuração atual
SELECT 
    'Configuração atual' as info,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'products';

-- 2. Criar função para permitir operações via Dashboard
CREATE OR REPLACE FUNCTION allow_dashboard_operations()
RETURNS BOOLEAN AS $$
BEGIN
    -- Permitir operações via Supabase Dashboard (service_role)
    IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN true;
    END IF;
    
    -- Permitir operações via SQL Editor (sem JWT)
    IF current_setting('request.jwt.claims', true) IS NULL THEN
        RETURN true;
    END IF;
    
    -- Para outras operações, verificar se é admin
    RETURN EXISTS (
        SELECT 1 FROM admins 
        WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atualizar políticas para incluir permissões do Dashboard
DROP POLICY IF EXISTS "Apenas admins podem criar produtos" ON products;
DROP POLICY IF EXISTS "Apenas admins podem editar produtos" ON products;
DROP POLICY IF EXISTS "Apenas admins podem excluir produtos" ON products;

-- Política para inserção (admins + Dashboard)
CREATE POLICY "Permitir criação via admin ou dashboard" ON products
    FOR INSERT
    WITH CHECK (allow_dashboard_operations());

-- Política para atualização (admins + Dashboard)
CREATE POLICY "Permitir edição via admin ou dashboard" ON products
    FOR UPDATE
    USING (allow_dashboard_operations())
    WITH CHECK (allow_dashboard_operations());

-- Política para exclusão (admins + Dashboard)
CREATE POLICY "Permitir exclusão via admin ou dashboard" ON products
    FOR DELETE
    USING (allow_dashboard_operations());

-- 4. Criar função para operações diretas via SQL
CREATE OR REPLACE FUNCTION dashboard_insert_product(
    p_name VARCHAR,
    p_description TEXT,
    p_price DECIMAL(10,2),
    p_category VARCHAR,
    p_image TEXT DEFAULT NULL,
    p_in_stock BOOLEAN DEFAULT true
)
RETURNS INTEGER AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO products (name, description, price, category, image, in_stock)
    VALUES (p_name, p_description, p_price, p_category, p_image, p_in_stock)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar função para atualização via SQL
CREATE OR REPLACE FUNCTION dashboard_update_product(
    p_id INTEGER,
    p_name VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_price DECIMAL(10,2) DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_image TEXT DEFAULT NULL,
    p_in_stock BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE products 
    SET 
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        price = COALESCE(p_price, price),
        category = COALESCE(p_category, category),
        image = COALESCE(p_image, image),
        in_stock = COALESCE(p_in_stock, in_stock),
        updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar função para exclusão via SQL
CREATE OR REPLACE FUNCTION dashboard_delete_product(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM products WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar função para listar produtos com informações detalhadas
CREATE OR REPLACE FUNCTION dashboard_list_products()
RETURNS TABLE(
    id INTEGER,
    name VARCHAR,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR,
    image TEXT,
    in_stock BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.category,
        p.image,
        p.in_stock,
        p.created_at,
        p.updated_at
    FROM products p
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Criar função para estatísticas dos produtos
CREATE OR REPLACE FUNCTION dashboard_product_stats()
RETURNS TABLE(
    total_products INTEGER,
    products_in_stock INTEGER,
    products_out_of_stock INTEGER,
    total_value DECIMAL(12,2),
    categories_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_products,
        COUNT(CASE WHEN in_stock = true THEN 1 END)::INTEGER as products_in_stock,
        COUNT(CASE WHEN in_stock = false THEN 1 END)::INTEGER as products_out_of_stock,
        COALESCE(SUM(price), 0) as total_value,
        COUNT(DISTINCT category)::INTEGER as categories_count
    FROM products;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Verificar políticas atualizadas
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 10. Testar funções do Dashboard
-- Exemplo de uso das funções:

-- Inserir produto via função
-- SELECT dashboard_insert_product('Produto Dashboard', 'Teste via Dashboard', 29.90, 'Teste');

-- Atualizar produto via função
-- SELECT dashboard_update_product(1, 'Nome Atualizado', 'Descrição atualizada', 35.90);

-- Excluir produto via função
-- SELECT dashboard_delete_product(1);

-- Listar produtos
-- SELECT * FROM dashboard_list_products();

-- Ver estatísticas
-- SELECT * FROM dashboard_product_stats();

-- 11. Comentários sobre as funções
COMMENT ON FUNCTION allow_dashboard_operations() IS 'Permite operações via Dashboard ou admin autenticado';
COMMENT ON FUNCTION dashboard_insert_product() IS 'Insere produto via Dashboard (parâmetros: nome, descrição, preço, categoria, imagem, em estoque)';
COMMENT ON FUNCTION dashboard_update_product() IS 'Atualiza produto via Dashboard (parâmetros: id, nome, descrição, preço, categoria, imagem, em estoque)';
COMMENT ON FUNCTION dashboard_delete_product() IS 'Exclui produto via Dashboard (parâmetro: id)';
COMMENT ON FUNCTION dashboard_list_products() IS 'Lista todos os produtos com informações completas';
COMMENT ON FUNCTION dashboard_product_stats() IS 'Retorna estatísticas dos produtos';

-- 12. Verificar configuração final
SELECT 
    'Configuração do Dashboard concluída' as status,
    COUNT(*) as total_policies,
    'Funções disponíveis: dashboard_insert_product, dashboard_update_product, dashboard_delete_product, dashboard_list_products, dashboard_product_stats' as functions
FROM pg_policies 
WHERE tablename = 'products'; 