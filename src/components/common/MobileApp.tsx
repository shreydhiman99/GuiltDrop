"use client"
import { MenuIcon, Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function MobileApp() {
    return (
        <div className='md:hidden'>
            <nav className='flex justify-between items-center p-2'>
                <MenuIcon size={30} />
                <Image src="/images/logo_5121.png" alt="logo" width={40} height={40} />
                <Settings size={30} />


            </nav>
            <button className='absolute bottom-2 right-2 bg-primary h-12 w-14 rounded-full flex justify-center items-center text-white'>
                <Plus />
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