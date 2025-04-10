import { Button } from '@/components/ui/button'
import React from 'react'
import {createClient} from '@/lib/supabase/supabaseServer'
import { cookies } from 'next/headers' 
import PostCard from '@/components/posts/PostCard';

export default async function App() {
  const supabase = await createClient(cookies());
  const { data } = await supabase.auth.getSession();
  const { data:posts, error } = await supabase.from("posts").select("id, content, image, reply_count, likes_count, created_at, users(id, name, username, profile_image)")

  console.log("Posts", posts)
  console.log("Error", error)
  return (
    <div>
      { posts && posts.length > 0 && posts.map((items, index) => <PostCard post={items} key={index} />)}

      {/* <Button>Hello CHeck</Button>
      {JSON.stringify(data.session?.user)} */}
    </div>
  )
}
