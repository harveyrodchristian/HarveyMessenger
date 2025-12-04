"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useConversations() {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initial fetch
  useEffect(() => {
    const fetchConversations = async () => {
      const supabase = createClient()
      setIsLoading(true)

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("conversation_members")
          .select(`
            conversation_id,
            joined_at,
            conversations:conversation_id (
              id,
              name,
              type,
              created_at,
              updated_at
            )
          `)
          .eq("user_id", user.id)
          .order("joined_at", { ascending: false })

        if (error) throw error

        const convs = data?.map((item: any) => item.conversations).filter(Boolean) || []
        setConversations(convs)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("conversations_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_members",
        },
        async (payload: any) => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user && payload.new.user_id === user.id) {
            // Fetch the conversation details
            const { data: convData } = await supabase
              .from("conversations")
              .select("*")
              .eq("id", payload.new.conversation_id)
              .single()
            if (convData) {
              setConversations((prev) => [convData, ...prev])
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        (payload: any) => {
          setConversations((prev) => prev.map((conv) => (conv.id === payload.new.id ? payload.new : conv)))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { conversations, isLoading }
}
