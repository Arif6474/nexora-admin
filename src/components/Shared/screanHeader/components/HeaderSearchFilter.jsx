import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function HeaderSearchFilter({
  title,
  isSearch = true,
  search = '',
  setSearch,
  searchPlaceholder = 'Search...',
  isFilter = true,
  filter,
  setFilter,
  filterData = ['Active', 'Archived'],
  isSelect = false,
  selectData,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(search));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside search container: collapse if empty
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        if (!search) {
          setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [search]);

  // Check if any non-default filter is currently active
  const isDefaultFilter =
    !filter ||
    (filterData?.length > 0 &&
      String(filter).toLowerCase() === String(filterData[0]).toLowerCase());
  const hasCategoryFilter = Boolean(selectData?.value);
  const hasActiveFilters = !isDefaultFilter || hasCategoryFilter;

  const handleResetFilters = () => {
    if (filterData?.length > 0 && setFilter) {
      setFilter(filterData[0]);
    }
    if (selectData?.setState) {
      selectData.setState('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* ============================================================ */}
      {/* 1. SMOOTH EXPANDABLE SEARCH                                  */}
      {/* ============================================================ */}
      {isSearch && (
        <div ref={searchContainerRef} className="relative flex items-center">
          <AnimatePresence initial={false} mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="expanded-search"
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center"
              >
                <IconSearch className="absolute left-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search || ''}
                  onChange={(e) => setSearch?.(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 pl-10 pr-9 rounded-full text-xs font-medium bg-white dark:bg-[#12151c] border border-stone-200 dark:border-[#1f2533] focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 outline-none transition-all shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      if (search) setSearch?.('');
                      else setIsSearchOpen(false);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (search) {
                      setSearch?.('');
                    } else {
                      setIsSearchOpen(false);
                    }
                  }}
                  className="absolute right-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title={search ? 'Clear' : 'Close'}
                >
                  <IconX size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-btn"
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                  search
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                    : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 dark:bg-[#12151c] dark:hover:bg-[#181d28] dark:border-[#1f2533] dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                title="Search"
              >
                <IconSearch size={18} />
                {Boolean(search) && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#12151c]" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. FILTER ICON WITH POPOVER                                 */}
      {/* ============================================================ */}
      {isFilter && (
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                isFilterOpen || hasActiveFilters
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 dark:bg-[#12151c] dark:hover:bg-[#181d28] dark:border-[#1f2533] dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Filter options"
            >
              <IconFilter size={18} />
              {hasActiveFilters && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#12151c]" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={10}
            className="w-80 sm:w-96 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c0e14] border border-stone-200 dark:border-[#1e2433] shadow-2xl text-stone-900 dark:text-zinc-100 z-50 outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-[#1c2230]">
              <h4 className="text-sm font-bold tracking-tight text-stone-900 dark:text-white">
                CRM View & Filter Options
              </h4>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Close"
              >
                <IconX size={15} />
              </button>
            </div>

            {/* Filter Records Section */}
            <div className="pt-3.5 space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                FILTER RECORDS
              </span>

              {/* Existing Tab Switch matching screenshot */}
              {filterData && filterData.length > 0 && (
                <div className="bg-stone-100 dark:bg-[#06080d] p-1.5 rounded-full border border-stone-200/80 dark:border-[#191f2b] flex items-center gap-1 shadow-inner">
                  {filterData.map((item) => {
                    const isActive =
                      String(filter || '').toLowerCase() ===
                      String(item).toLowerCase();
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFilter?.(item)}
                        className={`flex-1 py-2 text-center text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'gold-active-gradient text-stone-950 font-bold shadow-sm'
                            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Additional Select (e.g. Category for Products) */}
            {isSelect && selectData && (
              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-[#1c2230] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                    {selectData.label?.toUpperCase() || 'CATEGORY'}
                  </span>
                  {selectData.value && (
                    <button
                      type="button"
                      onClick={() => selectData.setState?.('')}
                      className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <select
                  value={selectData.value || ''}
                  onChange={(e) => selectData.setState?.(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-[#12151c] border border-stone-200 dark:border-[#1f2533] text-stone-800 dark:text-zinc-200 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all cursor-pointer"
                >
                  <option value="">
                    All {selectData.label || 'Categories'}
                  </option>
                  {selectData.options?.map((opt) => (
                    <option
                      key={opt[selectData.optionValue]}
                      value={opt[selectData.optionValue]}
                    >
                      {opt[selectData.optionLabel]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset All Footer if active filters */}
            {hasActiveFilters && (
              <div className="pt-3.5 mt-3.5 border-t border-stone-100 dark:border-[#1c2230] flex items-center justify-between">
                <span className="text-xs text-stone-400 dark:text-zinc-500 font-medium">
                  Filters applied
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
