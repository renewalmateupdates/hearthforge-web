import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, seo_title, seo_description, og_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return {
    title: post?.seo_title || post?.title || 'Blog Post',
    description: post?.seo_description || undefined,
    openGraph: post?.og_image ? { images: [post.og_image] } : undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(id, name, slug), author:profiles(full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-hearthstone/40 mb-10">
        <Link href="/" className="hover:text-hearthstone transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-hearthstone transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-hearthstone/70 line-clamp-1">{post.title}</span>
      </nav>

      {/* Category + meta */}
      {(post.category as { name: string } | null) && (
        <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-4 block">
          {(post.category as { name: string }).name}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-hearthstone mb-5 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-hearthstone/40 mb-8">
        {(post.author as { full_name: string } | null)?.full_name && (
          <span>{(post.author as { full_name: string }).full_name}</span>
        )}
        <span>·</span>
        <span>
          {post.published_at
            ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true })
            : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </span>
      </div>

      {/* Featured image */}
      {post.featured_image && (
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/8 mb-10">
          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-hearthstone/60 text-xl leading-relaxed mb-8 border-l-2 border-brand-orange pl-5">{post.excerpt}</p>
      )}

      {/* Content */}
      {post.content && (
        <div className="prose prose-sm prose-invert max-w-none">
          <div className="text-hearthstone/70 leading-relaxed whitespace-pre-wrap text-base">{post.content}</div>
        </div>
      )}

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-white/8 flex justify-between items-center">
        <Link href="/blog" className="text-sm text-hearthstone/50 hover:text-hearthstone transition-colors">
          ← All Posts
        </Link>
        <Link href="/contact" className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-amber text-white text-sm font-medium transition-colors">
          Get in Touch
        </Link>
      </div>
    </article>
  )
}
