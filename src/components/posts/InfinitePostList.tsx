"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import PostCard from "@/components/posts/PostCard";

interface InfinitePostListProps {
  initialPosts: PostType[];
  userId: string;
}

export default function InfinitePostList({
  initialPosts,
  userId,
}: InfinitePostListProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 5); // Changed from 10 to 5
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(5); // Start from 5 since we loaded first 5
  const lastPostRef = useRef<HTMLDivElement>(null);

  const supabase = createClient(undefined);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const { data: newPosts, error } = await supabase
        .rpc("get_posts_with_likes_paginated", {
          request_user_id: userId,
          limit_count: 5,
          offset_count: offset,
        })
        .order("post_id", { ascending: false });

      if (error) {
        throw error;
      }

      if (newPosts && newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setOffset((prev) => prev + 5);
        setHasMore(newPosts.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
      setError("Failed to load more posts");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, userId, supabase]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => {
      if (lastPostRef.current) {
        observer.unobserve(lastPostRef.current);
      }
    };
  }, [loadMorePosts, hasMore, loading]);

  return (
    <div className="w-full pt-4 pb-24 md:pb-8 px-2 md:px-4 space-y-6">
      {posts.length > 0 ? (
        <>
          {posts.map((post: PostType, index: number) => (
            <div
              key={post.post_id}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <PostCard post={post} userId={userId} />
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={loadMorePosts}
                className="text-sm text-red-500 hover:text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !hasMore && posts.length > 0 && (
            <div className="flex justify-center py-4">
              <p className="text-gray-500 text-sm">
                You've reached the end of the feed
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center">
          <p className="text-lg text-gray-600 mb-2">No posts yet</p>
          <p className="text-sm text-gray-500">
            Be the first to share something!
          </p>
        </div>
      )}
    </div>
  );
}
