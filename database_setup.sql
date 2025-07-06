-- Script para criar a tabela site_settings no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela site_settings
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

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações padrão (opcional)
INSERT INTO site_settings (whatsapp_number, site_name, title, subtitle, slogan) 
VALUES (
    '5511999999999',
    'Eliza CMS',
    'Catálogo de Produtos Naturais',
    'Descubra produtos naturais de qualidade',
    'Naturais como a natureza'
) ON CONFLICT DO NOTHING;

-- Configurar RLS (Row Level Security) se necessário
-- ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Comentários sobre a estrutura
COMMENT ON TABLE site_settings IS 'Configurações gerais do site';
COMMENT ON COLUMN site_settings.whatsapp_number IS 'Número do WhatsApp para contato (apenas números)';
COMMENT ON COLUMN site_settings.site_name IS 'Nome do site';
COMMENT ON COLUMN site_settings.title IS 'Título principal do site';
COMMENT ON COLUMN site_settings.subtitle IS 'Subtítulo do site';
COMMENT ON COLUMN site_settings.slogan IS 'Slogan do site'; 