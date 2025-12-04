"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface Notification {
  id: string
  user_id: string
  conversation_id: string | null
  type: "message" | "call" | "group_invite"
  title: string
  body: string | null
  read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel | null = null

    async function fetchNotifications() {
      try {
        setLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error
        setNotifications(data || [])

        // Subscribe to new notifications
        channel = supabase
          .channel(`notifications:${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              setNotifications((prev) => [payload.new as Notification, ...prev])
            },
          )
          .subscribe()
      } catch (err) {
        console.error("[v0] Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  async function markAsRead(notificationId: string) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      if (error) throw error
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    } catch (err) {
      console.error("[v0] Error marking notification as read:", err)
    }
  }

  return { notifications, loading, markAsRead }
}
