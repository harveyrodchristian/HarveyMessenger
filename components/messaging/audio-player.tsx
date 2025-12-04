"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useRef, useState, useEffect } from "react"

export function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateDuration = () => setDuration(audio.duration)
    const updateCurrentTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("timeupdate", updateCurrentTime)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("timeupdate", updateCurrentTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={url} />
      <Button type="button" variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="flex-1 bg-muted rounded-full h-1">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground min-w-fit">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  )
}
