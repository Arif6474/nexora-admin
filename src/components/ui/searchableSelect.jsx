import { useState, useRef, useEffect, useMemo } from 'react';
import { IconSearch, IconChevronDown, IconX, IconCheck } from '@tabler/icons-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function SearchSelectField({
  label,
  options = [],
  value,
  setState,
  placeholder,
  optionLabel = 'name',
  optionValue = '_id',
  disabled = false,
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  // Normalize options array
  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      const val = opt?.[optionValue] ?? opt?.value ?? opt?._id ?? '';
      const lbl = opt?.[optionLabel] ?? opt?.label ?? opt?.name ?? '';
      const img = opt?.image ?? opt?.avatar ?? opt?.img ?? '';
      const desc =
        opt?.description ||
        opt?.slug ||
        (opt?.category ? 'Subcategory · Active' : 'Category · Active');
      return {
        raw: opt,
        value: String(val),
        label: String(lbl),
        image: img,
        subtitle: desc,
      };
    });
  }, [options, optionLabel, optionValue]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find(
      (opt) => String(opt.value) === String(value)
    );
  }, [normalizedOptions, value]);

  // Filter options based on user typing
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.subtitle.toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchQuery]);

  // Resolve image URL
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string' && img.startsWith('http')) return img;
    const base = import.meta.env.VITE_REACT_APP_SPACES_URL || '';
    return `${base}${img}`;
  };

  const handleSelect = (optValue) => {
    setState(optValue);
    setSearchQuery('');
    setOpen(false);
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    setState('');
    setSearchQuery('');
  };

  return (
    <div className="w-full text-left space-y-1.5">
      {/* Top Label matching reference */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-zinc-400 flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Popover Component */}
      <Popover open={open && !disabled} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            onClick={() => {
              if (!disabled) {
                setOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            className={`w-full min-h-[46px] px-3.5 py-2 rounded-2xl sm:rounded-xl border flex items-center gap-2.5 transition-all shadow-sm ${
              disabled
                ? 'opacity-50 cursor-not-allowed bg-stone-100/60 dark:bg-[#0c0e14]/60 border-stone-200 dark:border-[#1a1f2b]'
                : open
                ? 'bg-white dark:bg-[#0c0e14] border-amber-500/70 ring-1 ring-amber-500/30 cursor-text'
                : 'bg-white dark:bg-[#0c0e14] border-stone-200 dark:border-[#222838] hover:border-stone-300 dark:hover:border-[#2e374d] cursor-pointer'
            }`}
          >
            {/* Search Icon */}
            <IconSearch className="w-4 h-4 text-stone-400 dark:text-zinc-500 flex-shrink-0" />

            {/* Input / Display value */}
            <div className="flex-1 relative flex items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                disabled={disabled}
                value={open ? searchQuery : selectedOption ? selectedOption.label : ''}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!open) setOpen(true);
                }}
                onFocus={() => {
                  if (!disabled) setOpen(true);
                }}
                placeholder={
                  selectedOption && !open
                    ? selectedOption.label
                    : placeholder || `Search or select a ${label?.toLowerCase() || 'client'}...`
                }
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-medium text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 truncate"
              />
            </div>

            {/* Clear Button */}
            {selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex-shrink-0"
                title="Clear selection"
              >
                <IconX size={14} />
              </button>
            )}

            {/* Dropdown Chevron */}
            <IconChevronDown
              size={16}
              className={`text-stone-400 dark:text-zinc-500 transition-transform duration-200 flex-shrink-0 ${
                open ? 'rotate-180 text-amber-500' : ''
              }`}
            />
          </div>
        </PopoverTrigger>

        {/* Dropdown List Portal (matches reference design) */}
        <PopoverContent
          align="start"
          sideOffset={6}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          className="p-1.5 rounded-2xl bg-white dark:bg-[#0c0e14] border border-stone-200 dark:border-[#222838] shadow-2xl z-[9999] outline-none max-h-64 sm:max-h-72 overflow-y-auto"
        >
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-xs text-stone-400 dark:text-zinc-500">
              No {label?.toLowerCase() || 'options'} found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                const resolvedImage = getImageUrl(opt.image);
                const initialLetter = opt.label?.charAt(0)?.toUpperCase() || '?';

                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-stone-100 dark:bg-[#1a202c] border border-stone-300 dark:border-[#2a3449] text-stone-900 dark:text-white shadow-sm'
                        : 'hover:bg-stone-50 dark:hover:bg-[#141824] border border-transparent text-stone-800 dark:text-zinc-200'
                    }`}
                  >
                    {/* Left: Avatar + Title & Subtitle */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs bg-gradient-to-tr from-amber-500/20 to-amber-500/35 border border-amber-500/30 text-amber-500 dark:text-amber-400">
                        {resolvedImage ? (
                          <img
                            src={resolvedImage}
                            alt={opt.label}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span>{initialLetter}</span>
                        )}
                      </div>

                      {/* Text info */}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white leading-tight truncate">
                          {opt.label}
                        </p>
                        <p className="text-[11px] font-medium text-stone-400 dark:text-zinc-500 leading-tight mt-0.5 truncate">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right: Checkmark if selected */}
                    {isSelected && (
                      <IconCheck
                        size={16}
                        className="text-amber-500 flex-shrink-0 ml-2"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}