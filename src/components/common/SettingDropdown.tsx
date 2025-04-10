"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { SettingsIcon } from "lucide-react"
import { useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { createClient } from "@/lib/supabase/supabaseClient"
import { useRouter } from "next/navigation" // Updated import

export function SettingDropdown() {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter() // Updated to use next/navigation
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true) // Set loading to true while logging out
    await supabase.auth.signOut()
    router.push("/login") // Redirect to login page
    setLoading(false) // Reset loading state
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>You will be logged out.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={logout} disabled={loading}>
              {loading ? "Logging out..." : "Yes, Logout!"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SettingsIcon size={30} className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
