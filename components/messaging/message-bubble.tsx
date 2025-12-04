"use client"

import { Download, Mic, Heart } from "lucide-react"
import { AudioPlayer } from "./audio-player"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function MessageBubble({
  message,
  isOwn,
}: {
  message: any
  isOwn: boolean
}) {
  const [showReactions, setShowReactions] = useState(false)
  const [liked, setLiked] = useState(false)

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isImage = message.message_type === "image"
  const isFile = message.message_type === "file"
  const isVoice = message.message_type === "voice"

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2`}>
      <div
        className={`max-w-xs ${
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        } rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        {isImage && message.file_url ? (
          <div className="relative">
            <img
              src={message.file_url || "/placeholder.svg"}
              alt="Shared image"
              className="max-w-xs h-auto rounded-xl"
            />
            <div className={`px-4 py-2 text-xs ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {formatTime(message.created_at)}
            </div>
          </div>
        ) : isVoice && message.file_url ? (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium">Voice message</span>
            </div>
            <AudioPlayer url={message.file_url} />
            <p className={`text-xs mt-2 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {formatTime(message.created_at)}
            </p>
          </div>
        ) : isFile && message.file_url ? (
          <div className="px-4 py-3 flex items-center gap-3">
            <Download className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate font-medium">{message.content}</p>
              <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {formatTime(message.created_at)}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3">
            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-2 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {formatTime(message.created_at)}
            </p>
          </div>
        )}
      </div>

      {showReactions && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLiked(!liked)}>
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      )}
    </div>
  )
}
