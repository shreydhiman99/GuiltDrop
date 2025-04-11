// filepath: g:\GuiltDrop\guiltdrop\src\components\posts\PostComments.tsx
"use client"
import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/supabaseClient'
import UserAvatar from '../common/UserAvatar'
import ShowComments from './ShowComments'

export default function PostComments({
  postId,
  userId,
  onCommentAdded,
}: {
  postId: number
  userId: string
  onCommentAdded?: () => void // Callback to notify parent when a comment is added
}) {
  const [showComments, setShowComments] = useState(false) // Toggle comment dropdown
  const [comments, setComments] = useState<CommentType[]>([]) // List of comments
  const [newComment, setNewComment] = useState('') // New comment input
  const [loading, setLoading] = useState(false) // Loading state for comment submission
  const supabase = createClient()

  // Fetch comments for the post
  const fetchComments = async () => {
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
  }

  // Handle comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setLoading(true)

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: userId, content: newComment })

    if (error) {
      console.error('Error adding comment:', error.message)
    } else {
      if (data && data[0]) {
        setComments((prev) => [...prev, data[0]]) // Optimistically update comments
        setNewComment('') // Clear input

        // Increment reply_count in the posts table
        await supabase.rpc('increment_reply_count', { post_id: postId })

        // Notify parent component (PostCard) about the new comment
        if (onCommentAdded) {
          onCommentAdded()
        }
      }
    }
    setLoading(false)
  }

  // Toggle comment dropdown and fetch comments
  const toggleComments = async () => {
    setShowComments((prev) => !prev)
    if (!showComments) {
      await fetchComments()
    }
  }

  return (
    <div className="relative">
      {/* MessageCircle Icon */}
      <MessageCircle
        className="text-gray-500 hover:text-blue-500 cursor-pointer"
        onClick={toggleComments}
      />

      {/* Show Comments Dialog */}
      {showComments && (
        <ShowComments
          comments={comments}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 shadow-inner transition-all duration-300 w-full max-w-3xl">
          {/* Comment Input */}
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddComment}
              disabled={loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}