import { IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

export const TaheiIcon = (props: IconProps) => (
  <svg
    viewBox="0 26.049999237060547 28.200000762939453 35.85000228881836"
    data-asc="1.16"
    width="28.200000762939453"
    height="35.85000228881836"
    role="img"
    aria-label="Tahei icon made with hachi maru pop font"
    {...props}
  >
    <defs />
    <g fill="currentColor">
      <g transform="translate(0, 0)">
        <path d="M17.50 61.60Q13.35 60.85 10.60 58.00Q7.85 55.15 6.95 50.90Q6.70 49.70 6.58 48.42Q6.45 47.15 6.45 45.85Q6.45 43.70 6.72 41.52Q7 39.35 7.40 37.35L1.50 37.35Q0.70 37.35 0.35 36.87Q0 36.40 0 35.85Q0 35.20 0.43 34.77Q0.85 34.35 1.50 34.35L8.15 34.35Q8.35 33.55 8.80 32.10Q9.25 30.65 9.75 29.20Q10.25 27.75 10.55 26.95Q10.95 26.05 11.90 26.05Q12.65 26.05 13.08 26.50Q13.50 26.95 13.50 27.50Q13.50 27.80 13.35 28.10Q13.05 28.95 12.63 30.15Q12.20 31.35 11.83 32.47Q11.45 33.60 11.25 34.35L25.05 34.35Q25.85 34.35 26.20 34.85Q26.55 35.35 26.55 35.85Q26.55 36.40 26.18 36.87Q25.80 37.35 25.05 37.35L10.50 37.35Q10.05 39.35 9.78 41.60Q9.50 43.85 9.50 45.90Q9.50 46.80 9.55 47.65Q9.60 48.50 9.75 49.25Q10.45 53.00 12.55 55.57Q14.65 58.15 18.35 58.75Q18.85 58.80 19.40 58.82Q19.95 58.85 20.45 58.85Q22 58.85 23.55 58.65Q25.10 58.45 26.20 58.00Q26.40 57.95 26.55 57.92Q26.70 57.90 26.85 57.90Q28.20 57.90 28.20 59.55Q28.20 60.35 27.15 60.85Q24.25 61.90 20.65 61.90Q18.95 61.90 17.50 61.60Z" />
      </g>
    </g>
  </svg>
)

export const LoaderIcon = ({ className, ...props }: IconProps) => (
  <IconLoader className={cn('size-4 animate-spin', className)} {...props} />
)

export const IndeterminateIcon = (props: IconProps) => (
  <svg
    className="size-3.5 sm:size-3"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Indeterminate Indicator"
    {...props}
  >
    <path d="M5.252 12h13.496" />
  </svg>
)

export const CheckIcon = (props: IconProps) => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Check Indicator"
    {...props}
  >
    <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
  </svg>
)
