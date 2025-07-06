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
  rating?: number
  stock?: number
  created_at: string
} 