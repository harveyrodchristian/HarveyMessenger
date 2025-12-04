"use client"

import { Button } from "@/components/ui/button"
import { Phone, X } from "lucide-react"
import { useEffect, useRef } from "react"

export function CallModal({
  activeCall,
  callStatus,
  callDuration,
  formattedDuration,
  localStream,
  onAccept,
  onDecline,
  onEnd,
}: {
  activeCall: any
  callStatus: string
  callDuration: number
  formattedDuration: string
  localStream: MediaStream | null
  onAccept: () => void
  onDecline: () => void
  onEnd: () => void
}) {
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  if (!activeCall) return null

  const isVideo = activeCall.call_type === "video"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl p-8 max-w-md w-full mx-4">
        {callStatus === "ringing" && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold">
                {activeCall.initiator_id === activeCall.receiver_id ? "Outgoing call..." : "Incoming call"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeCall.call_type === "video" ? "Video call" : "Audio call"}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={onDecline} variant="destructive" size="lg" className="rounded-full">
                <Phone className="h-5 w-5" />
              </Button>
              {activeCall.receiver_id && (
                <Button onClick={onAccept} className="rounded-full" size="lg">
                  <Phone className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}

        {callStatus === "active" && (
          <div>
            {isVideo && localStream && (
              <div className="mb-6 bg-black rounded-lg overflow-hidden">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
              </div>
            )}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">{isVideo ? "Video call" : "Audio call"} active</p>
              <p className="text-3xl font-mono font-semibold">{formattedDuration}</p>
            </div>
            <Button onClick={onEnd} variant="destructive" className="w-full rounded-full" size="lg">
              <Phone className="h-5 w-5 mr-2" />
              End Call
            </Button>
          </div>
        )}

        {callStatus === "ended" && (
          <div className="text-center">
            <div className="mb-4">
              <X className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold">Call Ended</h2>
              <p className="text-sm text-muted-foreground mt-2">Duration: {formattedDuration}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
