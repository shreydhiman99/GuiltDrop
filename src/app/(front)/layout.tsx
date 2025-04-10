import AppNav from "@/components/common/AppNav";
import MobileApp from "@/components/common/MobileApp";
import {createClient} from "@/lib/supabase/supabaseServer"
import {cookies} from "next/headers"

export default async function FrontLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const supabase = createClient(cookies())
    const {data} = await (await supabase).auth.getSession()
    return (
      <div className="p-2 md:container relative h-screen">
        <MobileApp />
        <AppNav user={data.session?.user!}/>
        <div className="flex flex-col items-center h-full">
        <div className="w-full lg:w-2/5">{children}</div>
        </div>

      </div>
    );
  }
  