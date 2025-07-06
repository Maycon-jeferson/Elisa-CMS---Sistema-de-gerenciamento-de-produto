-- Script para testar permissões de administrador
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

-- 2. Verificar funções criadas
SELECT 
    '=== FUNÇÕES DISPONÍVEIS ===' as info;

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%dashboard%'
ORDER BY routine_name;

-- 3. Verificar admins ativos
SELECT 
    '=== ADMINS ATIVOS ===' as info;

SELECT 
    id,
    email,
    name,
    role,
    is_active,
    last_login
FROM admins 
WHERE is_active = true
ORDER BY created_at DESC;

-- 4. Testar função de estatísticas
SELECT 
    '=== ESTATÍSTICAS DOS PRODUTOS ===' as info;

SELECT * FROM dashboard_product_stats();

-- 5. Testar listagem de produtos
SELECT 
    '=== LISTA DE PRODUTOS ===' as info;

SELECT 
    id,
    name,
    price,
    category,
    in_stock,
    created_at
FROM dashboard_list_products()
LIMIT 5;

-- 6. Testar inserção de produto (comentado para segurança)
-- SELECT 
--     '=== TESTE DE INSERÇÃO ===' as info;
-- 
-- SELECT dashboard_insert_product(
--     'Produto Teste Permissões',
--     'Produto criado para testar permissões de administrador',
--     19.90,
--     'Teste',
--     NULL,
--     true
-- );

-- 7. Verificar permissões de usuário atual
SELECT 
    '=== PERMISSÕES DO USUÁRIO ATUAL ===' as info;

SELECT 
    current_user as usuario_atual,
    current_setting('request.jwt.claims', true) as jwt_claims,
    is_admin() as eh_admin,
    allow_dashboard_operations() as pode_operar_dashboard;

-- 8. Testar operações básicas (comentadas para segurança)
-- SELECT 
--     '=== TESTE DE OPERAÇÕES ===' as info;
-- 
-- -- Tentar inserir produto
-- INSERT INTO products (name, description, price, category, in_stock) 
-- VALUES ('Teste Direto', 'Teste de inserção direta', 25.90, 'Teste', true);
-- 
-- -- Tentar atualizar produto
-- UPDATE products SET price = 30.90 WHERE name = 'Teste Direto';
-- 
-- -- Tentar excluir produto
-- DELETE FROM products WHERE name = 'Teste Direto';

-- 9. Verificar configuração de RLS
SELECT 
    '=== CONFIGURAÇÃO RLS ===' as info;

SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'products';

-- 10. Verificar triggers
SELECT 
    '=== TRIGGERS ATIVOS ===' as info;

SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'products'
ORDER BY trigger_name;

-- 11. Resumo final
SELECT 
    '=== RESUMO DA CONFIGURAÇÃO ===' as info,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'products') as total_policies,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%dashboard%') as total_functions,
    (SELECT COUNT(*) FROM admins WHERE is_active = true) as total_admins,
    (SELECT COUNT(*) FROM products) as total_products;

-- 12. Instruções de uso
SELECT 
    '=== INSTRUÇÕES DE USO ===' as info,
    'Para inserir produto: SELECT dashboard_insert_product(''Nome'', ''Descrição'', 29.90, ''Categoria'', NULL, true);' as comando_inserir,
    'Para atualizar produto: SELECT dashboard_update_product(1, ''Novo Nome'', ''Nova Descrição'', 35.90);' as comando_atualizar,
    'Para excluir produto: SELECT dashboard_delete_product(1);' as comando_excluir,
    'Para ver estatísticas: SELECT * FROM dashboard_product_stats();' as comando_estatisticas;

-- 13. Verificar se tudo está funcionando
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'products') >= 4 THEN '✅ Políticas configuradas'
        ELSE '❌ Políticas incompletas'
    END as status_policies,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%dashboard%') >= 5 THEN '✅ Funções criadas'
        ELSE '❌ Funções incompletas'
    END as status_functions,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM admins WHERE is_active = true) > 0 THEN '✅ Admins ativos'
        ELSE '❌ Nenhum admin ativo'
    END as status_admins,
    
    CASE 
        WHEN is_admin() OR allow_dashboard_operations() THEN '✅ Permissões funcionando'
        ELSE '❌ Permissões não funcionando'
    END as status_permissions; 