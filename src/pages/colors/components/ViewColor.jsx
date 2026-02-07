import Loader from "@/components/Shared/loader/loader";
import { useSingleColorQuery } from "../../../redux/features/colors/colorApi";

export default function ViewColor({ targetID }) {
    const { data: color, isLoading } = useSingleColorQuery({ id: targetID });

    if (isLoading) return <Loader height="20dvh" />;

    return (
        <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-xl border border-stone-800"
                    style={{ backgroundColor: color?.hexCode }}
                />
                <div>
                    <h3 className="text-lg font-bold text-white">{color?.name}</h3>
                    <p className="text-sm text-stone-400 font-mono uppercase">{color?.hexCode}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-800">
                <div>
                    <p className="text-xs text-stone-500 uppercase font-black tracking-widest">Status</p>
                    <p className={`text-sm font-bold ${color?.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {color?.isActive ? 'Active' : 'Archived'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-stone-500 uppercase font-black tracking-widest">Created At</p>
                    <p className="text-sm text-stone-300">
                        {new Date(color?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
