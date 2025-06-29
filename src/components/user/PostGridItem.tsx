"use client";
import React from "react";
import Image from "next/image";
import { getS3Url } from "@/lib/healper";
import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type PostGridItemProps = {
  post: PostType;
};

export default function PostGridItem({ post }: PostGridItemProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to home page
    router.push("/");
  };

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

  return (
    <div
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
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
        // Text-based post - show first three words
        <div className="p-4 h-full flex flex-col justify-center items-center bg-white border border-gray-200 group-hover:bg-gray-50 transition-all duration-200">
          <div className="text-center mb-3">
            <p className="text-base font-medium text-gray-800 leading-tight">
              {getFirstThreeWords(post.content)}
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart size={14} />
              <span>{post.likes_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={14} />
              <span>{post.reply_count || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
