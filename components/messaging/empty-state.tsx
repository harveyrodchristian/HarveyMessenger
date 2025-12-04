"use client"

import { MessageCircle } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <MessageCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
      <h3 className="text-lg font-semibold text-foreground mb-2">No conversation selected</h3>
      <p className="text-muted-foreground text-center max-w-xs">
        Select a conversation from the list to start messaging
      </p>
    </div>
  )
}
