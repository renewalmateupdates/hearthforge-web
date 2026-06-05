import { createClient } from '@/lib/supabase/server'
import { Package, Image, MessageSquare, Mail, FileText, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Dashboard | Hearthforge Admin' }

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [products, portfolio, testimonials, contacts, posts, faqs] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('faqs').select('id', { count: 'exact', head: true }),
  ])
  return {
    products: products.count || 0,
    portfolio: portfolio.count || 0,
    testimonials: testimonials.count || 0,
    unreadContacts: contacts.count || 0,
    posts: posts.count || 0,
    faqs: faqs.count || 0,
  }
}

const STAT_CARDS = [
  { key: 'products', label: 'Products', icon: Package, href: '/admin/products', color: 'text-amber' },
  { key: 'portfolio', label: 'Portfolio Items', icon: Image, href: '/admin/portfolio', color: 'text-brand-orange' },
  { key: 'posts', label: 'Blog Posts', icon: FileText, href: '/admin/blog', color: 'text-blue-400' },
  { key: 'unreadContacts', label: 'Unread Messages', icon: Mail, href: '/admin/contact', color: 'text-green-400' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials', color: 'text-purple-400' },
  { key: 'faqs', label: 'FAQs', icon: Users, href: '/admin/faq', color: 'text-rose-400' },
]

const QUICK_LINKS = [
  { label: 'Edit Homepage', href: '/admin/homepage', desc: 'Update hero, features, and CTA sections' },
  { label: 'Add Product', href: '/admin/products/new', desc: 'List a new 3D print or STL file' },
  { label: 'Upload to Portfolio', href: '/admin/portfolio/new', desc: 'Showcase a new project' },
  { label: 'Write Blog Post', href: '/admin/blog/new', desc: 'Share updates from the workshop' },
  { label: 'Site Settings', href: '/admin/settings', desc: 'Business info, logo, social links' },
  { label: 'Manage SEO', href: '/admin/seo', desc: 'Page titles, meta descriptions' },
]

export default async function AdminDashboard() {
  const supabase = await createClient()
  const stats = await getStats(supabase)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Dashboard</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CARDS.map(card => {
          const Icon = card.icon
          const value = stats[card.key as keyof typeof stats]
          return (
            <Link key={card.key} href={card.href} className="admin-card hover:border-white/20 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-hearthstone">{value}</p>
                  <p className="text-sm text-hearthstone/50 mt-1">{card.label}</p>
                </div>
                <Icon className={`w-5 h-5 ${card.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-hearthstone/40 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-3 p-4 rounded-xl border border-white/8 hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-hearthstone group-hover:text-brand-orange transition-colors">{link.label}</p>
                <p className="text-xs text-hearthstone/40 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
