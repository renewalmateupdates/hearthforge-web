import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogPostForm from '../BlogPostForm'

export const metadata = { title: 'Edit Post | Raid Ready Labs Admin' }

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from('blog_posts').select('*').eq('id', id).single(),
    supabase.from('blog_categories').select('*').order('name'),
  ])

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">Edit Post</h1>
        <p className="text-hearthstone/50 text-sm mt-1 line-clamp-1">{post.title}</p>
      </div>
      <BlogPostForm post={post} categories={categories || []} />
    </div>
  )
}
