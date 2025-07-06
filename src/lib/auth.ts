import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

// Interface para o admin
export interface Admin {
  id: number
  email: string
  name: string
  role: string
  is_active: boolean
  last_login?: string
}

// Interface para o payload do JWT
interface JWTPayload {
  id: number
  email: string
  name: string
  role: string
  iat: number
  exp: number
}

export class AuthService {
  // Verificar credenciais no banco de dados
  static async verifyCredentials(email: string, password: string): Promise<Admin | null> {
    try {
      // Primeiro, buscar o admin pelo email
      const { data: admins, error } = await supabase
        .from('admins')
        .select('id, email, password_hash, name, role, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .limit(1)

      if (error) {
        console.error('Erro ao buscar admin:', error)
        return null
      }

      if (!admins || admins.length === 0) {
        return null
      }

      const admin = admins[0]
      
      // Verificar senha com bcrypt
      const isValidPassword = await bcrypt.compare(password, admin.password_hash)
      
      if (!isValidPassword) {
        return null
      }

      // Atualizar último login
      await this.updateLastLogin(admin.id)
      
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        is_active: admin.is_active
      }
    } catch (error) {
      console.error('Erro ao verificar credenciais:', error)
      return null
    }
  }

  // Atualizar último login
  static async updateLastLogin(adminId: number): Promise<void> {
    try {
      await supabase.rpc('update_admin_last_login', {
        admin_id: adminId
      })
    } catch (error) {
      console.error('Erro ao atualizar último login:', error)
    }
  }

  // Gerar token JWT simples (base64)
  static generateToken(admin: Admin): string {
    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      timestamp: Date.now()
    }
    
    return btoa(JSON.stringify(payload))
  }

  // Verificar token
  static verifyToken(token: string): Admin | null {
    try {
      const decoded = JSON.parse(atob(token))
      
      // Verificar se o token não expirou (24 horas)
      const tokenAge = Date.now() - decoded.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas em ms
      
      if (tokenAge > maxAge) {
        return null
      }

      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        is_active: true
      }
    } catch {
      return null
    }
  }

  // Criar novo admin (para desenvolvimento)
  static async createAdmin(email: string, password: string, name: string): Promise<Admin | null> {
    try {
      const passwordHash = await bcrypt.hash(password, 12)
      
      const { data, error } = await supabase
        .from('admins')
        .insert([{
          email,
          password_hash: passwordHash,
          name,
          role: 'admin',
          is_active: true
        }])
        .select('id, email, name, role, is_active')
        .single()

      if (error) {
        console.error('Erro ao criar admin:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao criar admin:', error)
      return null
    }
  }

  // Listar admins (para desenvolvimento)
  static async listAdmins(): Promise<Admin[]> {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, name, role, is_active, last_login')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao listar admins:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erro ao listar admins:', error)
      return []
    }
  }
}

// Função para gerar nova senha hash (use apenas uma vez para criar a senha)
export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
} 