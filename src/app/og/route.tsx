import { ImageResponse } from 'next/og'
import { TaheiIcon } from '@/components/icons'
import { appDesc, appName } from '@/lib/config/site'

async function loadAssets(): Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> {
  const [{ base64Font: normal }, { base64Font: mono }, { base64Font: semibold }] = await Promise.all([
    import('./geist-regular-otf.json').then((mod) => mod.default || mod),
    import('./geistmono-regular-otf.json').then((mod) => mod.default || mod),
    import('./geist-semibold-otf.json').then((mod) => mod.default || mod),
  ])

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist Mono',
      data: Buffer.from(mono, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold, 'base64'),
      weight: 600 as const,
      style: 'normal' as const,
    },
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || appName
  const description = searchParams.get('description') || appDesc

  const [fonts] = await Promise.all([loadAssets()])

  return new ImageResponse(
    <div tw="flex h-full w-full bg-neutral-900 text-neutral-50" style={{ fontFamily: 'Geist Sans' }}>
      <div tw="flex absolute flex-row bottom-24 right-24 text-neutral-50">
        <div tw="flex items-center justify-center w-12 h-12 p-5 bg-slate-500 rounded-full">
          <TaheiIcon className="h-4 w-4" />
        </div>
      </div>

      <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
        <div
          tw="tracking-tight flex-grow-1 flex flex-col justify-center leading-[1.1]"
          style={{
            textWrap: 'balance',
            fontWeight: 600,
            fontSize: title && title.length > 20 ? 64 : 80,
            letterSpacing: '-0.04em',
          }}
        >
          {title}
        </div>
        <div
          tw="text-[40px] leading-[1.5] flex-grow-1 text-stone-400"
          style={{
            fontWeight: 500,
            textWrap: 'balance',
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts,
    },
  )
}
