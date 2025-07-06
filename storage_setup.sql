-- Script para configurar Storage e RLS no Supabase - VERSÃO PRODUÇÃO
-- Execute este script no SQL Editor do Supabase

-- 1. Criar bucket para imagens de produtos (se não existir)
-- Nota: Buckets devem ser criados via interface do Supabase Storage
-- Acesse: Storage > New bucket > Nome: "produtos" > Public > Create

-- 2. Configurar RLS (Row Level Security) para a tabela products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Política para permitir leitura pública (qualquer pessoa pode ver produtos)
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT USING (true);

-- 4. Política para permitir inserção (criar produtos) - com verificação de chave secreta
CREATE POLICY "Permitir criação de produtos com chave secreta" ON products
    FOR INSERT WITH CHECK (
        current_setting('app.secret_key', true) = 'eliza_cms_2024_secure'
    );

-- 5. Política para permitir atualização (editar produtos) - com verificação de chave secreta
CREATE POLICY "Permitir edição de produtos com chave secreta" ON products
    FOR UPDATE USING (
        current_setting('app.secret_key', true) = 'eliza_cms_2024_secure'
    );

-- 6. Política para permitir exclusão (deletar produtos) - com verificação de chave secreta
CREATE POLICY "Permitir exclusão de produtos com chave secreta" ON products
    FOR DELETE USING (
        current_setting('app.secret_key', true) = 'eliza_cms_2024_secure'
    );

-- 7. Configurar políticas para o bucket de storage
-- Política para permitir upload de imagens (com verificação de chave secreta)
CREATE POLICY "Permitir upload de imagens com chave secreta" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'produtos' AND
        current_setting('app.secret_key', true) = 'eliza_cms_2024_secure'
    );

-- Política para permitir visualização pública das imagens
CREATE POLICY "Imagens visíveis publicamente" ON storage.objects
    FOR SELECT USING (bucket_id = 'produtos');

-- Política para permitir atualização de imagens (com verificação de chave secreta)
CREATE POLICY "Permitir atualização de imagens com chave secreta" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'produtos' AND
        current_setting('app.secret_key', true) = 'eliza_cms_2024_secure'
    );

-- Política para permitir exclusão de imagens (com verificação de chave secreta)
CREATE POLICY "Permitir exclusão de imagens com chave secreta" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'produtos' AND
        current_setting('app.secret_key', true) = 'eliza_cms_2024_secure'
    );

-- Comentários sobre as políticas
COMMENT ON POLICY "Produtos visíveis publicamente" ON products IS 'Permite que qualquer pessoa veja os produtos';
COMMENT ON POLICY "Permitir criação de produtos com chave secreta" ON products IS 'Permite criação de produtos apenas com chave secreta válida';
COMMENT ON POLICY "Permitir edição de produtos com chave secreta" ON products IS 'Permite edição de produtos apenas com chave secreta válida';
COMMENT ON POLICY "Permitir exclusão de produtos com chave secreta" ON products IS 'Permite exclusão de produtos apenas com chave secreta válida';

-- 8. Criar função para definir a chave secreta (será chamada pelo frontend)
CREATE OR REPLACE FUNCTION set_app_secret_key()
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.secret_key', 'eliza_cms_2024_secure', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 