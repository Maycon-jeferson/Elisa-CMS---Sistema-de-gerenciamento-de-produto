-- Script para configurar permissões de administrador via Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar políticas atuais da tabela products
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- 2. Remover políticas existentes para recriar com permissões adequadas
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos com chave secreta" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos com chave secreta" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos com chave secreta" ON products;

-- 3. Criar função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar se existe um admin logado
    RETURN EXISTS (
        SELECT 1 FROM admins 
        WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar políticas com permissões adequadas

-- Política para leitura pública (qualquer pessoa pode ver produtos)
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT
    USING (true);

-- Política para inserção (apenas admins)
CREATE POLICY "Apenas admins podem criar produtos" ON products
    FOR INSERT
    WITH CHECK (
        is_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Política para atualização (apenas admins)
CREATE POLICY "Apenas admins podem editar produtos" ON products
    FOR UPDATE
    USING (
        is_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    )
    WITH CHECK (
        is_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- Política para exclusão (apenas admins)
CREATE POLICY "Apenas admins podem excluir produtos" ON products
    FOR DELETE
    USING (
        is_admin() OR 
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- 5. Criar função para operações via Supabase Dashboard (service_role)
CREATE OR REPLACE FUNCTION admin_manage_products()
RETURNS TRIGGER AS $$
BEGIN
    -- Permitir operações quando usando service_role (Supabase Dashboard)
    IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Para outras operações, verificar se é admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores podem gerenciar produtos';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar triggers para validação adicional
DROP TRIGGER IF EXISTS admin_products_trigger ON products;

CREATE TRIGGER admin_products_trigger
    BEFORE INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION admin_manage_products();

-- 7. Verificar políticas criadas
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

-- 8. Testar permissões (executar como admin)
-- Nota: Estes testes devem ser executados com um admin logado

-- Teste de inserção (deve funcionar para admin)
-- INSERT INTO products (name, description, price, category, in_stock) 
-- VALUES ('Produto Teste Admin', 'Teste de permissão de admin', 15.90, 'Teste', true);

-- Teste de atualização (deve funcionar para admin)
-- UPDATE products SET price = 16.90 WHERE name = 'Produto Teste Admin';

-- Teste de exclusão (deve funcionar para admin)
-- DELETE FROM products WHERE name = 'Produto Teste Admin';

-- 9. Criar função para listar admins ativos (útil para debug)
CREATE OR REPLACE FUNCTION list_active_admins()
RETURNS TABLE(
    id BIGINT,
    email VARCHAR,
    name VARCHAR,
    role VARCHAR,
    is_active BOOLEAN,
    last_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.email,
        a.name,
        a.role,
        a.is_active,
        a.last_login
    FROM admins a
    WHERE a.is_active = true
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Comentários sobre as políticas
COMMENT ON POLICY "Produtos visíveis publicamente" ON products IS 'Permite que qualquer pessoa veja os produtos';
COMMENT ON POLICY "Apenas admins podem criar produtos" ON products IS 'Permite criação apenas por administradores ou service_role';
COMMENT ON POLICY "Apenas admins podem editar produtos" ON products IS 'Permite edição apenas por administradores ou service_role';
COMMENT ON POLICY "Apenas admins podem excluir produtos" ON products IS 'Permite exclusão apenas por administradores ou service_role';
COMMENT ON FUNCTION is_admin() IS 'Verifica se o usuário atual é um administrador ativo';
COMMENT ON FUNCTION admin_manage_products() IS 'Função de trigger para validar permissões de admin';
COMMENT ON FUNCTION list_active_admins() IS 'Lista todos os administradores ativos';

-- 11. Verificar configuração final
SELECT 
    'Configuração de permissões concluída' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'products'; 