import { Skeleton } from '@/components/ui/skeleton'

export default function FormSkeleton({ fields = 4 }) {
  return (
    <div className="space-y-4 pt-2">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3.5 w-24 rounded-md opacity-70" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-11 w-full rounded-xl mt-6" />
    </div>
  )
}
