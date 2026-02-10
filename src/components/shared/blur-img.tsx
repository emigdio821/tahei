'use client'

import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function BlurImage({ alt, ...props }: ImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-muted">
      <Image
        fill
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'rounded-[inherit] object-cover transition-all duration-700 ease-in-out',
          isLoading ? 'blur-sm' : 'blur-0',
        )}
        onLoad={() => {
          setLoading(false)
        }}
        {...props}
      />
    </div>
  )
}
