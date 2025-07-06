-- Script MÍNIMO para configurar Storage no Supabase
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

-- NOTA: As políticas do storage.objects são criadas automaticamente pelo Supabase
-- quando você cria um bucket público. Se o upload ainda não funcionar,
-- verifique se o bucket "produtos" está marcado como público.

-- Para verificar se as políticas foram criadas:
-- SELECT * FROM pg_policies WHERE tablename = 'products'; 