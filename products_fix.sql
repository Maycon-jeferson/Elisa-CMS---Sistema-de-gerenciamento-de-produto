-- Script para verificar e corrigir problemas com a tabela products
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela products existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products'
) as table_exists;

-- 2. Se a tabela não existir, criá-la
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image TEXT,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- 4. Habilitar RLS se não estiver
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos" ON products;
DROP POLICY IF EXISTS "Permitir criação de produtos com chave secreta" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos com chave secreta" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos com chave secreta" ON products;

-- 6. Criar políticas básicas para desenvolvimento
-- Política para leitura pública
CREATE POLICY "Produtos visíveis publicamente" ON products
    FOR SELECT
    USING (true);

-- Política para inserção (permissiva para desenvolvimento)
CREATE POLICY "Permitir criação de produtos" ON products
    FOR INSERT
    WITH CHECK (true);

-- Política para atualização (permissiva para desenvolvimento)
CREATE POLICY "Permitir edição de produtos" ON products
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política para exclusão (permissiva para desenvolvimento)
CREATE POLICY "Permitir exclusão de produtos" ON products
    FOR DELETE
    USING (true);

-- 7. Inserir alguns produtos de teste (apenas se a tabela estiver vazia)
INSERT INTO products (name, description, price, category, in_stock) 
SELECT * FROM (VALUES 
    ('Óleo de Coco Natural', 'Óleo de coco extra virgem 100% natural', 25.90, 'Óleos', true),
    ('Sabonete de Argila', 'Sabonete artesanal com argila verde', 12.50, 'Higiene', true),
    ('Chá de Camomila', 'Chá orgânico de camomila relaxante', 8.90, 'Chás', true),
    ('Creme Hidratante', 'Creme hidratante com aloe vera', 32.00, 'Cosméticos', true)
) AS v(name, description, price, category, in_stock)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- 8. Verificar produtos inseridos
SELECT id, name, price, category, in_stock FROM products ORDER BY id;

-- 9. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

-- 10. Criar trigger para updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_products_updated_at();

-- 11. Verificar estrutura final da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Comentários sobre a estrutura
COMMENT ON TABLE products IS 'Tabela de produtos naturais';
COMMENT ON COLUMN products.name IS 'Nome do produto';
COMMENT ON COLUMN products.description IS 'Descrição detalhada do produto';
COMMENT ON COLUMN products.price IS 'Preço do produto em reais';
COMMENT ON COLUMN products.category IS 'Categoria do produto';
COMMENT ON COLUMN products.image IS 'URL da imagem do produto';
COMMENT ON COLUMN products.in_stock IS 'Se o produto está em estoque';

-- web_admin_permissions.sql 