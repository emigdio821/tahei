import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Frame, FrameDescription, FrameHeader, FrameTitle } from '../ui/frame'
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
    <Frame>
      <FrameHeader>
        <FrameTitle>Theme</FrameTitle>
        <FrameDescription>Select the application theme.</FrameDescription>
      </FrameHeader>
      <Card>
        <CardContent>
          <RadioGroup className="lg:flex-row" value={currentTheme} onValueChange={setTheme}>
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
    </Frame>
  )
}
