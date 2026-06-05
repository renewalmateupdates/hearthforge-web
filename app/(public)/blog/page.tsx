import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { BlogPost } from '@/types'

export const metadata = {
  title: 'Blog',
  description: 'Build updates, setup tips, and stories from the Hearthforge workshop.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(id, name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen">

      {/* Page header */}
      <section className="hf-page-header border-b border-white/5">
        <div className="hf-section">
          <h1 className="text-5xl md:text-6xl font-bold text-hearthstone mb-4">Blog</h1>
          <p className="text-hearthstone/50 text-xl">Build updates, tips, and stories from the workshop.</p>
        </div>
      </section>

      {(!posts || posts.length === 0) ? (
        <div className="hf-empty">
          <div className="hf-empty-icon">
            <span style={{fontSize: '2rem'}}>📝</span>
          </div>
          <h2 className="text-2xl font-bold text-hearthstone mb-3">Coming From the Workshop</h2>
          <p className="text-hearthstone/50 text-lg mb-8" style={{maxWidth: '28rem'}}>
            We&apos;re working on build logs, setup tips, and stories from the shop. Be the first to know when we publish.
          </p>
          <Link href="/contact"
            className="inline-block px-8 py-4 rounded-xl bg-brand-orange hover:bg-amber text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20">
            Get Notified
          </Link>
        </div>
      ) : (
        <div className="hf-section py-16">
          <div className="space-y-1">
            {/* Featured post */}
            {posts[0] && (
              <Link href={`/blog/${posts[0].slug}`} className="group block mb-8">
                <div className="rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition-colors">
                  {posts[0].featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={posts[0].featured_image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-8">
                    {(posts[0].category as { name: string } | null) && (
                      <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-3 block">
                        {(posts[0].category as { name: string }).name}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-hearthstone mb-3 group-hover:text-brand-orange transition-colors">
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && (
                      <p className="text-hearthstone/50 leading-relaxed mb-4">{posts[0].excerpt}</p>
                    )}
                    <p className="text-xs text-hearthstone/30">
                      {posts[0].published_at
                        ? formatDistanceToNow(new Date(posts[0].published_at), { addSuffix: true })
                        : formatDistanceToNow(new Date(posts[0].created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posts.slice(1).map((post: BlogPost) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition-colors">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    {(post.category as { name: string } | null) && (
                      <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-2 block">
                        {(post.category as { name: string }).name}
                      </span>
                    )}
                    <h3 className="font-semibold text-hearthstone group-hover:text-brand-orange transition-colors line-clamp-2">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-hearthstone/40 text-sm mt-1.5 line-clamp-2">{post.excerpt}</p>
                    )}
                    <p className="text-xs text-hearthstone/25 mt-3">
                      {post.published_at
                        ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
                        : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
