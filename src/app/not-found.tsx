"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function notFound() {
  return (
    <div className='h-screen flex justify-content items-center flex-col'>
        <Image src="/images/404.svg" width={500} height={500} alt='Page not found'></Image>
        <Link href="/">
        <Button>Back to Home</Button>
        </Link>

    </div>
  )
}
