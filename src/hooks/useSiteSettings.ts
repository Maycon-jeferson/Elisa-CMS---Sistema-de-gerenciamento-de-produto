import { useState, useEffect } from 'react'
import { loadSiteSettings, SiteSettings } from '@/lib/supabase'

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Primeiro tenta carregar do localStorage como fallback
      const localSettings = localStorage.getItem('siteSettings')
      if (localSettings) {
        const parsed = JSON.parse(localSettings)
        setSettings({
          id: 0,
          whatsapp_number: parsed.whatsappNumber || '5511999999999',
          site_name: parsed.siteName || 'Eliza CMS',
          title: parsed.title || 'Catálogo de Produtos Naturais',
          subtitle: parsed.subtitle || 'Descubra produtos naturais de qualidade',
          slogan: parsed.slogan || 'Naturais como a natureza',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      // Depois tenta carregar do banco de dados
      const dbSettings = await loadSiteSettings()
      if (dbSettings) {
        setSettings(dbSettings)
        // Atualiza o localStorage com os dados do banco
        localStorage.setItem('siteSettings', JSON.stringify({
          whatsappNumber: dbSettings.whatsapp_number,
          siteName: dbSettings.site_name,
          title: dbSettings.title,
          subtitle: dbSettings.subtitle,
          slogan: dbSettings.slogan
        }))
      }
    } catch (err) {
      setError('Erro ao carregar configurações do site')
      console.error('Erro ao carregar configurações:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const refreshSettings = () => {
    loadSettings()
  }

  return {
    settings,
    loading,
    error,
    refreshSettings
  }
} 