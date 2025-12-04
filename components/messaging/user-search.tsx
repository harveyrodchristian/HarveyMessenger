"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle } from "lucide-react"

interface UserSearchProps {
  onSelectUser?: (user: any) => void
}

export function UserSearch({ onSelectUser }: UserSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchUsers = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("profiles").select("*").ilike("username", `%${query}%`).limit(10)

        if (error) throw error
        setResults(data || [])
      } catch (err) {
        console.error("[v0] Error searching users:", err)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {query && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground py-4">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No users found</p>
          ) : (
            results.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{user.full_name?.[0] || user.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onSelectUser?.(user)}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
