function Filter({ filter, setFilter, filterData }) {
    if (!filterData || filterData.length === 0) return null;

    return (
        <div className="inline-flex items-center bg-white border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] p-1 rounded-full shadow-sm">
            {filterData.map((item) => {
                const isActive = String(filter || '').toLowerCase() === String(item).toLowerCase();
                return (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setFilter(item)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                            isActive
                                ? 'gold-active-gradient text-stone-950 font-bold shadow-sm'
                                : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200 border border-transparent'
                        }`}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
}

export default Filter;