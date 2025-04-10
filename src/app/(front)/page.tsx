import React from 'react'
import { createClient } from '@/lib/supabase/supabaseServer'
import PostCard from '@/components/posts/PostCard'

export default async function App() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  // Fetch posts with likes
  const { data: posts, error } = await supabase
    .rpc('get_posts_with_likes', { request_user_id: data.session?.user.id })
    .order('post_id', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
    return <div>Error loading posts</div>
  }

  return (
    <div>
      {posts && posts.length > 0 && posts.map((post: PostType) => (
        <PostCard post={post} userId={data.session?.user.id || ''} key={post.post_id} />
      ))}
    </div>
  )
}
