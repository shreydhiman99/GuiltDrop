"use client"
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/supabaseClient'

export default function ReplyCount({ postId }: { postId: number }) {
  const [replyCount, setReplyCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient(undefined)

  // Fetch the number of comments for the post
  useEffect(() => {
    const fetchReplyCount = async () => {
      setLoading(true)
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true }) // Fetch only the count
        .eq('post_id', postId)

      if (error) {
        console.error('Error fetching reply count:', error.message)
      } else {
        setReplyCount(count || 0)
      }
      setLoading(false)
    }

    fetchReplyCount()
  }, [postId])

  return (
    <span className="text-gray-700 text-base ">
      {loading ? '...' : replyCount}
    </span>
  )
}