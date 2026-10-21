import { Skeleton } from "@/components/ui/skeleton";
import { useSingleColorQuery } from "../../../redux/features/colors/colorApi";

export default function ViewColor({ targetID }) {
    const { data: color, isLoading } = useSingleColorQuery({ id: targetID });

    if (isLoading) {
        return (
            <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28 rounded-lg" />
                        <Skeleton className="h-4 w-20 rounded-md opacity-70" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16 rounded opacity-70" />
                        <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16 rounded opacity-70" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-xl border border-stone-200 dark:border-stone-800"
                    style={{ backgroundColor: color?.hexCode }}
                />
                <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">{color?.name}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 font-mono uppercase">{color?.hexCode}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                <div>
                    <p className="text-xs text-stone-500 uppercase font-black tracking-widest">Status</p>
                    <p className={`text-sm font-bold ${color?.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {color?.isActive ? 'Active' : 'Archived'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-stone-500 uppercase font-black tracking-widest">Created At</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300">
                        {new Date(color?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
