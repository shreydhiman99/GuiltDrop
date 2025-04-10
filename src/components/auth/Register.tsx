"use client";
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { registerAction } from '@/actions/authActions'
import {useFormState} from "react-dom"
import AuthSubmitBtn  from './authSubmitBtn';
const initState ={
    status:0,
    errors:{},
}

export default function Register() {
    const [state, formAction] = React.useActionState(registerAction, initState)
  return (
    <div>
        <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                      Welcome!!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <form action={formAction}>
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" type='text' placeholder="Enter your name" name='name' />
                      <span className='text-red-500'>{state?.errors?.name}</span>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" type='text' placeholder="Enter your username" name='username' />
                      <span className='text-red-500'>{state?.errors?.username}</span>
                    
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type='email' placeholder="example@example.com" name='email' />
                      <span className='text-red-500'>{state?.errors?.email}</span>
                    
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type='password' placeholder="*******" name='password' />
                      <span className='text-red-500'>{state?.errors?.password}</span>
                    
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cpassword">Confirm Password</Label>
                      <Input id="cpassword" type="password" placeholder="*******" name="password_confirmation" />
                      {/* <span className='text-red-500'>{state?.errors?.password_confirmation}</span> */}


                    </div>
                   <AuthSubmitBtn/>
                    </form>
                  </CardContent>
                  
                </Card>
    </div>
  )
}
