import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { IconLoader2 } from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'relative overflow-hidden gold-active-gradient text-stone-950 font-bold border border-amber-300/70 shadow-md shadow-amber-500/25 hover:brightness-105 active:scale-[0.98]',
        gold:
          'relative overflow-hidden gold-active-gradient text-stone-950 font-bold border border-amber-300/70 shadow-md shadow-amber-500/25 hover:brightness-105 active:scale-[0.98]',
        destructive:
          'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/25 border border-rose-500/50 active:scale-[0.98]',
        outline:
          'border border-stone-200 dark:border-[#1f2533] bg-white dark:bg-[#12151c] text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-[#181d28] hover:text-stone-900 dark:hover:text-white shadow-sm active:scale-[0.98]',
        secondary:
          'bg-stone-100 dark:bg-[#181d28] text-stone-800 dark:text-zinc-200 border border-stone-200/80 dark:border-[#252b3b] shadow-sm hover:bg-stone-200/80 dark:hover:bg-[#202737] active:scale-[0.98]',
        ghost:
          'hover:bg-stone-100 dark:hover:bg-white/5 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white',
        link:
          'text-amber-500 underline-offset-4 hover:underline font-semibold',
      },
      size: {
        default: 'h-10.5 sm:h-11 px-5 py-2.5 rounded-xl',
        sm: 'h-8 rounded-lg px-3 text-xs font-semibold',
        lg: 'h-12 rounded-xl px-8 text-base font-bold',
        icon: 'h-9 w-9 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, children, ...props },
  ref
) {
  const { asChild, ...rest } = props;
  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...rest}
      >
        {children}
      </Slot>
    );
  }

  const {
    loading = false,
    leftSection,
    rightSection,
    disabled,
    ...otherProps
  } = props;

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || disabled}
      ref={ref}
      {...otherProps}
    >
      {((leftSection && loading) ||
        (!leftSection && !rightSection && loading)) && (
        <IconLoader2 className='mr-2 h-4 w-4 animate-spin text-stone-950' />
      )}
      {!loading && leftSection && <div className='mr-2'>{leftSection}</div>}
      {children}
      {!loading && rightSection && <div className='ml-2'>{rightSection}</div>}
      {rightSection && loading && (
        <IconLoader2 className='ml-2 h-4 w-4 animate-spin text-stone-950' />
      )}
    </button>
  );
});
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
