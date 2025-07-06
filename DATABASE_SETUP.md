# Configuração do Banco de Dados

## Tabela site_settings

Para que o sistema de configurações funcione corretamente, você precisa criar a tabela `site_settings` no seu banco Supabase.

### Passos:

1. Acesse o painel do Supabase
2. Vá para "SQL Editor"
3. Execute o script SQL do arquivo `database_setup.sql`

### Estrutura da Tabela:

```sql
CREATE TABLE site_settings (
    id BIGSERIAL PRIMARY KEY,
    whatsapp_number VARCHAR(20) NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    slogan VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Funcionalidades Implementadas:

✅ **Salvamento no Banco**: As configurações são salvas no Supabase
✅ **Carregamento Automático**: Configurações são carregadas ao abrir o modal
✅ **Atualização Inteligente**: Se já existem configurações, atualiza; senão, cria novas
✅ **Fallback LocalStorage**: Mantém backup local para casos de erro
✅ **Loading States**: Indicadores visuais durante carregamento/salvamento
✅ **Validação**: Campos obrigatórios e formatação adequada
✅ **Hook Global**: `useSiteSettings` para usar configurações em qualquer componente

### Como Usar:

1. Execute o script SQL no Supabase
2. Faça login como administrador
3. Clique em "Configurações" no header
4. Preencha os campos desejados
5. Clique em "Salvar"

### Campos Configuráveis:

- **Número do WhatsApp**: Para contato direto
- **Nome do Site**: Nome da sua empresa/site
- **Título Principal**: Título principal da página
- **Subtítulo**: Descrição secundária
- **Slogan**: Frase de impacto da marca

### Próximos Passos:

Para usar as configurações em outros componentes, importe o hook:

```typescript
import { useSiteSettings } from '@/hooks/useSiteSettings'

function MyComponent() {
  const { settings, loading } = useSiteSettings()
  
  if (loading) return <div>Carregando...</div>
  
  return (
    <div>
      <h1>{settings?.title}</h1>
      <p>{settings?.subtitle}</p>
    </div>
  )
}
``` 