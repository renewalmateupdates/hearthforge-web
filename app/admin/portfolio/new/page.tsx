import PortfolioForm from '../PortfolioForm'

export const metadata = { title: 'New Portfolio Item | Raid Ready Labs Admin' }

export default function NewPortfolioPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">New Portfolio Item</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Showcase a new project.</p>
      </div>
      <PortfolioForm />
    </div>
  )
}
