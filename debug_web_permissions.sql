-- Script para diagnosticar problemas com permissões web
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se as políticas foram criadas
SELECT 
    '=== VERIFICANDO POLÍTICAS ===' as info;

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

-- 2. Verificar se as funções foram criadas
SELECT 
    '=== VERIFICANDO FUNÇÕES ===' as info;

SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%web%'
ORDER BY routine_name;

-- 3. Verificar se a tabela admins existe e tem dados
SELECT 
    '=== VERIFICANDO ADMINS ===' as info;

SELECT 
    COUNT(*) as total_admins,
    COUNT(CASE WHEN is_active = true THEN 1 END) as admins_ativos
FROM admins;

-- 4. Verificar estrutura da tabela products
SELECT 
    '=== ESTRUTURA DA TABELA PRODUCTS ===' as info;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 5. Testar função is_web_admin() (deve retornar false sem JWT)
SELECT 
    '=== TESTE DA FUNÇÃO IS_WEB_ADMIN ===' as info;

SELECT 
    is_web_admin() as resultado_sem_jwt;

-- 6. Verificar se RLS está ativo na tabela products
SELECT 
    '=== VERIFICANDO RLS ===' as info;

SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'products';

-- 7. Testar inserção direta (deve falhar sem permissões)
SELECT 
    '=== TESTE DE INSERÇÃO DIRETA ===' as info;

-- Tentar inserir produto (deve falhar)
-- INSERT INTO products (name, description, price, category, in_stock) 
-- VALUES ('Teste Debug', 'Produto para teste', 10.00, 'Teste', true);

-- 8. Verificar triggers
SELECT 
    '=== VERIFICANDO TRIGGERS ===' as info;

SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'products'
ORDER BY trigger_name;

-- 9. Testar função web_insert_product com admin existente
SELECT 
    '=== TESTE DA FUNÇÃO WEB_INSERT_PRODUCT ===' as info;

-- Pegar email de um admin ativo
SELECT 
    email as admin_email_para_teste
FROM admins 
WHERE is_active = true 
LIMIT 1;

-- 10. Verificar se há problemas de permissões
SELECT 
    '=== VERIFICANDO PERMISSÕES ===' as info;

SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'products';

-- 11. Resumo do diagnóstico
SELECT 
    '=== RESUMO DO DIAGNÓSTICO ===' as info,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'products') as total_policies,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%web%') as total_functions,
    (SELECT COUNT(*) FROM admins WHERE is_active = true) as admins_ativos,
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT rowsecurity FROM pg_tables WHERE tablename = 'products') as rls_ativo;

-- 12. Instruções para correção
SELECT 
    '=== INSTRUÇÕES PARA CORREÇÃO ===' as info,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'products') < 4 THEN 'Execute web_admin_permissions.sql novamente'
        ELSE 'Políticas OK'
    END as status_policies,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%web%') < 3 THEN 'Funções web não encontradas - execute web_admin_permissions.sql'
        ELSE 'Funções OK'
    END as status_functions,
    
    CASE 
        WHEN (SELECT COUNT(*) FROM admins WHERE is_active = true) = 0 THEN 'Nenhum admin ativo - verifique a tabela admins'
        ELSE 'Admins OK'
    END as status_admins,
    
    CASE 
        WHEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'products') = false THEN 'RLS não está ativo - ative RLS na tabela products'
        ELSE 'RLS OK'
    END as status_rls; 