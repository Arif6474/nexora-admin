import { Layout } from '@/components/custom/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <Layout className="bg-slate-50 dark:bg-[#0b0d11] min-h-screen text-stone-900 dark:text-stone-100">
      <div className="p-4 sm:p-6 md:p-8 space-y-7 max-w-[1600px] mx-auto w-full">
        {/* Header Greeting & Time Filter Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 md:h-9 w-60 rounded-xl" />
          </div>

          {/* Time range pills skeleton */}
          <div className="inline-flex items-center bg-white border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] p-1 rounded-2xl self-start sm:self-auto shadow-sm gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-16 sm:w-18 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Top 5 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-[155px] shadow-sm relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="w-11 h-11 rounded-2xl" />
                <Skeleton className="w-20 h-9 rounded-lg opacity-60" />
              </div>
              <div>
                <Skeleton className="h-7 w-24 rounded-lg mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                  <Skeleton className="h-3 w-14 rounded-md opacity-70" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row: Sales Performance & Sales Summary Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sales Performance Card (Left ~68%) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-3 w-56 rounded-md opacity-70" />
                </div>
              </div>
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>

            {/* Glowing Golden Curved Area Chart Placeholder */}
            <div className="w-full relative mt-4 pt-2">
              <div className="space-y-6">
                {[1, 2, 3, 4].map((grid) => (
                  <div key={grid} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-8 rounded-sm opacity-50 shrink-0" />
                    <Skeleton className="h-[1px] w-full rounded-none opacity-40" />
                  </div>
                ))}
              </div>
              <Skeleton className="w-full h-36 rounded-2xl mt-4 opacity-50" />
              <div className="flex justify-between mt-3 px-8">
                {[1, 2, 3, 4, 5, 6, 7].map((point) => (
                  <Skeleton key={point} className="h-3 w-10 rounded-sm opacity-60" />
                ))}
              </div>
            </div>
          </div>

          {/* Sales Summary Card (Right ~32%) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-[#1b212d] pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-32 rounded-md" />
                    <Skeleton className="h-3 w-40 rounded-md opacity-70" />
                  </div>
                </div>
                <Skeleton className="w-7 h-7 rounded-lg opacity-60" />
              </div>

              {/* Stats blocks skeleton */}
              <div className="py-5 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-7 w-28 rounded-lg" />
                    <Skeleton className="h-3 w-20 rounded-md opacity-70" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-md opacity-70" />
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-3 w-24 rounded-md opacity-70" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-md opacity-70" />
                </div>
              </div>
            </div>

            {/* Motivational Banner Skeleton */}
            <div className="rounded-2xl border border-stone-200/90 dark:border-[#1e2330] p-4 flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                  <Skeleton className="h-3 w-44 rounded-md opacity-70" />
                </div>
              </div>
              <Skeleton className="w-4 h-4 rounded-full opacity-50" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Top 10 Selling Products Table Skeleton */}
        <div className="bg-white dark:bg-[#11141b] border border-stone-200/90 dark:border-[#1e2330] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 md:p-6 border-b border-stone-200/80 dark:border-[#1b212d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md opacity-70" />
              </div>
            </div>
            <Skeleton className="h-8 w-32 rounded-xl self-start sm:self-auto" />
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/80 dark:border-[#181d28] bg-stone-50/90 dark:bg-[#0e1017]/50">
                  <th className="px-6 py-3.5 w-12"><Skeleton className="h-3 w-4 rounded-sm" /></th>
                  <th className="px-6 py-3.5"><Skeleton className="h-3 w-20 rounded-sm" /></th>
                  <th className="px-6 py-3.5"><Skeleton className="h-3 w-14 rounded-sm" /></th>
                  <th className="px-6 py-3.5"><Skeleton className="h-3 w-14 rounded-sm" /></th>
                  <th className="px-6 py-3.5"><Skeleton className="h-3 w-16 rounded-sm" /></th>
                  <th className="px-6 py-3.5"><Skeleton className="h-3 w-16 rounded-sm" /></th>
                  <th className="px-6 py-3.5 text-right w-12"><Skeleton className="h-3 w-4 rounded-sm ml-auto" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 dark:divide-[#181d28]">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    <td className="px-6 py-4"><Skeleton className="h-3 w-3 rounded-sm" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                        <Skeleton className="h-4 w-44 rounded-md" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-3.5 w-20 rounded-md" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12 rounded-md" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16 rounded-md" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-6 rounded-lg ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
