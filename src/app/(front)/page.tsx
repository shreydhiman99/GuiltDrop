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
    <div className="w-full pt-4 pb-24 md:pb-8 px-2 md:px-4 overflow-y-auto space-y-6">
      {posts && posts.length > 0 ? (
        posts.map((post: PostType) => (
          <PostCard post={post} userId={data.session?.user.id || ''} key={post.post_id} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-lg text-gray-600 mb-2">No posts yet</p>
          <p className="text-sm text-gray-500">Be the first to share something!</p>
        </div>
      )}
    </div>
  )
}
