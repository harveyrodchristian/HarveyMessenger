"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Users, MoreVertical, Plus } from "lucide-react"

interface GroupChatHeaderProps {
  conversationName: string
  memberCount: number
  onAddMember?: () => void
}

export function GroupChatHeader({ conversationName, memberCount, onAddMember }: GroupChatHeaderProps) {
  const [showAddMember, setShowAddMember] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{conversationName}</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {memberCount} members
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowAddMember(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Group</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Leave Group</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Search users by username..." />
            <div className="space-y-2">{/* User search results will go here */}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
