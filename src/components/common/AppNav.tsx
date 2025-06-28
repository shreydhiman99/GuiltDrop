"use client"
import Image from 'next/image'
import React from 'react'
import {Bell, HomeIcon, Search, Settings, StickyNote, User} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AddPost from '../posts/AddPost'
import { User as SupabaseUser } from "@supabase/supabase-js"
import { SettingDropdown } from './SettingDropdown'
import NotificationBadge from '../notifications/NotificationBadge'

export default function AppNav({user}:{user:SupabaseUser}) {
    const pathName = usePathname()
    console.log("The path name is ", pathName);
  return (
    <nav className='hidden md:flex justify-between items-center p-4'>
        <Image src="/images/logo_512.png" alt="logo" width={100} height={100} />
        
        <div className='flex space-x-12'>
            <Link 
            href="/"
            className={`cursor-pointer hover:text-foreground ${pathName === "/" ? "text_foreground" : "text-gray-500"}`}> <HomeIcon size={30}/> </Link>
            
            <Link 
            href="/Search"
            className={`cursor-pointer hover:text-foreground ${pathName === "/Search" ? "text_foreground" : "text-gray-500"}`}> <Search size={30}/> </Link>
            
            <AddPost user={user} children={<StickyNote size={30} className='text-gray-500 cursor-pointer hover:text-foreground'/>}/>
            {/* <Link 
            href="/StickyNote"
            className={`cursor-pointer hover:text-foreground ${pathName === "/StickyNote" ? "text_foreground" : "text-gray-500"}`}>  </Link> */}
            
            <Link 
            href="/Bell"
            className={`cursor-pointer hover:text-foreground ${pathName === "/Bell" ? "text_foreground" : "text-gray-500"}`}> <Bell size={30}/> </Link>
            
            <Link 
            href="/User"
            className={`cursor-pointer hover:text-foreground ${pathName === "/User" ? "text_foreground" : "text-gray-500"}`}> <User size={30}/> </Link>
            
            
            
        </div>
        <SettingDropdown />

    </nav>
  )
}