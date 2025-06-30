"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { formatDate, getS3Url } from "@/lib/healper";
import UserAvatar from "../common/UserAvatar";
import PostLike from "./PostLike";
import PostComments from "./PostComments";
import ReplyCount from "./ReplyCount";
import ShowComments from "./ShowComments";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import VideoPlayer from "../common/VideoPlayer";

type PostDetailModalProps = {
  post: PostType;
  userId: string;
  children: React.ReactNode;
};

export default function PostDetailModal({
  post,
  userId,
  children,
}: PostDetailModalProps) {
  const [showComments, setShowComments] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCommentAdded = () => {
    post.reply_count += 1; // Optimistically update reply_count
  };

  // Function to get the correct image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return "";
    
    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, treat it as a storage path and use getS3Url
    return getS3Url(imageUrl);
  };

  // Calculate dynamic widths based on image aspect ratio
  const calculateLayout = () => {
    if (!post.image || !imageDimensions) {
      // Text-only post: make left and right panels equal width (50/50)
      return {
        leftWidth: "50%",
        rightWidth: "50%",
      };
    }

    const { width, height } = imageDimensions;
    const aspectRatio = width / height;
    const modalHeight = 700; // Approximate modal height

    // Calculate ideal width for the image at modal height
    const idealImageWidth = modalHeight * aspectRatio;

    // Modal total width (approximate)
    const modalWidth = window.innerWidth * 0.95;

    // Calculate what percentage the image should take
    let imagePercentage = (idealImageWidth / modalWidth) * 100;

    // Apply constraints
    const minImageWidth = 25; // Minimum 25% for readability
    const maxImageWidth = 75; // Maximum 75% to ensure comments space

    imagePercentage = Math.max(
      minImageWidth,
      Math.min(maxImageWidth, imagePercentage)
    );

    const rightPercentage = 100 - imagePercentage;

    return {
      leftWidth: `${imagePercentage}%`,
      rightWidth: `${rightPercentage}%`,
    };
  };

  const layout = calculateLayout();

  // Load image dimensions when modal opens
  useEffect(() => {
    if (open && post.image && !imageDimensions) {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setImageLoaded(true);
      };
      img.src = getS3Url(post.image);
    }
  }, [open, post.image, imageDimensions]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setImageDimensions(null);
      setImageLoaded(false);
    }
  }, [open]);

  // Generate random gradient background for text posts
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-hidden p-0 sm:!max-w-[95vw] md:!max-w-[95vw] lg:!max-w-[95vw]">
        <div className="flex flex-col lg:flex-row h-full min-h-[80vh]">
          {/* Left side - Image, Video, or Text Content */}
          <div
            className="flex items-center justify-center"
            style={{
              width: window.innerWidth >= 1024 ? layout.leftWidth : "100%",
              flexShrink: 0,
            }}
          >
            {post.image ? (
              <div className="relative w-full h-full min-h-[400px] lg:min-h-[700px] bg-black">
                {/* Show loading state until image dimensions are calculated */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                <Image
                  src={getS3Url(post.image)}
                  alt="Post image"
                  fill
                  className="object-contain"
                  unoptimized
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            ) : post.video ? (
              // Video post display
              <div className="relative w-full h-full min-h-[400px] lg:min-h-[700px] bg-black flex items-center justify-center">
                <VideoPlayer 
                  src={getS3Url(post.video)}
                  className="w-full h-full"
                />
              </div>
            ) : (
              // Text-only post display with beautiful gradient background
              <div
                className={`relative w-full h-full min-h-[400px] lg:min-h-[700px] flex items-center justify-center overflow-hidden ${getRandomGradient()}`}
              >
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute top-32 right-16 w-16 h-16 bg-white/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                  <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/25 rounded-full blur-xl animate-pulse delay-2000"></div>
                  <div className="absolute bottom-32 right-10 w-12 h-12 bg-white/30 rounded-full blur-md animate-pulse delay-500"></div>
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1500"></div>
                </div>

                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="grain"
                        patternUnits="userSpaceOnUse"
                        width="100"
                        height="100"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="1"
                          fill="white"
                          opacity="0.5"
                        />
                        <circle
                          cx="80"
                          cy="20"
                          r="1"
                          fill="white"
                          opacity="0.3"
                        />
                        <circle
                          cx="40"
                          cy="60"
                          r="1"
                          fill="white"
                          opacity="0.4"
                        />
                        <circle
                          cx="90"
                          cy="80"
                          r="1"
                          fill="white"
                          opacity="0.2"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grain)" />
                  </svg>
                </div>

                {/* Main content */}
                <div className="relative z-10 text-center max-w-lg px-8">
                  <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="mb-4">
                      <div className="w-16 h-1 bg-white/50 rounded-full mx-auto mb-6"></div>
                    </div>
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-relaxed tracking-wide drop-shadow-lg">
                      {post.content}
                    </p>
                    <div className="mt-6">
                      <div className="w-16 h-1 bg-white/50 rounded-full mx-auto"></div>
                    </div>
                  </div>

                  {/* Floating decorative quotes */}
                  <div className="absolute -top-6 -left-6 text-6xl text-white/30 font-serif">
                    "
                  </div>
                  <div className="absolute -bottom-6 -right-6 text-6xl text-white/30 font-serif rotate-180">
                    "
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Post Details */}
          <div
            className="flex flex-col bg-white"
            style={{
              width: window.innerWidth >= 1024 ? layout.rightWidth : "100%",
              flexShrink: 0,
            }}
          >
            {/* Header */}
            <div className="p-4 border-b">
              <Link
                href={`/${post.username}`}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
              >
                <UserAvatar
                  name={post.name}
                  image={post.profile_image ? getImageUrl(post.profile_image) : ""}
                />
                <div>
                  <p className="font-bold text-gray-800">{post.username}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </Link>
            </div>

            {/* Post Caption/Text (only show if there's an image) */}
            {post.image && post.content && (
              <div className="p-4 border-b">
                <p className="text-gray-700">{post.content}</p>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-4">
                <PostLike userId={userId} post={post} />
                <div className="flex space-x-2 items-center">
                  <PostComments
                    postId={post.post_id}
                    userId={userId}
                    onCommentAdded={handleCommentAdded}
                  />
                  <ReplyCount postId={post.post_id} />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowComments((prev) => !prev)}
                  className="flex items-center text-blue-500 hover:text-blue-600 font-semibold mb-4"
                >
                  {showComments ? (
                    <>
                      Hide Comments <ChevronUp className="ml-1" size={16} />
                    </>
                  ) : (
                    <>
                      Show Comments <ChevronDown className="ml-1" size={16} />
                    </>
                  )}
                </button>

                {showComments && (
                  <div className="max-h-96 overflow-y-auto">
                    <ShowComments postId={post.post_id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
