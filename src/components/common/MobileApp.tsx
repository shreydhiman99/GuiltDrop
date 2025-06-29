"use client";
import { HomeIcon, MenuIcon, Plus, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddPost from "../posts/AddPost";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { SettingDropdown } from "./SettingDropdown";
import NotificationBadge from "../notifications/NotificationBadge";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function MobileApp({ user }: { user: SupabaseUser }) {
  if (!user) {
    console.error("User is undefined in MobileApp");
    return null;
  }

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
    <div className="md:hidden">
      {/* Top navigation */}
      <nav className="flex justify-between items-center p-3 border-b">
        <MenuIcon size={26} className="text-gray-600" />
        <Image
          src="/web-app-manifest-512x512.png"
          alt="logo"
          width={40}
          height={40}
        />
        <SettingDropdown />
      </nav>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md z-40">
        <div className="flex justify-around items-center py-3 px-2">
          <Link
            href="/"
            className={`flex flex-col items-center ${
              pathName === "/" ? "text-primary" : "text-gray-500"
            }`}
          >
            <HomeIcon size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/Search"
            className={`flex flex-col items-center ${
              pathName === "/Search" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Search size={24} />
            <span className="text-xs mt-1">Search</span>
          </Link>

          {/* Add Post Button - Integrated into the navigation */}
          <div className="flex flex-col items-center">
            <AddPost
              user={user}
              children={
                <div className="bg-primary w-12 h-12 rounded-full flex justify-center items-center text-white shadow-md hover:bg-primary/90">
                  <Plus size={24} />
                </div>
              }
            />
          </div>

          <div className="flex flex-col items-center">
            <NotificationBadge userId={user.id} />
            <span className="text-xs mt-1">Alerts</span>
          </div>

          <Link
            href={username ? `/${username}` : "/"}
            className={`flex flex-col items-center ${
              pathName === `/${username}` ? "text-primary" : "text-gray-500"
            }`}
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
