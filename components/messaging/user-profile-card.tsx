"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Video } from "lucide-react"

interface UserProfileCardProps {
  user: {
    id: string
    username: string
    full_name: string
    avatar_url?: string
    bio?: string
    status?: string
  }
  onMessage?: () => void
  onCall?: () => void
  onVideoCall?: () => void
}

export function UserProfileCard({ user, onMessage, onCall, onVideoCall }: UserProfileCardProps) {
  const initials = (user.full_name || user.username)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const isOnline = user.status === "online"

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar with online status */}
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          {/* User info */}
          <div>
            <h2 className="text-lg font-bold">{user.full_name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="text-sm mt-2 text-foreground">{user.bio}</p>}
            <Badge className="mt-2" variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full pt-2">
            {onMessage && (
              <Button size="sm" className="flex-1" onClick={onMessage}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            )}
            {onCall && (
              <Button size="sm" variant="outline" onClick={onCall}>
                <Phone className="w-4 h-4" />
              </Button>
            )}
            {onVideoCall && (
              <Button size="sm" variant="outline" onClick={onVideoCall}>
                <Video className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
