import React from 'react'
import UserAvatar from '../common/UserAvatar'
import { Bookmark, HeartIcon, MessageCircle, MoreVertical, Send } from 'lucide-react'
import Image from 'next/image'
import { formatDate, getS3Url } from '@/lib/healper'

export default function PostCard({ post }: { post: PostType }) {
  return (
    <div className='w-full bg-gradient-to-b from-gray-100 to-gray-200 mt-4 rounded-2xl p-4 shadow-lg'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <div className='flex space-x-2'>
          <UserAvatar
            name={post.users?.username}
            image={post.users?.profile_image ? getS3Url(post.users?.profile_image) : ""}
          />
          <div>
            <div className='flex flex-col'>
              <p className='font-bold text-gray-800'>{post.users?.username}</p>
              <p className='text-sm text-gray-500'>{formatDate(post.created_at)}</p>
            </div>
          </div>
        </div>
        <MoreVertical className='text-gray-500 hover:text-gray-700 cursor-pointer' />
      </div>

      {/* Image & content */}
      {post.image && (
        <div className='flex justify-center'>
          <div className='rounded-lg overflow-hidden shadow-md w-full max-w-3xl'>
            <Image
              src={getS3Url(post.image)}
              width={800}
              height={800}
              alt="Post Image"
              className='w-full h-auto object-contain'
              unoptimized
            />
          </div>
        </div>
      )}
      <p className='p-2 text-gray-700'>{post.content}</p>

      {/* Footer and icon bar */}
      <div className='flex justify-between items-center mt-4'>
        <div className='flex space-x-4'>
          <HeartIcon className='text-gray-500 hover:text-red-500 cursor-pointer' />
          <MessageCircle className='text-gray-500 hover:text-blue-500 cursor-pointer' />
          <Send className='text-gray-500 hover:text-green-500 cursor-pointer' />
        </div>
        <Bookmark className='text-gray-500 hover:text-yellow-500 cursor-pointer' />
      </div>

      <div className='flex space-x-4 p-2 text-gray-600'>
        <p>likes {post.likes_count}</p>
        <p>replies {post.reply_count}</p>
      </div>
    </div>
  )
}
