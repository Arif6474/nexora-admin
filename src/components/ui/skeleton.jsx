import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-stone-200/80 dark:bg-[#181d28]',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
