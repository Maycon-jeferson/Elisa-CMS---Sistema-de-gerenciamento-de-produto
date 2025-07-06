'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { loadProducts } from '@/lib/supabase'

export default function TestConnection() {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResult('Iniciando testes...\n')

    try {
      // Teste 1: Conexão básica
      setTestResult(prev => prev + '🔍 Testando conexão básica...\n')
      const { data, error } = await supabase.from('products').select('count')
      
      if (error) {
        setTestResult(prev => prev + `❌ Erro na conexão: ${error.message}\n`)
      } else {
        setTestResult(prev => prev + `✅ Conexão básica OK\n`)
      }

      // Teste 2: Verificar se a tabela products existe
      setTestResult(prev => prev + '🔍 Verificando tabela products...\n')
      const { data: tableData, error: tableError } = await supabase
        .from('products')
        .select('*')
        .limit(1)

      if (tableError) {
        setTestResult(prev => prev + `❌ Erro na tabela products: ${tableError.message}\n`)
      } else {
        setTestResult(prev => prev + `✅ Tabela 'products' acessível\n`)
      }

      // Teste 3: Contar produtos
      setTestResult(prev => prev + '🔍 Contando produtos...\n')
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        setTestResult(prev => prev + `❌ Erro ao contar produtos: ${countError.message}\n`)
      } else {
        setTestResult(prev => prev + `✅ Total de produtos: ${count || 0}\n`)
      }

      // Teste 4: Testar função loadProducts
      setTestResult(prev => prev + '🔍 Testando função loadProducts...\n')
      try {
        const products = await loadProducts()
        setTestResult(prev => prev + `✅ loadProducts retornou ${products.length} produtos\n`)
        
        if (products.length > 0) {
          setTestResult(prev => prev + `📋 Primeiro produto: ${products[0].name}\n`)
        }
      } catch (loadError) {
        setTestResult(prev => prev + `❌ Erro em loadProducts: ${loadError}\n`)
      }

      // Teste 5: Verificar políticas RLS (simplificado)
      setTestResult(prev => prev + '🔍 Verificando políticas RLS...\n')
      try {
        // Tentar uma operação que seria bloqueada por RLS se mal configurado
        const { data: rlsTest, error: rlsError } = await supabase
          .from('products')
          .select('id')
          .limit(1)

        if (rlsError && rlsError.message.includes('policy')) {
          setTestResult(prev => prev + `❌ Problema com políticas RLS: ${rlsError.message}\n`)
        } else {
          setTestResult(prev => prev + `✅ Políticas RLS parecem estar OK\n`)
        }
      } catch (rlsError) {
        setTestResult(prev => prev + `⚠️ Erro ao verificar RLS: ${rlsError}\n`)
      }

      // Teste 6: Testar inserção (apenas se não houver produtos)
      if (count === 0) {
        setTestResult(prev => prev + '🔍 Testando inserção de produto...\n')
        const testProduct = {
          name: 'Produto Teste',
          description: 'Produto para teste de conexão',
          price: 29.99,
          category: 'Teste',
          in_stock: true
        }

        const { data: insertData, error: insertError } = await supabase
          .from('products')
          .insert([testProduct])
          .select()
          .single()

        if (insertError) {
          setTestResult(prev => prev + `❌ Erro ao inserir produto: ${insertError.message}\n`)
        } else {
          setTestResult(prev => prev + `✅ Produto inserido com sucesso (ID: ${insertData.id})\n`)
          
          // Remover o produto de teste
          await supabase.from('products').delete().eq('id', insertData.id)
          setTestResult(prev => prev + `🗑️ Produto de teste removido\n`)
        }
      }

      setTestResult(prev => prev + '\n🎉 Testes concluídos!\n')

    } catch (error) {
      setTestResult(prev => prev + `❌ Erro geral: ${error}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Teste de Conexão - Tabela Products</h2>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-4 px-6 py-3 bg-gradient-to-r from-[#8b4513] to-[#d2691e] text-white font-semibold rounded-lg hover:from-[#a0522d] hover:to-[#8b4513] transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Executando testes...' : 'Executar Testes'}
      </button>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">Resultados:</h3>
        <pre className="text-sm text-[#2c3e50] whitespace-pre-wrap font-mono">
          {testResult || 'Clique em "Executar Testes" para começar...'}
        </pre>
      </div>

      <div className="mt-4 text-sm text-[#7f8c8d]">
        <p><strong>Dicas:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Verifique se a tabela 'products' existe no Supabase</li>
          <li>Confirme se as políticas RLS estão configuradas corretamente</li>
          <li>Verifique se as variáveis de ambiente estão corretas</li>
          <li>Se houver erro de RLS, execute o script storage_setup.sql</li>
        </ul>
      </div>
    </div>
  )
} 