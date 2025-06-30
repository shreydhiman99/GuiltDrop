"use client";

import React, { useState } from "react";
import UserAvatar from "../common/UserAvatar";
import { Bookmark, Send, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { formatDate, getS3Url } from "@/lib/healper";
import PostLike from "./PostLike";
import PostComments from "./PostComments";
import ShowComments from "./ShowComments";
import ReplyCount from "./ReplyCount";
import Link from "next/link";
import VideoPlayer from "../common/VideoPlayer";

// Update the component props type definition at the top of your file
type PostCardProps = {
  post: PostType;
  userId: string;
  isDetailView?: boolean; // Add this optional prop
  key?: React.Key;
};

// Then update your component definition
export default function PostCard({
  post,
  userId,
  isDetailView = false,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false); // State to toggle comments visibility

  const handleCommentAdded = () => {
    post.reply_count += 1; // Optimistically update reply_count
  };

 

  return (
    <div
      className={`w-full bg-gradient-to-b from-gray-100 to-gray-200 mt-4 rounded-2xl p-4 shadow-lg ${
        isDetailView ? "border-2 border-primary" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Link
            href={`/${post.username}`}
            className="flex space-x-2 hover:opacity-80 transition-opacity"
          >
            <UserAvatar
              name={post.name}
              image={post.profile_image ? getS3Url(post.profile_image) : ""}
            />
            <div>
              <div className="flex flex-col">
                <p className="font-bold text-gray-800">{post.username}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Image & content */}
      {post.image && (
        <div className="flex justify-center">
          <div className="rounded-lg overflow-hidden shadow-md w-full max-w-3xl">
            <Image
              src={getS3Url(post.image)}
              width={800}
              height={800}
              alt="Post Image"
              className="w-full h-auto object-contain"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Video content */}
      {post.video && (
        <div className="flex justify-center my-3">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-md">
            <VideoPlayer
              src={getS3Url(post.video)}
              className="w-full"
            />
          </div>
        </div>
      )}

      <p className="p-2 text-gray-700">{post.content}</p>

      {/* If in detail view, you might want to show more content or comments */}
      {isDetailView && (
        <div className="p-3 bg-gray-50 border-b">
          <span className="text-sm text-gray-500">Viewing full post</span>
        </div>
      )}

      {/* Footer and icon bar */}
      <div className="relative mt-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <PostLike userId={userId} post={post} />
            <div className="flex space-x-2 items-center">
              {/* Comment Button */}
              <PostComments
                postId={post.post_id}
                userId={userId}
                onCommentAdded={handleCommentAdded}
              />

              {/* Reply Count */}
              <ReplyCount postId={post.post_id} />
            </div>
            <Send className="text-gray-500 hover:text-green-500 cursor-pointer" />
          </div>
          <Bookmark className="text-gray-500 hover:text-yellow-500 cursor-pointer" />
        </div>

        {/* Dropdown Button to Show/Hide Comments */}
        <div className="relative mt-4">
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center text-blue-500 hover:text-blue-600 font-semibold relative z-10"
          >
            {showComments ? (
              <>
                Hide Comments <ChevronUp className="ml-1" />
              </>
            ) : (
              <>
                Show Comments <ChevronDown className="ml-1" />
              </>
            )}
          </button>

          {/* ShowComments Component */}
          {showComments && (
            <div className="relative z-0">
              <ShowComments postId={post.post_id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
