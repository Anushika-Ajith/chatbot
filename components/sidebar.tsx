"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, Settings, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUser } from "@/store/userSlice"
import { useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },

]

export function Sidebar() {
  const router = useRouter()
    const user = useSelector(selectCurrentUser)
    const dispatch=useDispatch()
  
       
      const currentUser = useSelector(selectCurrentUser);
    
      useEffect(() => {
        if (!currentUser) {
          router.replace("/login");
        }
      }, [currentUser, router]);
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Activity className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">HealthCare</h1>
          <p className="text-xs text-muted-foreground">Patient Portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
