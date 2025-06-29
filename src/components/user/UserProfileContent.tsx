"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import UserAvatar from "@/components/common/UserAvatar";
import { getS3Url } from "@/lib/healper";
import PostGridItem from "./PostGridItem";
import { MessageCircle } from "lucide-react";

type UserProfileContentProps = {
  user: UserType;
  initialPosts: PostType[];
  currentUserId: string;
};

export default function UserProfileContent({
  user,
  initialPosts,
  currentUserId,
}: UserProfileContentProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const supabase = createClient(undefined);

  // Function to get the correct image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return "";

    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Otherwise, treat it as a storage path and use getS3Url
    return getS3Url(imageUrl);
  };

  // Process the user data to ensure profile image URL is correct
  const processedUser = {
    ...user,
    profile_image: user.profile_image ? getImageUrl(user.profile_image) : null,
  };

  // Debug: Log the data
  useEffect(() => {
    console.log("UserProfileContent - Original User:", user);
    console.log("UserProfileContent - Processed User:", processedUser);
    console.log("UserProfileContent - Profile Image Debug:", {
      original: user.profile_image,
      processed: processedUser.profile_image,
      getS3Url_result: user.profile_image
        ? getS3Url(user.profile_image)
        : "no image",
      getImageUrl_result: user.profile_image
        ? getImageUrl(user.profile_image)
        : "no image",
    });
    console.log("UserProfileContent - Initial Posts:", initialPosts);
    console.log("UserProfileContent - Posts length:", posts.length);
  }, [user, initialPosts, posts]);

  const refreshPosts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const { data: newPosts, error } = await supabase.rpc(
        "get_user_posts_with_likes",
        {
          target_username: user.username,
          request_user_id: currentUserId || null,
        }
      );

      if (error) {
        console.error("Error loading posts:", error.message);
      } else {
        console.log("Refreshed posts:", newPosts);
        // Process posts to fix profile image URLs
        const processedPosts = (newPosts || []).map((post: PostType) => ({
          ...post,
          profile_image: post.profile_image
            ? getImageUrl(post.profile_image)
            : null,
        }));
        setPosts(processedPosts);
      }
    } catch (err) {
      console.error("Error in refreshPosts:", err);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8 p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-sm">
        <UserAvatar
          name={processedUser.name}
          image={processedUser.profile_image || ""}
          width={8}
          height={8}
        />
        {/* <h1 className="text-xl font-bold text-gray-800 mt-3">
          {processedUser.name}
        </h1> */}
        <p className="text-gray-600">@{processedUser.username}</p>
        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
          <span>{posts.length} posts</span>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {posts.map((post: PostType) => (
            <PostGridItem
              key={post.post_id}
              post={{
                ...post,
                profile_image: post.profile_image
                  ? getImageUrl(post.profile_image)
                  : "",
              }}
              userId={currentUserId || ""}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-400 mb-4">
            <MessageCircle size={48} />
          </div>
          <p className="text-lg text-gray-600 mb-2">No posts yet</p>
          <p className="text-sm text-gray-500">
            @{processedUser.username} hasn't shared anything yet
          </p>
          <button
            onClick={refreshPosts}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Posts"}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
