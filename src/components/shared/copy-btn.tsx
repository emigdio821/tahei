import { IconCheck, IconCopy } from '@tabler/icons-react'
import { useState } from 'react'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type CopyButtonProps = ButtonProps & {
  value: string
  tooltipText?: string
  successText?: string
  iconClassName?: string
}

export function CopyButton(props: CopyButtonProps) {
  const [isOpenTooltip, setOpenTooltip] = useState(false)
  const { value, tooltipText = 'Copy', successText = 'Copied', iconClassName, ...btnProps } = props

  const { copyToClipboard, isCopied } = useCopyToClipboard()

  function handleCopy() {
    copyToClipboard(value)
  }

  return (
    <Tooltip open={isOpenTooltip} onOpenChange={setOpenTooltip}>
      <TooltipTrigger
        render={
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={isCopied}
            onClick={(e) => {
              e.preventBaseUIHandler()
              setOpenTooltip(true)
              handleCopy()
            }}
            focusableWhenDisabled
            aria-label={isCopied ? successText : tooltipText}
            {...btnProps}
          />
        }
      >
        {isCopied ? (
          <IconCheck className={cn('size-4', iconClassName)} />
        ) : (
          <IconCopy className={cn('size-4', iconClassName)} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{isCopied ? successText : tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  )
}
