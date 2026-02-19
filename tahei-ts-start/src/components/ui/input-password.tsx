import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './button'
import type { InputProps } from './input'

export function InputPassword(props: InputProps) {
  const [openTooltip, setOpenTooltip] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput
        type={showPassword ? 'text' : 'password'}
        aria-label="Password input with show/hide toggle"
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
          <TooltipTrigger
            render={
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={(e) => {
                  e.preventBaseUIHandler()
                  setOpenTooltip(true)
                  setShowPassword((prev) => !prev)
                }}
              />
            }
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </TooltipTrigger>
          <TooltipContent>{showPassword ? 'Hide password' : 'Show password'}</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  )
}
