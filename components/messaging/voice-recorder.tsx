"use client"

import { Button } from "@/components/ui/button"
import { X, Send } from "lucide-react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { createClient } from "@/lib/supabase/client"

export function VoiceRecorder({
  conversationId,
  userId,
  onSend,
}: {
  conversationId: string
  userId: string
  onSend: () => void
}) {
  const { isRecording, formattedTime, startRecording, stopRecording, cancelRecording } = useAudioRecorder()

  const handleSendVoiceMessage = async () => {
    const audioBlob = await stopRecording()
    if (!audioBlob) return

    const supabase = createClient()
    const fileName = `${Math.random()}.webm`
    const filePath = `voice-messages/${conversationId}/${fileName}`

    try {
      const { error: uploadError } = await supabase.storage.from("message-files").upload(filePath, audioBlob)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("message-files").getPublicUrl(filePath)

      const { error: msgError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userId,
        content: "Voice message",
        message_type: "voice",
        file_url: publicUrl,
      })

      if (msgError) throw msgError
      onSend()
    } catch (error) {
      console.error("Error sending voice message:", error)
    }
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
        <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full" />
        <span className="text-sm font-medium text-red-700 dark:text-red-200">Recording: {formattedTime}</span>
        <div className="flex-1" />
        <Button type="button" variant="ghost" size="icon" onClick={cancelRecording} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
        <Button type="button" variant="default" size="icon" onClick={handleSendVoiceMessage} className="h-8 w-8">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return null
}
