import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BlogTable from './BlogTable'

export const metadata = { title: 'Blog | Raid Ready Labs Admin' }

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(id, name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hearthstone">Blog</h1>
          <p className="text-hearthstone/50 text-sm mt-1">{posts?.length || 0} posts</p>
        </div>
        <Link href="/admin/blog/new" className="admin-btn-primary">+ New Post</Link>
      </div>
      <BlogTable posts={posts || []} />
    </div>
  )
}
