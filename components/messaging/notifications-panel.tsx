"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Bell, MessageSquare, Phone } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NotificationsPanelProps {
  onClose: () => void
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { notifications, markAsRead } = useNotifications()

  const messageNotifications = notifications.filter((n) => n.type === "message")
  const callNotifications = notifications.filter((n) => n.type === "call")
  const groupNotifications = notifications.filter((n) => n.type === "group_invite")

  const formatTime = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg border ${
                    notif.read ? "bg-background border-border" : "bg-primary/5 border-primary/20"
                  } cursor-pointer hover:bg-muted transition`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notif.type === "message" && <MessageSquare className="w-4 h-4 text-blue-500" />}
                      {notif.type === "call" && <Phone className="w-4 h-4 text-green-500" />}
                      {notif.type === "group_invite" && <Bell className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      {notif.body && <p className="text-xs text-muted-foreground mt-1">{notif.body}</p>}
                      <p className="text-xs text-muted-foreground mt-2">{formatTime(notif.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-3 mt-4">
            {messageNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No message notifications</p>
            ) : (
              messageNotifications.map((notif) => (
                <div key={notif.id} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.body}</p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="calls" className="space-y-3 mt-4">
            {callNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No call notifications</p>
            ) : (
              callNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                >
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.body}</p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="groups" className="space-y-3 mt-4">
            {groupNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No group notifications</p>
            ) : (
              groupNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900"
                >
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.body}</p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
