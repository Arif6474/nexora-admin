import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  IconChevronsLeft,
  IconMenu2,
  IconX,
  IconSun,
  IconMoon,
  IconLogout,
} from '@tabler/icons-react'
import { Layout } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import { sidelinks } from '@/data/sidelinks'
import { useTheme } from '@/components/theme/themeProvider'
import { logout } from '@/redux/features/auth/authSlice'
import { selectEmployee } from '@/redux/features/auth/authSelectors'

export function MaverickLogo({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="mav-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="mav-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.45" />
        </filter>
      </defs>
      <path
        d="M6 25L13 9.5C13.6 8.2 15.3 8 16.2 9.1L20.5 15"
        stroke="url(#mav-gold-grad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#mav-glow)"
      />
      <path
        d="M15.5 21L19.8 26.9C20.7 28 22.4 27.8 23 26.5L30 11"
        stroke="url(#mav-gold-grad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#mav-glow)"
      />
    </svg>
  );
}

export default function Sidebar({ className, isCollapsed: propCollapsed, setIsCollapsed: propSetCollapsed }) {
  const [navOpened, setNavOpened] = useState(false)
  const [localCollapsed, setLocalCollapsed] = useState(false)

  const isCollapsed = propCollapsed !== undefined ? propCollapsed : localCollapsed
  const setIsCollapsed = propSetCollapsed !== undefined ? propSetCollapsed : setLocalCollapsed

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const employee = useSelector(selectEmployee)
  const { theme, setTheme } = useTheme()

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/sign-in')
  }

  const displayName = employee?.name || 'System Superadmin'
  const roleName = employee?.level || employee?.role || 'superAdmin'
  const spacesUrl = import.meta.env.VITE_REACT_APP_SPACES_URL || ''
  const avatarSrc = employee?.image
    ? employee.image.startsWith('http')
      ? employee.image
      : `${spacesUrl}${employee.image}`
    : '/avatars/admin.jpg'

  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNavOpened(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Backdrop overlay on mobile when menu opened */}
      <div
        onClick={() => setNavOpened(false)}
        className={cn(
          "fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          navOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={cn(
          `fixed left-0 right-0 top-0 z-50 w-full border-r border-stone-200 bg-white dark:border-[#191d28] dark:bg-[#0c0e13] transition-[width,height] duration-300 md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-16' : 'md:w-64'}`,
          navOpened ? 'h-svh' : 'h-16 md:h-svh overflow-hidden md:overflow-visible',
          className
        )}
      >
        <Layout fixed className={cn("bg-white dark:bg-[#0c0e13] flex flex-col justify-between h-full", navOpened ? 'h-svh' : '')}>
          <div className="flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className={cn("flex items-center justify-between px-5 h-16 md:h-20 border-b border-stone-200/80 dark:border-[#181c26]/60 flex-shrink-0", isCollapsed && "md:px-3 md:justify-center")}>
              <div className="flex items-center gap-3">
                <MaverickLogo className="w-8 h-8 flex-shrink-0" />
                {(!isCollapsed || navOpened) && (
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white leading-none">
                      Nexora
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile toggle button */}
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white'
                aria-label='Toggle Navigation'
                onClick={() => setNavOpened((prev) => !prev)}
              >
                {navOpened ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
              </Button>
            </div>

            {/* Navigation links - hidden on mobile when closed */}
            <div className={cn("flex-1 overflow-y-auto py-4 px-1.5 no-scrollbar", !navOpened && "hidden md:block")}>
              <Nav
                id='sidebar-menu'
                className={navOpened ? 'max-h-screen' : 'max-h-0 md:max-h-none'}
                closeNav={() => setNavOpened(false)}
                isCollapsed={isCollapsed && !navOpened}
                links={sidelinks}
              />
            </div>
          </div>

          {/* Sidebar Footer - hidden on mobile when closed */}
          <div className={cn(
            "border-t border-stone-200/80 dark:border-[#181c26]/60 bg-white dark:bg-[#0c0e13] flex-shrink-0",
            !navOpened && "hidden md:block",
            isCollapsed ? "md:p-2.5 p-4" : "p-4"
          )}>
            {/* Collapsed desktop footer */}
            {isCollapsed && (
              <div className="hidden md:flex flex-col items-center gap-3">
                {/* Collapsed Theme Toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900 dark:bg-[#11141c] dark:border-[#1f2533] dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  {isDark ? (
                    <IconMoon className="w-4 h-4 text-[#818cf8]" />
                  ) : (
                    <IconSun className="w-4 h-4 text-amber-500" />
                  )}
                </button>

                {/* Collapsed User Avatar */}
                <div
                  className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-stone-300 dark:ring-zinc-700/60 bg-stone-100 dark:bg-zinc-800 flex-shrink-0 shadow-inner cursor-pointer"
                  title={`${displayName} (${roleName})`}
                >
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/avatars/admin.jpg'
                    }}
                  />
                </div>

                {/* Collapsed Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-400 dark:hover:text-rose-400 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <IconLogout className="w-4 h-4" stroke={1.8} />
                </button>
              </div>
            )}

            {/* Expanded footer (desktop when not collapsed, or mobile when drawer is opened) */}
            <div className={cn("flex flex-col gap-3.5", isCollapsed && "md:hidden")}>
              {/* Theme Mode Toggle Pill */}
              <div className="w-full bg-stone-100 border border-stone-200/90 dark:bg-[#11141c] dark:border-[#1f2533] rounded-full p-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer",
                    !isDark
                      ? "bg-white text-stone-900 shadow-sm border border-stone-200/80 font-semibold"
                      : "text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  )}
                >
                  <IconSun className={cn("w-4 h-4 transition-colors", !isDark ? "text-amber-500" : "text-stone-400 dark:text-zinc-400")} />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer",
                    isDark
                      ? "bg-[#1c2230] text-white shadow-sm border border-white/5 font-semibold"
                      : "text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  )}
                >
                  <IconMoon className={cn("w-4 h-4 transition-colors", isDark ? "text-[#818cf8]" : "text-stone-400 dark:text-zinc-400")} />
                  <span>Dark</span>
                </button>
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center justify-between gap-3 px-0.5 pt-0.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-stone-300 dark:ring-zinc-700/60 bg-stone-100 dark:bg-zinc-800 flex-shrink-0 shadow-inner">
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/avatars/admin.jpg'
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-stone-900 dark:text-white tracking-tight leading-tight truncate">
                      {displayName}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-zinc-400 font-normal leading-tight truncate mt-0.5">
                      {roleName}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                >
                  <IconLogout className="w-5 h-5" stroke={1.8} />
                </button>
              </div>
            </div>
          </div>

          {/* Collapse toggle button for desktop */}
          <Button
            onClick={() => setIsCollapsed((prev) => !prev)}
            size='icon'
            variant='ghost'
            className='absolute -right-3.5 top-6 z-50 hidden h-7 w-7 rounded-full border border-stone-200 bg-white text-stone-600 hover:text-stone-900 shadow-md dark:border-[#252b3b] dark:bg-[#11141b] dark:text-zinc-400 dark:hover:text-white md:inline-flex'
          >
            <IconChevronsLeft
              stroke={1.8}
              className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </Button>
        </Layout>
      </aside>
    </>
  )
}


