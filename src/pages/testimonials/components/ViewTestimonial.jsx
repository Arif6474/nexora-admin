import Loader from "../../../components/Shared/loader/loader";
import { useSingleTestimonialQuery } from "../../../redux/features/testimonials/testimonialApi";
import TitleDescription from "../../../components/Shared/titleDescription/titleDescription";
import { IconStar } from "@tabler/icons-react";

export default function ViewTestimonial({ targetID }) {
    const { data: testimonial, isLoading } = useSingleTestimonialQuery({ id: targetID });

    if (isLoading) return <Loader height="30dvh" />;

    const avatarSrc = testimonial?.image?.startsWith('http')
        ? testimonial.image
        : testimonial?.image
        ? `${import.meta.env.VITE_REACT_APP_SPACES_URL || ''}${testimonial.image}`
        : null;

    return (
        <div className="pt-4 max-h-[75vh] overflow-auto space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-[#121620] border border-stone-200/80 dark:border-[#1e2330]">
                {avatarSrc ? (
                    <img
                        src={avatarSrc}
                        alt={testimonial?.author}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-[#222838]"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 dark:text-amber-400 font-bold text-xl">
                        {testimonial?.author ? testimonial.author.charAt(0).toUpperCase() : 'T'}
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                        {testimonial?.author}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                        {testimonial?.role || 'Verified Buyer'}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                        {Array.from({ length: testimonial?.rating || 5 }).map((_, i) => (
                            <IconStar key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-semibold ml-1 text-stone-600 dark:text-zinc-300">
                            {testimonial?.rating || 5}.0
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TitleDescription title="Display Size" description={testimonial?.size || 'medium'} />
                <TitleDescription title="Serial Number" description={String(testimonial?.serial ?? 1)} />
                <TitleDescription title="Status" description={testimonial?.isActive ? 'Active' : 'Archived'} />
            </div>

            <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121620]/60 border border-stone-200/80 dark:border-[#1e2330]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2">
                    Testimonial Quote
                </h4>
                <p className="text-sm italic text-stone-800 dark:text-zinc-200 leading-relaxed font-serif">
                    "{testimonial?.content}"
                </p>
            </div>
        </div>
    );
}
