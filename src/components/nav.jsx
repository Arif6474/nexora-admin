import { Link } from 'react-router-dom';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { Button, buttonVariants } from './custom/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdownMenu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@/lib/utils';
import useCheckActiveNav from '@/hooks/use-check-active-nav';

export default function Nav({
  links,
  isCollapsed,
  className,
  closeNav,
}) {
  const renderLink = ({ sub, ...rest }) => {
    const key = `${rest.title}-${rest.href}`;
    if (isCollapsed && sub)
      return (
        <NavLinkIconDropdown
          {...rest}
          sub={sub}
          key={key}
          closeNav={closeNav}
        />
      );

    if (isCollapsed)
      return <NavLinkIcon {...rest} key={key} closeNav={closeNav} />;

    if (sub)
      return (
        <NavLinkDropdown {...rest} sub={sub} key={key} closeNav={closeNav} />
      );

    return <NavLink {...rest} key={key} closeNav={closeNav} />;
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'group bg-transparent py-2 transition-[max-height,padding] duration-500 data-[collapsed=true]:py-2',
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <nav className='grid gap-1.5 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
          {links.map(renderLink)}
        </nav>
      </TooltipProvider>
    </div>
  );
}

function NavLink({
  title,
  icon,
  label,
  href,
  closeNav,
  subLink = false,
}) {
  const { checkActiveNav } = useCheckActiveNav();
  const isActive = checkActiveNav(href);
  return (
    <Link
      to={href}
      onClick={closeNav}
      className={cn(
        'relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 group mx-2 overflow-hidden',
        isActive
          ? 'gold-active-gradient text-stone-950 font-bold shadow-lg shadow-amber-500/25'
          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.04] border border-transparent',
        subLink && 'py-2 px-3 text-xs mx-0'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Top glossy reflection sheen */}
      {isActive && (
        <span className='absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-xl' />
      )}
      <div className='relative z-10 flex items-center gap-3'>
        <span className={cn('transition-colors', isActive ? 'text-stone-950' : 'text-stone-500 group-hover:text-stone-900 dark:text-zinc-400 dark:group-hover:text-zinc-200')}>
          {icon}
        </span>
        <span className={isActive ? 'text-stone-950 font-extrabold tracking-tight' : ''}>{title}</span>
      </div>
    </Link>
  );
}

function NavLinkDropdown({ title, icon, label, sub, closeNav }) {
  const { checkActiveNav } = useCheckActiveNav();
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));

  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          'flex w-[calc(100%-1rem)] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group mx-2 border border-transparent hover:bg-stone-100 dark:hover:bg-white/[0.04]',
          isChildActive
            ? 'text-stone-900 dark:text-white font-semibold'
            : 'text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white'
        )}
      >
        <div className='flex items-center gap-3'>
          <span className={cn('transition-colors', isChildActive ? 'text-amber-500 dark:text-amber-400' : 'text-stone-500 group-hover:text-stone-900 dark:text-zinc-400 dark:group-hover:text-zinc-200')}>
            {icon}
          </span>
          <span>{title}</span>
        </div>
        <span
          className={cn(
            'ml-auto text-stone-400 dark:text-zinc-400 transition-all duration-200 group-data-[state="open"]:-rotate-180',
            isChildActive && 'text-stone-700 dark:text-zinc-300'
          )}
        >
          <IconChevronDown size={16} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='collapsibleDropdown' asChild>
        <ul className='my-1 ml-6 space-y-1 border-l border-stone-200 dark:border-zinc-800/80 pl-2'>
          {sub?.map((sublink) => (
            <li key={sublink.title}>
              <NavLink {...sublink} subLink closeNav={closeNav} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavLinkIcon({ title, icon, label, href }) {
  const { checkActiveNav } = useCheckActiveNav();
  const isActive = checkActiveNav(href);
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={href}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 overflow-hidden',
            isActive
              ? 'gold-active-gradient text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
          )}
        >
          {isActive && (
            <span className='absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-xl' />
          )}
          <span className={cn('relative z-10', isActive ? 'text-stone-950' : '')}>
            {icon}
          </span>
          <span className='sr-only'>{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right' className='flex items-center gap-4'>
        {title}
        {label && (
          <span className='ml-auto text-muted-foreground'>{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function NavLinkIconDropdown({ title, icon, label, sub }) {
  const { checkActiveNav } = useCheckActiveNav();
  const isChildActive = !!sub?.find((s) => checkActiveNav(s.href));

  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 outline-none overflow-hidden',
                isChildActive
                  ? 'bg-stone-100 text-stone-900 dark:bg-white/10 dark:text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
              )}
            >
              <span>{icon}</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4'>
          {title}{' '}
          {label && (
            <span className='ml-auto text-muted-foreground'>{label}</span>
          )}
          <IconChevronDown
            size={18}
            className='-rotate-90 text-muted-foreground'
          />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side='right' align='start' sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub?.map(({ title, icon, label, href }) => {
          const isSubActive = checkActiveNav(href);
          return (
            <DropdownMenuItem key={`${title}-${href}`} asChild>
              <Link
                to={href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                  isSubActive
                    ? 'gold-active-gradient text-stone-950 font-bold'
                    : 'hover:bg-stone-100 dark:hover:bg-white/5'
                )}
              >
                {icon} <span className='max-w-52 text-wrap'>{title}</span>
                {label && <span className='ml-auto text-xs'>{label}</span>}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
