import { useEffect, useRef, useState } from 'react'

export const COPY_TIMEOUT = 1000

interface UseCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({ timeout = COPY_TIMEOUT }: UseCopyToClipboardProps = {}) {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  function copyToClipboard(value: string) {
    if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
      return
    }

    if (!value) return

    navigator.clipboard.writeText(value).then(() => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      setIsCopied(true)

      if (timeout !== 0) {
        timeoutIdRef.current = setTimeout(() => {
          setIsCopied(false)
          timeoutIdRef.current = null
        }, timeout)
      }
    }, console.error)
  }

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [])

  return { copyToClipboard, isCopied }
}
