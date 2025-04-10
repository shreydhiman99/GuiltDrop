"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AuthSubmitBtn from './authSubmitBtn'
import { useFormState } from 'react-dom'
import { loginAction } from '@/actions/authActions'

const initState ={
    status:0,
    errors:{},
}

export default function Login() {
    const [state, formAction] = React.useActionState(loginAction,initState)
  return (
    <div>
         <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Welcome back!!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form action={formAction}>
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
            {/* <Button className='w-full mt-2'>Login</Button> */}
            <AuthSubmitBtn/>
            </form>
          </CardContent>
          
        </Card>
    </div>
  )
}
