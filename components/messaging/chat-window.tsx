"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, Plus, ImageIcon, X, Mic } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useMessages } from "@/hooks/use-messages"
import { useCall } from "@/hooks/use-call"
import { MessageBubble } from "./message-bubble"
import { VoiceRecorder } from "./voice-recorder"
import { CallModal } from "./call-modal"
import { EmojiPicker } from "./emoji-picker"
import { createClient } from "@/lib/supabase/client"

export function ChatWindow({
  conversation,
  user,
}: {
  conversation: any
  user: any
}) {
  const { messages, addMessage } = useMessages(conversation?.id)
  const {
    activeCall,
    callStatus,
    callDuration,
    formattedDuration,
    localStream,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
  } = useCall(conversation?.id, user?.id)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileUpload = async (file: File) => {
    if (!conversation?.id || !user) return

    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `messages/${conversation.id}/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage.from("message-files").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("message-files").getPublicUrl(filePath)

      const messageType = file.type.startsWith("image/") ? "image" : "file"

      const { error: msgError } = await supabase.from("messages").insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content: file.name,
        message_type: messageType,
        file_url: publicUrl,
      })

      if (msgError) throw msgError
      setSelectedFile(null)
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFile) {
      setIsLoading(true)
      try {
        await handleFileUpload(selectedFile)
      } catch (error) {
        console.error("Error sending file:", error)
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (!newMessage.trim()) return

    setIsLoading(true)
    try {
      await addMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        {/* Chat Header - Enhanced with better styling */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <div>
            <h2 className="font-semibold text-lg text-foreground">{conversation?.name || "Direct Message"}</h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={() => initiateCall("audio")}
              disabled={callStatus !== "idle"}
              title="Start audio call"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={() => initiateCall("video")}
              disabled={callStatus !== "idle"}
              title="Start video call"
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area - Improved scrolling */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-muted-foreground">Start a conversation</p>
              </div>
            </div>
          ) : (
            sortedMessages.map((msg) => <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === user.id} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="px-4 py-3 border-t border-border bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">{selectedFile.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedFile(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Voice Recorder */}
        {showVoiceRecorder && (
          <VoiceRecorder
            conversationId={conversation?.id}
            userId={user?.id}
            onSend={() => setShowVoiceRecorder(false)}
          />
        )}

        {/* Input Area - Enhanced with emoji picker */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || showVoiceRecorder}
              title="Share file"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Input
              placeholder={showVoiceRecorder ? "Recording..." : "Type a message..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={isLoading || selectedFile !== null || showVoiceRecorder}
            />
            <EmojiPicker onSelect={handleEmojiSelect} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className={showVoiceRecorder ? "bg-red-100 dark:bg-red-950" : ""}
              title="Record voice message"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={(!newMessage.trim() && !selectedFile) || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Call Modal */}
      <CallModal
        activeCall={activeCall}
        callStatus={callStatus}
        callDuration={callDuration}
        formattedDuration={formattedDuration}
        localStream={localStream}
        onAccept={acceptCall}
        onDecline={declineCall}
        onEnd={endCall}
      />
    </>
  )
}
