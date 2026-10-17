import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex h-auto items-center justify-center rounded-full bg-white border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] p-1 text-stone-600 dark:text-zinc-400 shadow-sm',
        className
      )}
      {...rest}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-100 border border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:via-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-stone-950 data-[state=active]:font-bold data-[state=active]:shadow-sm',
        className
      )}
      {...rest}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...rest}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
