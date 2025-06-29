import React from "react";
import { createClient } from "@/lib/supabase/supabaseServer";
import InfinitePostList from "@/components/posts/InfinitePostList";

export default async function App() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  // Fetch initial posts with likes (first 10)
  const { data: posts, error } = await supabase
    .rpc("get_posts_with_likes_paginated", {
      request_user_id: data.session?.user.id,
      limit_count: 5,
      offset_count: 0,
    })
    .order("post_id", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error.message);
    return <div>Error loading posts</div>;
  }

  return (
    <InfinitePostList
      initialPosts={posts || []}
      userId={data.session?.user.id || ""}
    />
  );
}
