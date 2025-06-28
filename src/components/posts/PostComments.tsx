"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/supabaseClient'
import UserAvatar from '../common/UserAvatar'
import { createNotification, NotificationType } from '@/lib/notifications'

export default function PostComments({
  postId,
  userId,
  onCommentAdded,
}: {
  postId: number
  userId: string
  onCommentAdded?: () => void // Callback to notify parent when a comment is added
}) {
  const [showDialog, setShowDialog] = useState(false) // Toggle comment dialog
  const [newComment, setNewComment] = useState('') // New comment input
  const [loading, setLoading] = useState(false) // Loading state for comment submission
  const [comments, setComments] = useState<CommentType[]>([]) // List of comments
  const supabase = createClient(undefined)

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
      const formattedComments = data.map((comment) => {
        const user = comment.users as { username?: string; profile_image?: string } | null;
        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          post_id: comment.post_id,
          username: user?.username || 'Unknown User',
          profile_image: user?.profile_image || '',
        };
      });
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
      // Get post owner id to send notification
      const { data: postData } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single()
        
      if (postData) {
        // Create notification for post owner
        await createNotification({
          userId: userId,
          toUserId: postData.user_id,
          postId: postId,
          type: NotificationType.COMMENT
        })
      }

      setNewComment('') // Clear input
      setShowDialog(false) // Close dialog

      // Notify parent component (PostCard) about the new comment
      if (onCommentAdded) {
        onCommentAdded()
      }
    }
    setLoading(false)
  }

  return (
    <div className="relative">
      {/* Dialog Trigger */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <MessageCircle
            className="text-gray-500 hover:text-blue-500 cursor-pointer"
            onClick={() => {
              setShowDialog(true)
              fetchComments()
            }}
          />
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Add a Comment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm text-gray-700"
              rows={4}
            />
            <button
              onClick={handleAddComment}
              disabled={loading}
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4 shadow-inner transition-all duration-300 w-full max-w-3xl">
            {comments.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <UserAvatar
                      name={comment.username}
                      image={comment.profile_image || ''}
                    />
                    <div className="bg-gray-100 p-3 rounded-lg w-full">
                      <p className="text-sm font-semibold text-gray-800">
                        {comment.username}
                      </p>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}