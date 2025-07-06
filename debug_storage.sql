-- Script para debug do Storage no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Listar todos os buckets
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets;

-- 2. Listar políticas da tabela products
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products';

-- 3. Listar políticas do storage
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 4. Verificar se RLS está habilitado na tabela products
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'products';

-- 5. Verificar se RLS está habilitado na tabela storage.objects
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 6. Listar funções relacionadas ao storage
SELECT 
    proname,
    prosrc
FROM pg_proc 
WHERE proname LIKE '%storage%' OR prosrc LIKE '%storage%';

-- 7. Verificar configurações do bucket produtos (se existir)
SELECT 
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at,
    updated_at
FROM storage.buckets 
WHERE name = 'produtos';

-- 8. Contar objetos no bucket produtos (se existir)
SELECT 
    COUNT(*) as total_files
FROM storage.objects 
WHERE bucket_id = 'produtos'; 