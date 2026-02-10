import { IconLoader } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type IconProps = React.SVGProps<SVGSVGElement>

export const TaheiIcon = (props: IconProps) => (
  <svg
    viewBox="0 14.399999618530273 42.79999923706055 35.05000686645508"
    data-asc="0.959"
    width="42.79999923706055"
    height="35.05000686645508"
    role="img"
    aria-label="Tahei logo made with Mrs Sheppards font"
    {...props}
  >
    <defs />
    <g fill="currentColor">
      <g transform="translate(0, 0)">
        <path d="M2.65 27.80Q2.65 27.00 6.95 26.35Q11.25 25.70 16.15 25.45Q20.25 21.75 23.55 19.15L24.65 18.25Q25.40 18.25 25.40 19.35L25.50 21.80Q25.35 22.35 23.40 25.25L25.85 25.25Q31.40 25.25 32.27 26.32Q33.15 27.40 33.15 28.05Q33.15 28.90 31.45 28.95Q29.75 29.00 20.80 29.00Q13.65 36.35 9.60 42.05Q8.05 44.15 6.90 45.80Q5.75 47.45 5.13 48.12Q4.50 48.80 3.95 48.80Q2.30 48.80 1.15 47.70Q0 46.60 0 45.00Q0 40.60 12.25 29.05L4.55 29.05Q2.65 29.05 2.65 27.80ZM38.48 45.60Q38.48 45.60 37.59 46.27Q36.70 46.95 34.23 48.20Q31.75 49.45 30.08 49.45Q28.40 49.45 27.40 48.45Q26.40 47.45 26.40 46.00Q26.40 43.60 29.85 39.55Q30.15 39.25 30.15 39.07Q30.15 38.90 30.05 38.90Q29.95 38.90 29.33 39.12Q28.70 39.35 25.90 41.42Q23.10 43.50 20.45 45.82Q17.80 48.15 16.68 48.15Q15.55 48.15 15.03 47.20Q14.50 46.25 14.50 45.05Q14.50 41.35 20.28 33.80Q26.05 26.25 32.35 20.32Q38.65 14.40 40.40 14.40Q41.25 14.40 42.03 15.12Q42.80 15.85 42.80 17.07Q42.80 18.30 39.80 22.50Q36.80 26.70 33.10 31.35Q28.45 37.15 28.45 37.65Q28.45 37.85 28.65 37.85Q28.85 37.85 30.35 37.02Q31.85 36.20 33.60 35.47Q35.35 34.75 36.03 34.62Q36.70 34.50 37.63 34.50Q38.55 34.50 39.48 34.90Q40.40 35.30 40.40 36.07Q40.40 36.85 36.78 41.02Q33.15 45.20 33.15 45.77Q33.15 46.35 33.65 46.35Q34.70 46.35 37.75 44.15Q38.90 43.35 39.10 43.25Q39.30 43.15 39.55 43.15Q40.25 43.15 40.25 43.85Q40.25 44.25 38.48 45.60Z" />
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
