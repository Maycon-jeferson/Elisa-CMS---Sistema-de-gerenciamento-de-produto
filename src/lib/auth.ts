import bcrypt from 'bcryptjs'

// Credenciais do administrador (em produção, use banco de dados)
const ADMIN_EMAIL = 'admin@elizacms.com'
const ADMIN_PASSWORD_HASH = '$2b$12$T6ipKg9eod59uRBhkza8HO/87Hv9hfSGGq5SeDKqriqUOcHb.X9cy'

// Interface para o payload do JWT
interface JWTPayload {
  email: string
  role: 'admin'
  iat: number
  exp: number
}

export class AuthService {
  // Verificar credenciais
  static async verifyCredentials(email: string, password: string): Promise<boolean> {
    try {
      // Verificar email
      if (email !== ADMIN_EMAIL) {
        return false
      }

      // Verificar senha com bcrypt
      const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
      return isValid
    } catch {
      return false
    }
  }

  // Gerar token simples (sem JWT para evitar problemas client-side)
  static generateToken(email: string): string {
    const payload = {
      email,
      role: 'admin',
      timestamp: Date.now()
    }

    // Usar base64 para simular um token
    return btoa(JSON.stringify(payload))
  }

  // Verificar token simples
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = JSON.parse(atob(token))
      
      // Verificar se o token não expirou (24 horas)
      const tokenAge = Date.now() - decoded.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas em ms
      
      if (tokenAge > maxAge) {
        return null
      }

      return {
        email: decoded.email,
        role: decoded.role,
        iat: decoded.timestamp,
        exp: decoded.timestamp + maxAge
      }
    } catch {
      return null
    }
  }

  // Gerar hash de senha (para criar novas senhas)
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }
}

// Função para gerar nova senha hash (use apenas uma vez para criar a senha)
export async function generatePasswordHash(password: string): Promise<string> {
  return AuthService.hashPassword(password)
} 