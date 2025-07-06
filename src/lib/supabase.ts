import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zznfzjoyalmwrbejfbpa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bmZ6am95YWxtd3JiZWpmYnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTcxNTksImV4cCI6MjA2NzMzMzE1OX0.gTbLUk6zazs7DPlJwMJDvJZL9kO0Svn4PetBMsx9ldk'

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

// Função para salvar configurações no banco
export const saveSiteSettings = async (settings: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSettings | null> => {
  try {
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

// Função para atualizar configurações existentes
export const updateSiteSettings = async (id: number, settings: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>): Promise<SiteSettings | null> => {
  try {
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