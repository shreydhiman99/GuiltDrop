"use client"
import { MenuIcon, Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import AddPost from '../posts/AddPost'
import {User as SupabaseUser} from "@supabase/supabase-js"
import { SettingDropdown } from './SettingDropdown'

export default function MobileApp({user}:{user:SupabaseUser}) {
    if (!user) {
        console.error("User is undefined in MobileApp");
        return null; // Render nothing if user is not available
    }
    return (
        <div className='md:hidden'>
            <nav className='flex justify-between items-center p-2'>
                <MenuIcon size={30} />
                <Image src="/images/logo_5121.png" alt="logo" width={40} height={40} />
                <SettingDropdown />
                {/* <Settings size={30} /> */}


            </nav>
            <button className='fixed bottom-2 right-2 bg-primary h-12 w-14 rounded-full flex justify-center items-center text-white cursor-pointer shadow-lg hover:bg-primary/80 transition duration-300 ease-in-out'> 
                
                 <AddPost user={user} children={<Plus size={30}/>}/>
                
           </button>
           
        </div>
    )
}
// "use client"
// import { MenuIcon, Settings } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'

// export default function MobileApp() {
//     return (
//         <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md z-50'>
//             <nav className='flex justify-between items-center p-4'>
//                 {/* Menu Icon */}
//                 <button className='p-2 rounded-full hover:bg-gray-100'>
//                     <MenuIcon size={30} />
//                 </button>

//                 {/* Logo */}
//                 <div>
//                     <Image src="/images/logo_512.png" alt="logo" width={40} height={40} />
//                 </div>

//                 {/* Settings Icon */}
//                 <button className='p-2 rounded-full hover:bg-gray-100'>
//                     <Settings size={30} />
//                 </button>
//             </nav>
//         </div>
//     )
// }