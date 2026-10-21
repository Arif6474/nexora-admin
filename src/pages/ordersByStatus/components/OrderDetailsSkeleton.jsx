import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsSkeleton() {
  return (
    <div className="p-5 sm:p-7 md:p-8 space-y-6 text-stone-900 dark:text-stone-100 max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 pr-8">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-md opacity-70" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column (Items + Summary) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Order Items */}
          <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {[1, 2, 3].map((item) => (
                <div key={item} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-1/3 rounded-md opacity-70" />
                    </div>
                  </div>
                  <div className="text-right space-y-1.5">
                    <Skeleton className="h-4 w-16 rounded-md ml-auto" />
                    <Skeleton className="h-3 w-10 rounded-md opacity-70 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Order Summary */}
          <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3.5 w-14 rounded" />
              </div>
              <div className="border-t border-stone-100 dark:border-stone-800 pt-3 flex justify-between">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Customer + Shipping + Timeline) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Customer Details */}
          <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-40 rounded-md opacity-70" />
              </div>
            </div>
          </div>

          {/* Card: Shipping Address */}
          <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
              <Skeleton className="h-3.5 w-3/5 rounded-md" />
              <Skeleton className="h-3.5 w-1/2 rounded-md opacity-70" />
            </div>
          </div>

          {/* Card: Payment & Status */}
          <div className="bg-white dark:bg-[#12151c] border border-stone-200/80 dark:border-[#1f2533] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
