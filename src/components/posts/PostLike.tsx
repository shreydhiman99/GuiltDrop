"use client"
import { HeartIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/supabaseClient'

export default function PostLike({ post, userId }: { post: PostType; userId: string }) {
  const [isLiked, setIsLiked] = useState(post.liked || false) // Use initial like state from post
  const [likeCount, setLikeCount] = useState(post.likes_count || 0) // Use initial like count
  const supabase = createClient(undefined)

  const fetchUpdatedLikeCount = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', post.post_id)
      .single()

    if (error) {
      console.error('Error fetching updated like count:', error.message)
    }

    if (data) {
      setLikeCount(data.likes_count || 0)
    }
  }

  const toggleLike = async () => {
    if (isLiked) {
      // Unlike the post
      setIsLiked(false)
      setLikeCount((prev) => prev - 1) // Optimistic UI update

      // Remove the like from the database
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .match({ post_id: post.post_id, user_id: userId })

      if (deleteError) {
        console.error('Error unliking the post:', deleteError.message)
      }

      // Decrement the like count in the posts table
      const { error: decrementError } = await supabase.rpc('like_decrement', {
        row_id: post.post_id,
        count: 1,
      })

      if (decrementError) {
        console.error('Error decrementing like count:', decrementError.message)
      }

      // Fetch the updated like count
      await fetchUpdatedLikeCount()
    } else {
      // Like the post
      setIsLiked(true)
      setLikeCount((prev) => prev + 1) // Optimistic UI update

      // Add the like to the database
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ post_id: post.post_id, user_id: userId })

      if (insertError) {
        console.error('Error liking the post:', insertError.message)
      }

      // Increment the like count in the posts table
      const { error: incrementError } = await supabase.rpc('like_increment', {
        row_id: post.post_id,
        count: 1,
      })

      if (incrementError) {
        console.error('Error incrementing like count:', incrementError.message)
      }

      // Fetch the updated like count
      await fetchUpdatedLikeCount()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <HeartIcon
        className={`cursor-pointer transition-transform duration-200 ${
          isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500 hover:text-red-500'
        }`}
        onClick={toggleLike}
      />
      <span className="text-gray-700">{likeCount}</span>
    </div>
  )
}
