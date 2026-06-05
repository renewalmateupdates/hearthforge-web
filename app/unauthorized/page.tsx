import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-forge-night flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-4xl font-bold text-hearthstone mb-4">Access Denied</h1>
        <p className="text-hearthstone/50 mb-8">You do not have permission to access this area.</p>
        <Link href="/" className="admin-btn-primary px-6 py-3">
          Return Home
        </Link>
      </div>
    </div>
  )
}
