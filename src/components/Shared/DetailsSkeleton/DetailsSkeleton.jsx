import { Skeleton } from '@/components/ui/skeleton'

export default function DetailsSkeleton({ count = 6, hasImage = false }) {
  return (
    <div className="pt-4 max-h-[75vh] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3.5 w-24 rounded-md opacity-70" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
        </div>
      ))}
      {hasImage && (
        <div className="space-y-2 md:col-span-2">
          <Skeleton className="h-3.5 w-20 rounded-md opacity-70" />
          <Skeleton className="h-44 w-44 rounded-2xl" />
        </div>
      )}
    </div>
  )
}
