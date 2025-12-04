"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Plus, Search } from "lucide-react"
import { useState } from "react"
import { useConversations } from "@/hooks/use-conversations"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ConversationList({
  selectedId,
  onSelectConversation,
}: {
  selectedId: string | null
  onSelectConversation: (id: string) => void
}) {
  const { conversations } = useConversations()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewConversation, setShowNewConversation] = useState(false)

  const filtered = conversations.filter((conv) =>
    (conv.name || "Direct Message").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="flex flex-col flex-1 overflow-hidden bg-card">
        <div className="p-4 space-y-3 border-b border-border">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            size="sm"
            onClick={() => setShowNewConversation(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a new conversation to begin</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                    selectedId === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{conv.name || "Direct Message"}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {conv.updated_at && (
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={showNewConversation} onOpenChange={setShowNewConversation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direct">Direct Message</TabsTrigger>
              <TabsTrigger value="group">Group Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="direct" className="space-y-4">
              <Input placeholder="Search users..." />
              <div className="space-y-2">{/* User search results will appear here */}</div>
            </TabsContent>
            <TabsContent value="group" className="space-y-4">
              <Input placeholder="Group name..." />
              <Input placeholder="Add members..." />
              <Button className="w-full">Create Group</Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
