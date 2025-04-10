"use server"
import { LoginValidator, RegisterValidator } from '@/validations/authSchema';
import vine, { errors } from '@vinejs/vine'
import { createClient } from "@/lib/supabase/supabaseServer"
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function registerAction(prevSate: any, formdata: FormData) {
    const supabase = createClient()
    try {
        console.log("The data is ", formdata);
        const data = {
            name: formdata.get("name"),
            username: formdata.get("username"),
            email: formdata.get("email"),
            password: formdata.get("password"),
            password_confirmation: formdata.get("password_confirmation")
        }
        const payload = await RegisterValidator.validate(data)
        // check username if exists
        const { data: userData } = await (await supabase).from("users").select("id").eq("username", payload.username);

        if (userData && userData?.length > 0) {
            return {
                status: 400,
                errors: {
                    username: "Username already exists"
                }
            }
        }

        // check email if exists
        const { data: emailData } = await (await supabase).from("users").select("id").eq("email", payload.email);

        if (emailData && emailData?.length > 0) {
            return {
                status: 400,
                errors: {
                    email: "Email already exists"
                }
            }
        }

        const { error: signUpError } = await (await supabase).auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
                data: {
                    name: payload.name,
                    username: payload.username
                }
            }
        })

        if (signUpError) {
            return {
                status: 400,
                errors: {
                    email: signUpError.message
                }
            }
        }

        await (await supabase).auth.signInWithPassword({
            email: payload.email,
            password: payload.password,
        });

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return { status: 400, errors: error.messages }
        }
    }
    return redirect("/")
}

export async function loginAction(prevSate: any, formdata: FormData) {
    const supabase = createClient()
    try {
        const data = {
            email: formdata.get("email"),
            password: formdata.get("password")
        }
        const payload = await LoginValidator.validate(data)
        const { error: signUpError } = await (await supabase).auth.signInWithPassword({
            email: payload.email,
            password: payload.password
        })

        if (signUpError) {
            return {
                status: 400,
                errors: {
                    email: signUpError.message
                }
            }
        }
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return { status: 400, errors: error.messages }
        }
    }
    return redirect("/")
}
