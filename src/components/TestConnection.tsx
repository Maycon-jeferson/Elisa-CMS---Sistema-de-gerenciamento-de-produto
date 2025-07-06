'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnection() {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResult('')

    try {
      // Teste 1: Verificar se consegue conectar
      setTestResult('🔍 Testando conexão com Supabase...\n')
      
      // Teste 2: Verificar se a tabela existe e sua estrutura
      setTestResult(prev => prev + '📋 Verificando estrutura da tabela...\n')
      
      const { data: tableInfo, error: tableError } = await supabase
        .from('products')
        .select('*')
        .limit(1)

      if (tableError) {
        setTestResult(prev => prev + `❌ Erro ao acessar tabela: ${tableError.message}\n`)
        setTestResult(prev => prev + `Código: ${tableError.code}\n`)
        setTestResult(prev => prev + `Detalhes: ${JSON.stringify(tableError.details)}\n`)
        return
      }

      setTestResult(prev => prev + `✅ Tabela 'products' acessível\n`)
      setTestResult(prev => prev + `📊 Estrutura encontrada: ${JSON.stringify(tableInfo?.[0] || {}, null, 2)}\n`)

      // Teste 3: Tentar inserir um produto de teste
      const testProduct = {
        name: 'Produto Teste ' + Date.now(),
        description: 'Descrição de teste',
        price: 10.50,
        category: 'Teste',
        in_stock: true,
        stock: 10,
        rating: 4.5
      }

      setTestResult(prev => prev + '\n🔄 Tentando inserir produto de teste...\n')
      setTestResult(prev => prev + `📝 Dados: ${JSON.stringify(testProduct, null, 2)}\n`)

      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([testProduct])
        .select()

      if (insertError) {
        setTestResult(prev => prev + `❌ Erro ao inserir: ${insertError.message}\n`)
        setTestResult(prev => prev + `Código: ${insertError.code}\n`)
        setTestResult(prev => prev + `Detalhes: ${JSON.stringify(insertError.details)}\n`)
        setTestResult(prev => prev + `Hint: ${insertError.hint || 'Nenhuma dica disponível'}\n`)
        return
      }

      setTestResult(prev => prev + `✅ Produto inserido com sucesso!\n`)
      setTestResult(prev => prev + `🆔 ID: ${insertData?.[0]?.id}\n`)
      setTestResult(prev => prev + `📄 Dados retornados: ${JSON.stringify(insertData?.[0], null, 2)}\n`)

      // Teste 4: Deletar o produto de teste
      if (insertData?.[0]?.id) {
        setTestResult(prev => prev + '\n🗑️ Removendo produto de teste...\n')
        
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', insertData[0].id)

        if (deleteError) {
          setTestResult(prev => prev + `⚠️ Erro ao deletar produto de teste: ${deleteError.message}\n`)
        } else {
          setTestResult(prev => prev + `✅ Produto de teste removido\n`)
        }
      }

      setTestResult(prev => prev + '\n🎉 Todos os testes passaram! O sistema está funcionando corretamente.\n')

    } catch (err) {
      setTestResult(prev => prev + `❌ Erro geral: ${err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Erro desconhecido'}\n`)
      setTestResult(prev => prev + `Stack: ${err && typeof err === 'object' && 'stack' in err ? String(err.stack) : 'N/A'}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testSimpleInsert = async () => {
    setLoading(true)
    setTestResult('')

    try {
      setTestResult('🧪 Teste simples de inserção...\n')
      
      const simpleProduct = {
        name: 'Teste Simples',
        price: 5.00
      }

      setTestResult(prev => prev + `📝 Inserindo: ${JSON.stringify(simpleProduct)}\n`)

      const { data, error } = await supabase
        .from('products')
        .insert([simpleProduct])
        .select()

      if (error) {
        setTestResult(prev => prev + `❌ Erro: ${error.message}\n`)
        setTestResult(prev => prev + `Código: ${error.code}\n`)
        setTestResult(prev => prev + `Detalhes: ${JSON.stringify(error.details)}\n`)
      } else {
        setTestResult(prev => prev + `✅ Sucesso! ID: ${data?.[0]?.id}\n`)
        
        // Limpar o produto de teste
        if (data?.[0]?.id) {
          await supabase.from('products').delete().eq('id', data[0].id)
        }
      }

    } catch (err) {
      setTestResult(prev => prev + `❌ Erro: ${err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Erro desconhecido'}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Diagnóstico de Problemas</h3>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testando...' : '🔍 Teste Completo'}
        </button>
        
        <button
          onClick={testSimpleInsert}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testando...' : '🧪 Teste Simples'}
        </button>
      </div>

      {testResult && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-900 mb-2">📋 Resultado:</h4>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{testResult}</pre>
        </div>
      )}
    </div>
  )
} 