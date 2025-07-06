import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zznfzjoyalmwrbejfbpa.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bmZ6am95YWxtd3JiZWpmYnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTcxNTksImV4cCI6MjA2NzMzMzE1OX0.gTbLUk6zazs7DPlJwMJDvJZL9kO0Svn4PetBMsx9ldk'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipo para a tabela products
export interface Product {
  id: number
  name: string
  description?: string
  price: number
  category: string
  image?: string
  in_stock?: boolean
}

// Tipo para as configurações do site
export interface SiteSettings {
  id: number
  whatsapp_number: string
  site_name: string
  title: string
  subtitle: string
  slogan: string
  created_at: string
  updated_at: string
}

// Função para carregar produtos (leitura pública)
export const loadProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Erro ao carregar produtos:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
    return []
  }
}

// Função para criar produto (requer autenticação de admin)
export const createProduct = async (product: Omit<Product, 'id'>, adminEmail: string): Promise<Product | null> => {
  try {
    // Verificar se o admin está autenticado
    if (!adminEmail) {
      console.error('Email do admin não fornecido')
      return null
    }

    // Inserir produto diretamente
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar produto:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro ao criar produto:', err)
    return null
  }
}

// Função para atualizar produto (requer autenticação de admin)
export const updateProduct = async (id: number, product: Partial<Omit<Product, 'id'>>, adminEmail: string): Promise<Product | null> => {
  try {
    // Verificar se o admin está autenticado
    if (!adminEmail) {
      console.error('Email do admin não fornecido')
      return null
    }

    // Atualizar produto diretamente
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar produto:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro ao atualizar produto:', err)
    return null
  }
}

// Função para deletar produto (requer autenticação de admin)
export const deleteProduct = async (id: number, adminEmail: string): Promise<boolean> => {
  try {
    // Verificar se o admin está autenticado
    if (!adminEmail) {
      console.error('Email do admin não fornecido')
      return false
    }

    // Deletar produto diretamente
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar produto:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Erro ao deletar produto:', err)
    return false
  }
}

// Função para fazer upload de imagem
export const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
  try {
    console.log('Iniciando upload de imagem:', fileName)
    
    // Primeiro, verificar quais buckets existem
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    if (bucketsError) {
      console.error('Erro ao listar buckets:', bucketsError)
      return null
    }
    
    console.log('Buckets disponíveis:', buckets.map(b => b.name))
    
    // Tentar encontrar o bucket correto
    const bucketName = buckets.find(b => b.name === 'produtos')?.name || 'produtos'
    console.log('Usando bucket:', bucketName)
    
    // Verificar se o bucket é público
    const bucket = buckets.find(b => b.name === bucketName)
    if (bucket && !bucket.public) {
      console.warn('Bucket não é público. Isso pode causar problemas de upload.')
    }
    
    // Tentar upload
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Erro no upload:', error)
      return null
    }

    console.log('Upload bem-sucedido')

    // Retorna a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    console.log('URL pública gerada:', publicUrl)
    return publicUrl
  } catch (err) {
    console.error('Erro geral ao fazer upload da imagem:', err)
    return null
  }
}

// Função para carregar configurações do banco
export const loadSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Erro ao carregar configurações:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro ao carregar configurações:', err)
    return null
  }
}

// Função para salvar configurações no banco (requer autenticação de admin)
export const saveSiteSettings = async (settings: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSettings | null> => {
  try {
    // Verificar se o usuário está autenticado usando o sistema customizado
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        console.error('Usuário não autenticado')
        return null
      }
      
      // Verificar se o token é válido
      const { AuthService } = await import('./auth')
      const admin = AuthService.verifyToken(token)
      if (!admin) {
        console.error('Token inválido ou expirado')
        localStorage.removeItem('admin_token')
        return null
      }
    }

    const { data, error } = await supabase
      .from('site_settings')
      .insert([settings])
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar configurações:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro ao salvar configurações:', err)
    return null
  }
}

// Função para atualizar configurações existentes (requer autenticação de admin)
export const updateSiteSettings = async (id: number, settings: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>): Promise<SiteSettings | null> => {
  try {
    // Verificar se o usuário está autenticado usando o sistema customizado
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        console.error('Usuário não autenticado')
        return null
      }
      
      // Verificar se o token é válido
      const { AuthService } = await import('./auth')
      const admin = AuthService.verifyToken(token)
      if (!admin) {
        console.error('Token inválido ou expirado')
        localStorage.removeItem('admin_token')
        return null
      }
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar configurações:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Erro ao atualizar configurações:', err)
    return null
  }
} 