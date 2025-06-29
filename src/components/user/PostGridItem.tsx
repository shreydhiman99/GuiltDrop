"use client";
import React from "react";
import Image from "next/image";
import { getS3Url } from "@/lib/healper";
import { Heart, MessageCircle } from "lucide-react";
import PostDetailModal from "../posts/PostDetailModal";

type PostGridItemProps = {
  post: PostType;
  userId?: string; // Add userId prop
};

export default function PostGridItem({ post, userId = "" }: PostGridItemProps) {
  // Helper function to get first three words
  const getFirstThreeWords = (text: string) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) {
      return text;
    }
    return words.slice(0, 3).join(" ") + "...";
  };

  // Check if post has an image - proper null/undefined checking
  const hasImage = post.image && post.image.trim() !== "";

  // Generate random gradient background for text posts (same as modal)
  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600",
      "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
      "bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500",
      "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
      "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
      "bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500",
      "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500",
      "bg-gradient-to-br from-orange-400 via-pink-500 to-red-500",
      "bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600",
      "bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500",
    ];

    // Use post ID to consistently get the same gradient for the same post
    const index = post.post_id % gradients.length;
    return gradients[index];
  };

  return (
    <PostDetailModal post={post} userId={userId}>
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group">
        {hasImage ? (
          <img
            src={getS3Url(post.image!)}
            alt="Post image"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) =>
              console.error("Image failed to load:", getS3Url(post.image!))
            }
          />
        ) : (
          // Text-based post with beautiful gradient background
          <div
            className={`relative h-full flex flex-col justify-center items-center overflow-hidden transition-all duration-300 group-hover:scale-105 ${getRandomGradient()}`}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-md animate-pulse"></div>
              <div className="absolute top-4 right-3 w-6 h-6 bg-white/20 rounded-full blur-sm animate-pulse delay-1000"></div>
              <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/25 rounded-full blur-lg animate-pulse delay-2000"></div>
              <div className="absolute bottom-4 right-2 w-4 h-4 bg-white/30 rounded-full blur-sm animate-pulse delay-500"></div>
            </div>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-3 py-4">
              <div className="backdrop-blur-sm bg-white/15 rounded-xl p-3 shadow-lg border border-white/20 mb-3">
                <p className="text-sm font-bold text-white leading-tight drop-shadow-md">
                  {getFirstThreeWords(post.content)}
                </p>
              </div>

              {/* Stats with glassmorphism effect */}
              <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
                <div className="flex items-center justify-center space-x-4 text-xs text-white/90">
                  <div className="flex items-center space-x-1">
                    <Heart size={12} className="drop-shadow-sm" />
                    <span className="font-medium drop-shadow-sm">
                      {post.likes_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={12} className="drop-shadow-sm" />
                    <span className="font-medium drop-shadow-sm">
                      {post.reply_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
          </div>
        )}
      </div>
    </PostDetailModal>
  );
}
