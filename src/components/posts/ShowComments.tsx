"use client"
import React, { useEffect, useState } from 'react'
import UserAvatar from '../common/UserAvatar'
import { createClient } from '@/lib/supabase/supabaseClient'

export default function ShowComments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          post_id,
          users (
            username,
            profile_image
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error.message)
      } else {
        const formattedComments = data.map((comment) => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          post_id: comment.post_id,
          username: comment.users?.username || 'Unknown User',
          profile_image: comment.users?.profile_image || '',
        }))
        setComments(formattedComments)
      }
      setLoading(false)
    }

    fetchComments()
  }, [postId])

  return (
    <div className="space-y-4 max-h-60 overflow-y-auto">
      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3">
            <UserAvatar
              name={comment.username}
              image={comment.profile_image || ''}
            />
            <div className="bg-gray-100 p-3 rounded-lg w-full">
              <p className="text-sm font-semibold text-gray-800">{comment.username}</p>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}