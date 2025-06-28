"use client"
import { HomeIcon, MenuIcon, Plus, Search, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import AddPost from '../posts/AddPost'
import {User as SupabaseUser} from "@supabase/supabase-js"
import { SettingDropdown } from './SettingDropdown'
import NotificationBadge from '../notifications/NotificationBadge'

export default function MobileApp({user}:{user:SupabaseUser}) {
    if (!user) {
        console.error("User is undefined in MobileApp");
        return null;
    }
    
    const pathName = usePathname();
    
    return (
        <div className='md:hidden'>
            {/* Top navigation */}
            <nav className='flex justify-between items-center p-3 border-b'>
                <MenuIcon size={26} className="text-gray-600" />
                <Image src="/images/logo_512.png" alt="logo" width={40} height={40} />
                <SettingDropdown />
            </nav>
            
            {/* Floating action button for adding post */}
            <div className="fixed bottom-20 right-4 z-50">
                <AddPost 
                    user={user} 
                    children={
                        <div className="bg-primary h-14 w-14 rounded-full flex justify-center items-center text-white shadow-lg hover:bg-primary/90 transition">
                            <Plus size={30} />
                        </div>
                    } 
                />
            </div>
            
            {/* Bottom navigation bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md z-40">
                <div className="flex justify-around items-center py-3 px-2">
                    <Link href="/" className={`flex flex-col items-center ${pathName === "/" ? "text-primary" : "text-gray-500"}`}>
                        <HomeIcon size={24} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    
                    <Link href="/Search" className={`flex flex-col items-center ${pathName === "/Search" ? "text-primary" : "text-gray-500"}`}>
                        <Search size={24} />
                        <span className="text-xs mt-1">Search</span>
                    </Link>
                    
                    <div className="w-12"></div> {/* Spacer for FAB */}
                    
                    <div className="flex flex-col items-center">
                        <NotificationBadge userId={user.id} />
                        <span className="text-xs mt-1">Alerts</span>
                    </div>
                    
                    <Link href="/User" className={`flex flex-col items-center ${pathName === "/User" ? "text-primary" : "text-gray-500"}`}>
                        <User size={24} />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}