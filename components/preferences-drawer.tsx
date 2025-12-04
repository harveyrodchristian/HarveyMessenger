"use client"

import { useState } from "react"
import { usePreferences } from "@/hooks/use-preferences"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PreferencesDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreferencesDrawer({ open, onOpenChange }: PreferencesDrawerProps) {
  const { preferences, updatePreferences } = usePreferences()
  const [theme, setTheme] = useState(preferences?.theme || "dark")
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences?.notification_enabled ?? true)
  const [soundEnabled, setSoundEnabled] = useState(preferences?.sound_enabled ?? true)

  async function handleSave() {
    await updatePreferences({
      theme: theme as "light" | "dark",
      notification_enabled: notificationsEnabled,
      sound_enabled: soundEnabled,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Preferences</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme</Label>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="font-normal cursor-pointer">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="font-normal cursor-pointer">
                  Dark
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Notifications</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="font-normal">
                Enable Notifications
              </Label>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
          </div>

          {/* Sound */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Sound</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="font-normal">
                Enable Sound
              </Label>
              <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
