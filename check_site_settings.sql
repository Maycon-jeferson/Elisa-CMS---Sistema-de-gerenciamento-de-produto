-- Script para verificar e criar a tabela site_settings
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT 
    'TABLE EXISTS' as check_type,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'site_settings'
    ) as table_exists;

-- 2. Se a tabela não existir, criar
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGSERIAL PRIMARY KEY,
    whatsapp_number VARCHAR(20) NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    slogan VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Criar trigger se não existir
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Inserir configurações padrão se a tabela estiver vazia
INSERT INTO site_settings (whatsapp_number, site_name, title, subtitle, slogan) 
SELECT 
    '5511999999999',
    'Eliza CMS',
    'Catálogo de Produtos Naturais',
    'Descubra produtos naturais de qualidade',
    'Naturais como a natureza'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 6. Verificar dados atuais
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

-- 7. Verificar estrutura da tabela
SELECT 
    'TABLE STRUCTURE' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'site_settings'
ORDER BY ordinal_position; 