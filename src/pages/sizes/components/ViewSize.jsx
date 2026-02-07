import Loader from "@/components/Shared/loader/loader";
import { useSingleSizeQuery } from "../../../redux/features/sizes/sizeApi";

export default function ViewSize({ targetID }) {
    const { data: size, isLoading } = useSingleSizeQuery({ id: targetID });

    if (isLoading) return <Loader height="20dvh" />;

    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-white">{size?.size}</h3>
                    <p className="text-sm text-stone-400 font-medium">{size?.gender} • {size?.itemType}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${size?.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {size?.isActive ? 'Active' : 'Archived'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
                <div className="space-y-4">
                    <p className="text-xs text-stone-500 uppercase font-black tracking-widest">Size Chart</p>
                    {size?.sizeChart && Object.keys(size.sizeChart).length > 0 ? (
                        <div className="space-y-2">
                            {Object.entries(size.sizeChart).map(([key, val]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-stone-400">{key}:</span>
                                    <span className="text-white font-bold">{val}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-stone-600 italic">No data available</p>
                    )}
                </div>
                <div className="space-y-4">
                    <p className="text-xs text-stone-500 uppercase font-black tracking-widest">Measurements</p>
                    {size?.measurements && Object.keys(size.measurements).length > 0 ? (
                        <div className="space-y-2">
                            {Object.entries(size.measurements).map(([key, val]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-stone-400">{key}:</span>
                                    <span className="text-white font-bold">{val}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-stone-600 italic">No measurements defined</p>
                    )}
                </div>
            </div>
        </div>
    );
}
