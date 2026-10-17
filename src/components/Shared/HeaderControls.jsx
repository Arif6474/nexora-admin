import { useState } from 'react'
import { IconSearch, IconCalendar, IconBell, IconChevronDown, IconLogout, IconSun, IconMoon } from "@tabler/icons-react"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/redux/features/auth/authSlice';
import { selectEmployee } from '@/redux/features/auth/authSelectors';
import { useTheme } from '@/components/theme/themeProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'

function HeaderControls({ isSearch = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employee = useSelector(selectEmployee);
  const { theme, setTheme } = useTheme();
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  const displayName = employee?.name || 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  // Format date like "Oct 16, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className='w-full px-6 py-4 flex items-center justify-between border-b border-stone-200/80 bg-white/80 dark:border-[#181c26]/60 dark:bg-[#0c0e13]/80 backdrop-blur-md sticky top-0 z-40'>
      {/* Search Bar */}
      <div className='flex items-center'>
        {isSearch && (
          <div className='relative flex items-center'>
            <IconSearch className='absolute left-3.5 w-4 h-4 text-stone-400 dark:text-zinc-500 pointer-events-none' />
            <input
              type='text'
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder='Search products, orders, customers...'
              className='w-72 sm:w-80 md:w-96 pl-10 pr-4 py-2 bg-stone-100/80 hover:bg-stone-100 dark:bg-[#12151c] dark:hover:bg-[#151922] border border-stone-200 dark:border-[#1f2533] focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 rounded-xl text-xs text-stone-900 dark:text-zinc-200 placeholder:text-stone-400 dark:placeholder:text-zinc-500 outline-none transition-all'
            />
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className='flex items-center gap-3'>
        {/* Date Pill */}
        <div className='hidden sm:flex items-center gap-2 px-3.5 py-2 bg-stone-100/80 border border-stone-200 dark:bg-[#12151c] dark:border-[#1f2533] rounded-xl text-xs text-stone-700 dark:text-zinc-300 font-medium'>
          <IconCalendar className='w-4 h-4 text-stone-400 dark:text-zinc-400' />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications Button */}
        <button
          type='button'
          className='relative p-2.5 bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200 text-stone-600 hover:text-stone-900 dark:bg-[#12151c] dark:hover:bg-[#1a1f2c] dark:border-[#1f2533] rounded-xl dark:text-zinc-300 dark:hover:text-white transition-colors cursor-pointer'
          title='Notifications'
        >
          <IconBell className='w-4 h-4' />
          <span className='absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-[#12151c]' />
        </button>

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className='flex items-center gap-2.5 bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200 dark:bg-[#12151c] dark:hover:bg-[#1a1f2c] dark:border-[#1f2533] rounded-xl pl-1.5 pr-3 py-1.5 cursor-pointer transition-colors outline-none'
            >
              <div className='w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 text-stone-950 font-extrabold text-xs flex items-center justify-center ring-1 ring-amber-500/40 shadow-sm'>
                {initial}
              </div>
              <span className='text-xs font-semibold text-stone-800 dark:text-zinc-200'>{displayName}</span>
              <IconChevronDown className='w-3.5 h-3.5 text-stone-400 dark:text-zinc-400' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 bg-white dark:bg-[#12151c] border border-stone-200 dark:border-[#1f2533] text-stone-700 dark:text-zinc-200 shadow-xl dark:shadow-2xl rounded-xl p-1.5' align='end' forceMount>
            <DropdownMenuLabel className='font-normal p-2'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-semibold text-stone-900 dark:text-white leading-none'>{displayName}</p>
                <p className='text-xs leading-none text-stone-500 dark:text-zinc-400'>{employee?.email || 'admin@maverick.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-stone-200/80 dark:bg-[#1f2533]' />
            <DropdownMenuItem
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='cursor-pointer text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 flex items-center justify-between text-stone-700 dark:text-zinc-300'
            >
              <span className='flex items-center gap-2'>
                {theme === 'dark' ? <IconSun className='w-4 h-4 text-amber-500' /> : <IconMoon className='w-4 h-4 text-amber-500' />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className='bg-stone-200/80 dark:bg-[#1f2533]' />
            <DropdownMenuItem
              onClick={handleLogout}
              className='cursor-pointer text-xs rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-500/10 flex items-center justify-between'
            >
              <span>Log out</span>
              <IconLogout className='w-4 h-4' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default HeaderControls