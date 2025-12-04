"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

export function useCall(conversationId: string | null, userId: string | null) {
  const [activeCall, setActiveCall] = useState<any>(null)
  const [callStatus, setCallStatus] = useState<string>("idle") // idle, ringing, active, ended
  const [callDuration, setCallDuration] = useState(0)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Listen for incoming calls
  useEffect(() => {
    if (!conversationId || !userId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`calls:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "calls",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          if (payload.new.receiver_id === userId && payload.new.status === "ringing") {
            setActiveCall(payload.new)
            setCallStatus("ringing")
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "calls",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          if (payload.new.status === "active") {
            setCallStatus("active")
            // Start duration timer
            if (durationTimerRef.current) clearInterval(durationTimerRef.current)
            durationTimerRef.current = setInterval(() => {
              setCallDuration((prev) => prev + 1)
            }, 1000)
          } else if (payload.new.status === "ended") {
            setCallStatus("ended")
            if (durationTimerRef.current) clearInterval(durationTimerRef.current)
            setTimeout(() => {
              setActiveCall(null)
              setCallStatus("idle")
              setCallDuration(0)
            }, 2000)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (durationTimerRef.current) clearInterval(durationTimerRef.current)
    }
  }, [conversationId, userId])

  const initiateCall = async (callType: "audio" | "video") => {
    if (!conversationId || !userId) return

    try {
      // Request media permissions
      const constraints = callType === "video" ? { audio: true, video: true } : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      const supabase = createClient()
      const { data, error } = await supabase
        .from("calls")
        .insert({
          conversation_id: conversationId,
          initiator_id: userId,
          call_type: callType,
          status: "ringing",
        })
        .select()
        .single()

      if (error) throw error

      setActiveCall(data)
      setCallStatus("ringing")
    } catch (error) {
      console.error("Error initiating call:", error)
    }
  }

  const acceptCall = async () => {
    if (!activeCall || !userId) return

    try {
      const constraints = activeCall.call_type === "video" ? { audio: true, video: true } : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      const supabase = createClient()
      const { error } = await supabase
        .from("calls")
        .update({ status: "active", receiver_id: userId })
        .eq("id", activeCall.id)

      if (error) throw error

      setCallStatus("active")
      setCallDuration(0)
    } catch (error) {
      console.error("Error accepting call:", error)
    }
  }

  const declineCall = async () => {
    if (!activeCall) return

    const supabase = createClient()
    await supabase.from("calls").update({ status: "missed" }).eq("id", activeCall.id)

    setActiveCall(null)
    setCallStatus("idle")
  }

  const endCall = async () => {
    if (!activeCall) return

    // Stop all media streams
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop())

    const supabase = createClient()
    await supabase
      .from("calls")
      .update({ status: "ended", ended_at: new Date().toISOString(), duration_seconds: callDuration })
      .eq("id", activeCall.id)

    setCallStatus("ended")
    if (durationTimerRef.current) clearInterval(durationTimerRef.current)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return {
    activeCall,
    callStatus,
    callDuration,
    formattedDuration: formatDuration(callDuration),
    localStream: localStreamRef.current,
    remoteStream: remoteStreamRef.current,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
  }
}
