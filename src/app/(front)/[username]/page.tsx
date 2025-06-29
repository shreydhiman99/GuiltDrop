import React from "react";
import { createClient } from "@/lib/supabase/supabaseServer";
import { notFound } from "next/navigation";
import UserProfileContent from "@/components/user/UserProfileContent";

export default async function UserProfilePage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params; // Await params in Next.js 15
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getUser(); // Use getUser() instead of getSession()

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, name, username, profile_image, email")
    .eq("username", params.username)
    .single();

  if (userError || !userData) {
    console.error("User not found:", userError?.message);
    notFound();
  }

  // Fetch user posts using the new function
  const { data: posts, error: postsError } = await supabase.rpc(
    "get_user_posts_with_likes",
    {
      target_username: params.username,
      request_user_id: sessionData.user?.id,
    }
  );

  if (postsError) {
    console.error("Error fetching user posts:", postsError.message);
  }

  console.log(
    "Fetched posts for user:",
    params.username,
    "Posts count:",
    posts?.length || 0
  );

  return (
    <UserProfileContent
      user={userData}
      initialPosts={posts || []}
      currentUserId={sessionData.user?.id || ""}
    />
  );
}
