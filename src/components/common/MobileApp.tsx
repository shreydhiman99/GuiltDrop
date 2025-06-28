"use client"
import { MenuIcon, Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import AddPost from '../posts/AddPost'
import { User as SupabaseUser } from "@supabase/supabase-js"
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
            <button
                className="fixed bottom-4 right-4 bg-primary h-10 w-10 rounded-full flex justify-center items-center text-white cursor-pointer shadow-lg hover:bg-primary/80 transition duration-300 ease-in-out z-50"
            >
                <AddPost user={user} children={<Plus size={30} />} />
            </button>
        </div>
    )
}