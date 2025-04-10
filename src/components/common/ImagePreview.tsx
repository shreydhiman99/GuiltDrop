"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

export default function ImagePreview({ image, callback }: { image: string, callback: () => void }) {
  return (
    <div className='relative border-2 rounded-xl w-64 h-64 overflow-hidden'>
      <Image 
        className='w-full h-full object-cover' 
        src={image} 
        alt="image" 
        width={256} 
        height={256} 
      />
      <Button 
        variant="secondary" 
        size="icon" 
        className='absolute top-2 right-2' 
        onClick={callback}
      >
        <X />
      </Button>
    </div>
  )
}
