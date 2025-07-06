import ProductsTable from '@/components/ProductsTable'
import AdminLoginModal from '@/components/AdminLoginModal'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eliza CMS</h1>
            <p className="mt-2 text-gray-600">Sistema de gerenciamento de produtos</p>
          </div>
          <AdminLoginModal />
        </div>
        
        <ProductsTable />
      </div>
    </div>
  )
}
