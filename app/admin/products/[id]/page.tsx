import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '../ProductForm'

export const metadata = { title: 'Edit Product | Raid Ready Labs Admin' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Edit Product</h1>
        <p className="text-hearthstone/50 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
