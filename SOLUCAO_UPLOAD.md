# 🔧 Solução para Erro de Upload de Imagem

## Problema Identificado
- Bucket "produtos" existe mas está vazio (`total_files = 0`)
- Erro de permissão ao tentar modificar políticas RLS
- Upload de imagens falhando

## Solução Passo a Passo

### 1. Execute o Script SQL de Limpeza
Vá para o **SQL Editor** do Supabase e execute o conteúdo de `storage_setup_clean.sql`.

Este script:
- Remove todas as políticas existentes da tabela `products`
- Cria novas políticas permissivas para desenvolvimento
- Verifica se as políticas foram criadas corretamente

### 2. Verifique a Configuração do Bucket
No Supabase Dashboard:
1. Vá para **Storage**
2. Clique no bucket **"produtos"**
3. Verifique se está marcado como **"Public bucket"**
4. Se não estiver, clique em **"Edit"** e marque como público

### 3. Teste o Upload
1. Clique no botão **"🔧 Testar Storage (Debug)"** na página
2. Execute o teste de upload
3. Verifique os logs no console do navegador (F12)

### 4. Se Ainda Não Funcionar

#### Opção A: Recriar o Bucket
1. Delete o bucket "produtos" atual
2. Crie um novo bucket:
   - **Name**: `produtos`
   - **Public bucket**: ✅ Marque como público
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

#### Opção B: Usar Bucket Padrão
Se o bucket "produtos" não funcionar, o sistema tentará usar o bucket padrão.

### 5. Verificar Políticas Automáticas
O Supabase cria automaticamente políticas para buckets públicos. Para verificar:

```sql
-- Verificar políticas do storage
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### 6. Logs de Debug
Abra o console do navegador (F12) e procure por:
- `Buckets disponíveis: [lista de buckets]`
- `Usando bucket: produtos`
- `Bucket não é público` (se aparecer este aviso)

## Solução Alternativa (Se Nada Funcionar)

### Desabilitar RLS Temporariamente
Se você tiver acesso de administrador, pode desabilitar RLS:

```sql
-- APENAS PARA DESENVOLVIMENTO
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANTE**: Use apenas para desenvolvimento. Para produção, sempre use políticas de segurança.

## Verificação Final

Após aplicar as soluções:
1. ✅ Bucket "produtos" existe e é público
2. ✅ Políticas da tabela `products` configuradas
3. ✅ Upload de teste funciona
4. ✅ Criação de produto com imagem funciona

## Próximos Passos

1. Teste o upload usando o componente de debug
2. Se funcionar, teste criar um produto com imagem
3. Se tudo estiver funcionando, remova o componente de debug
4. Para produção, use o script `storage_setup.sql` com políticas de segurança

---

**Status**: Aguardando teste do upload após aplicar as soluções 