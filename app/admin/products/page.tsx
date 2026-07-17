import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductsTable from './ProductsTable'

export const metadata = { title: 'Products | Raid Ready Labs Admin' }

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hearthstone">Products</h1>
          <p className="text-hearthstone/50 text-sm mt-1">{products?.length || 0} products</p>
        </div>
        <Link href="/admin/products/new" className="admin-btn-primary">+ Add Product</Link>
      </div>
      <ProductsTable products={products || []} />
    </div>
  )
}
