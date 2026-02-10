'use client'

import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BlurImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  fallback?: React.ReactNode
}

export function BlurImage({ alt, fallback, className, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error && fallback) {
    return <>{fallback}</>
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-muted text-muted-foreground text-sm">
        Failed to load image
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-muted">
      <Image
        fill
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    </div>
  )
}
