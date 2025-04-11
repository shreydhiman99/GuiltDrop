import React from 'react'
import UserAvatar from '../common/UserAvatar'

interface Comment {
  id: number
  content: string
  created_at: string
  user_id: string
  username: string
  profile_image: string
}

interface ShowCommentsProps {
  comments: Comment[]
  onClose: () => void
}

const ShowComments: React.FC<ShowCommentsProps> = ({ comments, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 mb-4">
          Close
        </button>
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
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
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  )
}

export default ShowComments