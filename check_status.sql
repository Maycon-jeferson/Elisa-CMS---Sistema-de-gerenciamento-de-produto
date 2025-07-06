-- Script para VERIFICAR status atual no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar políticas da tabela products
SELECT 
    'PRODUCTS POLICIES' as section,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 2. Verificar se RLS está habilitado na tabela products
SELECT 
    'RLS STATUS' as section,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'products';

-- 3. Verificar buckets disponíveis
SELECT 
    'STORAGE BUCKETS' as section,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets;

-- 4. Verificar políticas do storage (se existirem)
SELECT 
    'STORAGE POLICIES' as section,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- 5. Contar arquivos no bucket produtos
SELECT 
    'FILES COUNT' as section,
    COUNT(*) as total_files
FROM storage.objects 
WHERE bucket_id = 'produtos';

-- 6. Verificar configurações do site
SELECT 
    'SITE SETTINGS' as section,
    COUNT(*) as settings_count
FROM site_settings; 