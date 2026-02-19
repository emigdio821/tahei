'use client'

import { IconPhotoOff } from '@tabler/icons-react'
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BlurImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  alt: string
  fallback?: React.ReactNode
}

export function BlurImage({ alt, fallback, className, sizes, fill, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error && fallback) {
    return <>{fallback}</>
  }

  if (error) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-2 rounded-[inherit] bg-muted text-muted-foreground text-sm">
        <IconPhotoOff className="size-4" />
        Failed to load image
      </div>
    )
  }

  return (
    <Image
      alt={alt}
      fill={fill}
      sizes={sizes || (fill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined)}
      className={cn(
        'rounded-[inherit] object-cover transition-all duration-700 ease-in-out',
        isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0',
        className,
      )}
      onLoad={() => setLoading(false)}
      onError={() => {
        setLoading(false)
        setError(true)
      }}
      {...props}
    />
  )
}
