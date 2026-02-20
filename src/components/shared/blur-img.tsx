import { IconPhotoOff } from '@tabler/icons-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string
  fallback?: React.ReactNode
  fill?: boolean
}

export function BlurImage({ alt, fallback, className, fill, ...props }: BlurImageProps) {
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
    <img
      alt={alt}
      className={cn(
        'rounded-[inherit] object-cover transition-all duration-700 ease-in-out',
        fill && 'absolute inset-0 size-full',
        isLoading ? 'scale-105 blur-xs' : 'scale-100 blur-0',
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
