"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Menu, LogOut, Settings, User, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { PreferencesDrawer } from "../preferences-drawer"

export function Header({ user, onShowNotifications }: { user: any; onShowNotifications?: () => void }) {
  const router = useRouter()
  const [showPreferences, setShowPreferences] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "U"

  return (
    <>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Harvey</h1>
          <p className="text-xs text-muted-foreground">Messaging</p>
        </div>
        <div className="flex gap-2">
          {onShowNotifications && (
            <Button variant="ghost" size="icon" onClick={onShowNotifications} title="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="text-xs">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowPreferences(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <PreferencesDrawer open={showPreferences} onOpenChange={setShowPreferences} />
    </>
  )
}
