import React from 'react'
import { createClient } from '@/lib/supabase/supabaseServer'
import PostCard from '@/components/posts/PostCard'
import { notFound } from 'next/navigation'

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()
  const postId = parseInt(params.id)
  
  if (isNaN(postId)) {
    return notFound()
  }
  
  // Fetch the post with likes
  const { data: posts, error } = await supabase
    .rpc('get_posts_with_likes', { request_user_id: session.session?.user.id })
    .eq('post_id', postId)
    .limit(1)
    
  if (error || !posts || posts.length === 0) {
    console.error('Error fetching post:', error?.message || 'Post not found')
    return notFound()
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto pt-4 pb-24 md:pb-8 px-2 md:px-4">
      <h1 className="text-xl font-semibold mb-4">Post</h1>
      <PostCard 
        post={posts[0]} 
        userId={session.session?.user.id || ''} 
        isDetailView={true} 
      />
    </div>
  )
}