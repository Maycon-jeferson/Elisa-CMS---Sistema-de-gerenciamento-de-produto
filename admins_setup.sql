-- Script para criar a tabela admins no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela admins
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_admin_updated_at_column();

-- Configurar RLS (Row Level Security) para a tabela admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Política para permitir login (verificação de credenciais)
CREATE POLICY "Permitir verificação de credenciais" ON admins
    FOR SELECT
    USING (true);

-- Política para permitir atualização de último login
CREATE POLICY "Permitir atualização de último login" ON admins
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Função para verificar credenciais do admin
CREATE OR REPLACE FUNCTION verify_admin_credentials(
    admin_email VARCHAR,
    admin_password_hash VARCHAR
)
RETURNS TABLE(
    id BIGINT,
    email VARCHAR,
    name VARCHAR,
    role VARCHAR,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.email,
        a.name,
        a.role,
        a.is_active
    FROM admins a
    WHERE a.email = admin_email 
      AND a.password_hash = admin_password_hash
      AND a.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar último login
CREATE OR REPLACE FUNCTION update_admin_last_login(admin_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE admins 
    SET last_login = NOW()
    WHERE id = admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir admin padrão (senha: admin123)
-- IMPORTANTE: Altere a senha em produção!
INSERT INTO admins (email, password_hash, name, role) 
VALUES (
    'admin@elizacms.com',
    '$2b$12$T6ipKg9eod59uRBhkza8HO/87Hv9hfSGGq5SeDKqriqUOcHb.X9cy', -- admin123
    'Administrador',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Comentários sobre a estrutura
COMMENT ON TABLE admins IS 'Tabela de administradores do sistema';
COMMENT ON COLUMN admins.email IS 'E-mail único do administrador';
COMMENT ON COLUMN admins.password_hash IS 'Hash da senha (bcrypt)';
COMMENT ON COLUMN admins.name IS 'Nome completo do administrador';
COMMENT ON COLUMN admins.role IS 'Papel/função do administrador';
COMMENT ON COLUMN admins.is_active IS 'Se o administrador está ativo';
COMMENT ON COLUMN admins.last_login IS 'Data/hora do último login';
COMMENT ON FUNCTION verify_admin_credentials IS 'Verifica credenciais do administrador';
COMMENT ON FUNCTION update_admin_last_login IS 'Atualiza data do último login'; 