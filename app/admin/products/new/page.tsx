import ProductForm from '../ProductForm'

export const metadata = { title: 'New Product | Hearthforge Admin' }

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">New Product</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Add a new product to your shop.</p>
      </div>
      <ProductForm />
    </div>
  )
}
