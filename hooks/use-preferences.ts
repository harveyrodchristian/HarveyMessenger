"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface UserPreferences {
  id: string
  user_id: string
  theme: "light" | "dark"
  primary_color: string
  accent_color: string
  notification_enabled: boolean
  sound_enabled: boolean
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPreferences()
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchPreferences()
    })
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  async function fetchPreferences() {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error: fetchError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError

      if (!data) {
        const { data: newPrefs, error: insertError } = await supabase
          .from("user_preferences")
          .insert({ user_id: user.id })
          .select()
          .single()
        if (insertError) throw insertError
        setPreferences(newPrefs)
      } else {
        setPreferences(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch preferences"))
    } finally {
      setLoading(false)
    }
  }

  async function updatePreferences(updates: Partial<UserPreferences>) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("user_preferences")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error
      setPreferences(data)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update preferences")
      setError(error)
      throw error
    }
  }

  return { preferences, loading, error, updatePreferences }
}
