-- Script SIMPLES para configurar Storage no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Configurar RLS (Row Level Security) para a tabela products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Política para permitir leitura pública (qualquer pessoa pode ver produtos)
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT USING (true);

-- 3. Política para permitir inserção (criar produtos) - sem restrição
CREATE POLICY "Permitir criação de produtos" ON products
    FOR INSERT WITH CHECK (true);

-- 4. Política para permitir atualização (editar produtos) - sem restrição
CREATE POLICY "Permitir edição de produtos" ON products
    FOR UPDATE USING (true);

-- 5. Política para permitir exclusão (deletar produtos) - sem restrição
CREATE POLICY "Permitir exclusão de produtos" ON products
    FOR DELETE USING (true);

-- 6. Configurar políticas para o bucket de storage
-- Política para permitir upload de imagens (sem restrição)
CREATE POLICY "Permitir upload de imagens" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'produtos');

-- Política para permitir visualização pública das imagens
CREATE POLICY "Imagens visíveis publicamente" ON storage.objects
    FOR SELECT USING (bucket_id = 'produtos');

-- Política para permitir atualização de imagens (sem restrição)
CREATE POLICY "Permitir atualização de imagens" ON storage.objects
    FOR UPDATE USING (bucket_id = 'produtos');

-- Política para permitir exclusão de imagens (sem restrição)
CREATE POLICY "Permitir exclusão de imagens" ON storage.objects
    FOR DELETE USING (bucket_id = 'produtos');

-- Comentários sobre as políticas
COMMENT ON POLICY "Produtos visíveis publicamente" ON products IS 'Permite que qualquer pessoa veja os produtos';
COMMENT ON POLICY "Permitir criação de produtos" ON products IS 'Permite criação de produtos sem restrição (desenvolvimento)';
COMMENT ON POLICY "Permitir edição de produtos" ON products IS 'Permite edição de produtos sem restrição (desenvolvimento)';
COMMENT ON POLICY "Permitir exclusão de produtos" ON products IS 'Permite exclusão de produtos sem restrição (desenvolvimento)';

-- IMPORTANTE: Este script é para DESENVOLVIMENTO apenas!
-- Para produção, use o script storage_setup.sql que tem políticas de segurança mais rigorosas. 