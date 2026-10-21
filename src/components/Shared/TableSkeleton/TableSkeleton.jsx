import { Skeleton } from '@/components/ui/skeleton'

export default function TableSkeleton({
  columns = 5,
  rows = 8,
  showPagination = true
}) {
  const colCount = typeof columns === 'number' ? columns : (columns?.length || 5)

  // Varied width percentages for cells to look realistic
  const cellWidths = ['w-24', 'w-48', 'w-20', 'w-16', 'w-28', 'w-32']

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 data-table">
      <div className="space-y-4">
        <div className="rounded-xl border border-stone-200/90 dark:border-[#1e2330] bg-white dark:bg-[#11141b] text-stone-900 dark:text-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Header skeleton */}
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-[#181d28] bg-stone-50/90 dark:bg-[#0e1017]/50">
                  {Array.from({ length: colCount }).map((_, i) => (
                    <th key={i} className="px-6 py-4">
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right w-14">
                    <Skeleton className="h-4 w-6 rounded-md ml-auto" />
                  </th>
                </tr>
              </thead>

              {/* Rows skeleton */}
              <tbody className="divide-y divide-stone-200/80 dark:divide-[#181d28]">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="transition-colors">
                    {Array.from({ length: colCount }).map((_, colIndex) => {
                      const widthClass = cellWidths[(rowIndex + colIndex) % cellWidths.length]
                      const isImageCol = colIndex === 2 // If 3rd column is image, give it a thumbnail skeleton
                      return (
                        <td key={colIndex} className="px-6 py-4">
                          {isImageCol ? (
                            <Skeleton className="w-10 h-10 rounded-xl" />
                          ) : (
                            <Skeleton className={`h-4 ${widthClass} rounded-md`} />
                          )}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 text-right">
                      <Skeleton className="w-7 h-7 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination skeleton */}
        {showPagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1">
            <Skeleton className="h-4 w-40 rounded-md" />
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((p) => (
                <Skeleton key={p} className="h-8 w-8 rounded-lg" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
