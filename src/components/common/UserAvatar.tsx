import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar({name, image, width=3, height=3}:
    {name?: string, image?: string, width?: number, height?: number} ) {

  return (
    <Avatar style={{width: `${width}rem`, height: `${height}rem`}} >
  <AvatarImage src={image} />
  <AvatarFallback className='text-xl font-bold'>{name ? name[0].toUpperCase() : "?"}</AvatarFallback>
</Avatar>

  )
}
