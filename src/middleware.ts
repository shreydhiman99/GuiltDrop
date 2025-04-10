import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/supabaseServer";
import { cookies } from 'next/headers';

export async function middleware(request:NextRequest) {
    // const cookieStore = await cookies()
    const supabase = createClient(cookies())
    const {data} = await (await supabase).auth.getUser()

    if (data.user === null) {
        return NextResponse.redirect(new URL("/login?error = Pleaselogin firstto access this route", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/"]
};

