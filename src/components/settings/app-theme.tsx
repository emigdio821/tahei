'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFrame,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
} from '../ui/card'
import { Label } from '../ui/label'
import { Radio, RadioGroup } from '../ui/radio-group'

export function AppThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState('')

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme)
    }
  }, [theme])

  return (
    <CardFrame className="w-full">
      <CardFrameHeader>
        <CardFrameTitle>Theme</CardFrameTitle>
        <CardFrameDescription>Select the application theme.</CardFrameDescription>
      </CardFrameHeader>
      <Card>
        <CardContent>
          <RadioGroup value={currentTheme} className="mt-2 sm:flex-row" onValueChange={setTheme}>
            <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
              <Radio value="light" />
              <div className="flex flex-col gap-1">
                <p>Light</p>
                <p className="text-muted-foreground text-xs">Use the light theme.</p>
              </div>
            </Label>
            <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
              <Radio value="dark" />
              <div className="flex flex-col gap-1">
                <p>Dark</p>
                <p className="text-muted-foreground text-xs">Use the dark theme.</p>
              </div>
            </Label>
            <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
              <Radio value="system" />
              <div className="flex flex-col gap-1">
                <p>System</p>
                <p className="text-muted-foreground text-xs">It follows the system theme.</p>
              </div>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </CardFrame>
  )
}
