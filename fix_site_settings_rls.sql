-- Script para corrigir políticas RLS da tabela site_settings
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se RLS está habilitado
SELECT 
    'RLS STATUS' as check_type,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'site_settings';

-- 2. Verificar políticas existentes
SELECT 
    'EXISTING POLICIES' as check_type,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE tablename = 'site_settings'
ORDER BY policyname;

-- 3. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Enable read access for all users" ON site_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON site_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON site_settings;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON site_settings;

-- 4. Desabilitar RLS temporariamente para permitir operações
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 5. Verificar se a tabela permite operações sem RLS
SELECT 
    'RLS DISABLED' as check_type,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'site_settings';

-- 6. Inserir configurações padrão se não existirem
INSERT INTO site_settings (whatsapp_number, site_name, title, subtitle, slogan) 
SELECT 
    '5511999999999',
    'Eliza CMS',
    'Catálogo de Produtos Naturais',
    'Descubra produtos naturais de qualidade',
    'Naturais como a natureza'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 7. Verificar dados atuais
SELECT 
    'CURRENT DATA' as check_type,
    id,
    whatsapp_number,
    site_name,
    title,
    subtitle,
    slogan,
    created_at,
    updated_at
FROM site_settings
ORDER BY created_at DESC;

-- 8. Comentário sobre a solução
-- NOTA: Para este projeto, desabilitamos RLS na tabela site_settings
-- porque o sistema usa autenticação customizada, não o auth do Supabase.
-- Se você quiser reabilitar RLS no futuro, precisará criar políticas
-- que funcionem com o sistema de autenticação customizado.

-- 9. Opcional: Se quiser reabilitar RLS com políticas customizadas
-- (Execute apenas se você entender as implicações de segurança)

/*
-- Reabilitar RLS com políticas que permitem todas as operações
-- (Use apenas se você confiar no sistema de autenticação customizado)

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos
CREATE POLICY "Enable read access for all users" ON site_settings
    FOR SELECT USING (true);

-- Política para permitir inserção para usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON site_settings
    FOR INSERT WITH CHECK (true);

-- Política para permitir atualização para usuários autenticados
CREATE POLICY "Enable update for authenticated users only" ON site_settings
    FOR UPDATE USING (true);

-- Política para permitir exclusão para usuários autenticados
CREATE POLICY "Enable delete for authenticated users only" ON site_settings
    FOR DELETE USING (true);
*/ 