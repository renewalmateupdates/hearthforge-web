import { createClient } from '@/lib/supabase/server'
import BlogPostForm from '../BlogPostForm'

export const metadata = { title: 'New Post | Raid Ready Labs Admin' }

export default async function NewBlogPostPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('blog_categories').select('*').order('name')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-hearthstone">New Blog Post</h1>
        <p className="text-hearthstone/50 text-sm mt-1">Write something from the workshop.</p>
      </div>
      <BlogPostForm categories={categories || []} />
    </div>
  )
}
