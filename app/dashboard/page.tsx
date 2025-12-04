"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ConversationList } from "@/components/messaging/conversation-list"
import { ChatWindow } from "@/components/messaging/chat-window"
import { EmptyState } from "@/components/messaging/empty-state"
import { Header } from "@/components/messaging/header"
import { NotificationsPanel } from "@/components/messaging/notifications-panel"
import { useConversations } from "@/hooks/use-conversations"

export default function DashboardPage() {
  const { conversations } = useConversations()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (authUser) {
        setUser(authUser)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (conversations.length > 0 && !selectedId) {
      setSelectedId(conversations[0].id)
    }
  }, [conversations, selectedId])

  const selectedConversation = conversations.find((c) => c.id === selectedId)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <Header user={user} onShowNotifications={() => setShowNotifications(!showNotifications)} />
        <ConversationList selectedId={selectedId} onSelectConversation={setSelectedId} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? <ChatWindow conversation={selectedConversation} user={user} /> : <EmptyState />}
      </div>

      {/* Notifications Panel */}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </div>
  )
}
