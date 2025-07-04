"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Bell, HomeIcon, Search, StickyNote, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddPost from "../posts/AddPost";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { SettingDropdown } from "./SettingDropdown";
import NotificationBadge from "../notifications/NotificationBadge";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function AppNav({ user }: { user: SupabaseUser }) {
  const pathName = usePathname();
  const [username, setUsername] = useState<string>("");
  const supabase = createClient(undefined);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      } else {
        // Fallback: fetch from database
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setUsername(data.username);
        }
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <nav className="hidden md:flex justify-between items-center p-4 border-b">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo_512.png"
          alt="GuiltDrop"
          width={50}
          height={50}
          className="mr-2"
        />
      </Link>

      <div className="flex items-center space-x-10">
        <Link
          href="/"
          className={`flex flex-col items-center transition-colors duration-200 
                        ${
                          pathName === "/"
                            ? "text-primary font-medium"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
        >
          <HomeIcon size={26} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/Search"
          className={`flex flex-col items-center transition-colors duration-200 
                        ${
                          pathName === "/Search"
                            ? "text-primary font-medium"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
        >
          <Search size={26} />
          <span className="text-xs mt-1">Search</span>
        </Link>

        <AddPost
          user={user}
          children={
            <div className="flex flex-col items-center cursor-pointer transition-colors duration-200 text-gray-500 hover:text-gray-800">
              <StickyNote size={26} />
              <span className="text-xs mt-1">Post</span>
            </div>
          }
        />

        <div className="flex flex-col items-center">
          <NotificationBadge userId={user.id} />
          <span className="text-xs mt-1">Alerts</span>
        </div>

        <Link
          href={username ? `/${username}` : "/"}
          className={`flex flex-col items-center transition-colors duration-200 
                        ${
                          pathName === `/${username}`
                            ? "text-primary font-medium"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
        >
          <User size={26} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>

      <SettingDropdown />
    </nav>
  );
}
