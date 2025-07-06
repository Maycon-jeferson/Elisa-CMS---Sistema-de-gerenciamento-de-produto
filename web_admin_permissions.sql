-- Script para configurar permissões de administrador via interface web
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar configuração atual
SELECT 
    '=== CONFIGURAÇÃO ATUAL ===' as info;

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

-- 2. Remover políticas existentes para recriar
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Apenas admins podem criar produtos" ON products;
DROP POLICY IF EXISTS "Apenas admins podem editar produtos" ON products;
DROP POLICY IF EXISTS "Apenas admins podem excluir produtos" ON products;
DROP POLICY IF EXISTS "Permitir criação via admin ou dashboard" ON products;
DROP POLICY IF EXISTS "Permitir edição via admin ou dashboard" ON products;
DROP POLICY IF EXISTS "Permitir exclusão via admin ou dashboard" ON products;

-- 3. Criar função para verificar se o usuário é admin via JWT
CREATE OR REPLACE FUNCTION is_web_admin()
RETURNS BOOLEAN AS $$
DECLARE
    jwt_claims JSONB;
    admin_email TEXT;
    admin_exists BOOLEAN;
BEGIN
    -- Obter claims do JWT
    jwt_claims := current_setting('request.jwt.claims', true)::jsonb;
    
    -- Se não há JWT, verificar se é service_role (para operações diretas)
    IF jwt_claims IS NULL THEN
        RETURN current_setting('request.jwt.claims', true)::json->>'role' = 'service_role';
    END IF;
    
    -- Extrair email do JWT
    admin_email := jwt_claims->>'email';
    
    -- Verificar se existe um admin ativo com este email
    SELECT EXISTS(
        SELECT 1 FROM admins 
        WHERE email = admin_email 
        AND is_active = true
    ) INTO admin_exists;
    
    RETURN admin_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar políticas para interface web

-- Política para leitura pública (qualquer pessoa pode ver produtos)
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT
    USING (true);

-- Política para inserção (apenas admins autenticados)
CREATE POLICY "Apenas admins web podem criar produtos" ON products
    FOR INSERT
    WITH CHECK (
        is_web_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Política para atualização (apenas admins autenticados)
CREATE POLICY "Apenas admins web podem editar produtos" ON products
    FOR UPDATE
    USING (
        is_web_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    )
    WITH CHECK (
        is_web_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Política para exclusão (apenas admins autenticados)
CREATE POLICY "Apenas admins web podem excluir produtos" ON products
    FOR DELETE
    USING (
        is_web_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- 5. Criar função para operações via interface web
CREATE OR REPLACE FUNCTION web_admin_manage_products()
RETURNS TRIGGER AS $$
BEGIN
    -- Permitir operações quando usando service_role (para operações diretas)
    IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Para outras operações, verificar se é admin via interface web
    IF NOT is_web_admin() THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores autenticados podem gerenciar produtos';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar trigger para validação adicional
DROP TRIGGER IF EXISTS web_admin_products_trigger ON products;

CREATE TRIGGER web_admin_products_trigger
    BEFORE INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION web_admin_manage_products();

-- 7. Criar função para verificar status do admin
CREATE OR REPLACE FUNCTION get_admin_status(admin_email TEXT)
RETURNS TABLE(
    is_active BOOLEAN,
    admin_id BIGINT,
    admin_name TEXT,
    admin_role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.is_active,
        a.id,
        a.name,
        a.role
    FROM admins a
    WHERE a.email = admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Criar função para operações seguras via web
CREATE OR REPLACE FUNCTION web_insert_product(
    p_name VARCHAR,
    p_description TEXT,
    p_price DECIMAL(10,2),
    p_category VARCHAR,
    p_image TEXT DEFAULT NULL,
    p_in_stock BOOLEAN DEFAULT true,
    admin_email TEXT
)
RETURNS INTEGER AS $$
DECLARE
    new_id INTEGER;
    admin_status RECORD;
BEGIN
    -- Verificar se o admin está ativo
    SELECT * FROM get_admin_status(admin_email) INTO admin_status;
    
    IF NOT admin_status.is_active THEN
        RAISE EXCEPTION 'Admin inativo ou não encontrado';
    END IF;
    
    -- Inserir produto
    INSERT INTO products (name, description, price, category, image, in_stock)
    VALUES (p_name, p_description, p_price, p_category, p_image, p_in_stock)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Criar função para atualização segura via web
CREATE OR REPLACE FUNCTION web_update_product(
    p_id INTEGER,
    p_name VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_price DECIMAL(10,2) DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_image TEXT DEFAULT NULL,
    p_in_stock BOOLEAN DEFAULT NULL,
    admin_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_status RECORD;
BEGIN
    -- Verificar se o admin está ativo
    SELECT * FROM get_admin_status(admin_email) INTO admin_status;
    
    IF NOT admin_status.is_active THEN
        RAISE EXCEPTION 'Admin inativo ou não encontrado';
    END IF;
    
    -- Atualizar produto
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

-- 10. Criar função para exclusão segura via web
CREATE OR REPLACE FUNCTION web_delete_product(
    p_id INTEGER,
    admin_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    admin_status RECORD;
BEGIN
    -- Verificar se o admin está ativo
    SELECT * FROM get_admin_status(admin_email) INTO admin_status;
    
    IF NOT admin_status.is_active THEN
        RAISE EXCEPTION 'Admin inativo ou não encontrado';
    END IF;
    
    -- Excluir produto
    DELETE FROM products WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Verificar políticas criadas
SELECT 
    '=== POLÍTICAS CRIADAS ===' as info;

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

-- 12. Verificar funções criadas
SELECT 
    '=== FUNÇÕES CRIADAS ===' as info;

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%web%'
ORDER BY routine_name;

-- 13. Testar configuração
SELECT 
    '=== TESTE DE CONFIGURAÇÃO ===' as info,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'products') as total_policies,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%web%') as total_functions,
    (SELECT COUNT(*) FROM admins WHERE is_active = true) as total_admins;

-- 14. Comentários sobre as funções
COMMENT ON FUNCTION is_web_admin() IS 'Verifica se o usuário é admin ativo via JWT da interface web';
COMMENT ON FUNCTION web_admin_manage_products() IS 'Função de trigger para validar permissões de admin web';
COMMENT ON FUNCTION get_admin_status() IS 'Retorna status de um admin específico';
COMMENT ON FUNCTION web_insert_product() IS 'Insere produto com verificação de admin (parâmetros: nome, descrição, preço, categoria, imagem, estoque, email_admin)';
COMMENT ON FUNCTION web_update_product() IS 'Atualiza produto com verificação de admin (parâmetros: id, nome, descrição, preço, categoria, imagem, estoque, email_admin)';
COMMENT ON FUNCTION web_delete_product() IS 'Exclui produto com verificação de admin (parâmetros: id, email_admin)';

-- 15. Configuração final
SELECT 
    '=== CONFIGURAÇÃO WEB CONCLUÍDA ===' as status,
    'Permissões configuradas para interface web do Eliza CMS' as descricao,
    'Use as funções web_* para operações seguras via interface' as instrucao; 