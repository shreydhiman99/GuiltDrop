"use client"
import React from 'react'
import {useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
export default function AuthSubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <Button className='w-full mt-3' type='submit' disabled={pending}>{pending ? "Processing" : "Submit"}</Button>
  )
}
