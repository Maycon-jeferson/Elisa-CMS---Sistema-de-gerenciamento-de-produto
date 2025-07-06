-- Script para LIMPAR e RECRIAR políticas no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Remover políticas existentes da tabela products
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos com chave secreta" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos com chave secreta" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos com chave secreta" ON products;

-- 2. Configurar RLS (Row Level Security) para a tabela products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Criar novas políticas para a tabela products
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT USING (true);

CREATE POLICY "Permitir criação de produtos" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir edição de produtos" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de produtos" ON products
    FOR DELETE USING (true);

-- 4. Verificar se as políticas foram criadas
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- NOTA: As políticas do storage.objects são gerenciadas automaticamente pelo Supabase
-- quando o bucket é público. Se o upload ainda não funcionar, verifique se o bucket
-- "produtos" está marcado como público no dashboard do Supabase. 