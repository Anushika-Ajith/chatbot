"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { logout, getUser } from "@/lib/auth"
import { logout, selectCurrentUser } from "@/store/userSlice"
import { LogOut, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

export function Navbar() {
  const router = useRouter()
  const user = useSelector(selectCurrentUser)
  const dispatch=useDispatch()

     
    const currentUser = useSelector(selectCurrentUser);
  
    useEffect(() => {
      if (!currentUser) {
        // ✅ Block access if no user
        router.replace("/login");
      }
    }, [currentUser, router]);
  

  const handleLogout = () => {
    
    dispatch(logout())
    router.push("/login")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome back, {user?.name || "User"}</h2>
        <p className="text-sm text-muted-foreground">Manage your health appointments and consultations</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
         
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
