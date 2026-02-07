import { useEffect } from 'react'
import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useTheme } from './themeProvider'
import { Button } from '../custom/button'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    metaThemeColor && metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <Button
      variant='ghost'
      size='icon'
      className='rounded-full p-2'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {/* Sun Icon for Light Theme */}
      <IconSun
        className={cn(
          'transition-all',
          theme === 'dark' && 'opacity-0 scale-0', // Hide sun in dark theme
          theme === 'light' && 'opacity-100 scale-100', // Show sun in light theme
          'absolute'
        )}
      />
      {/* Moon Icon for Dark Theme */}
      <IconMoon
        className={cn(
          'transition-all',
          theme === 'light' && 'opacity-0 scale-0', // Hide moon in light theme
          theme === 'dark' && 'opacity-100 scale-100', // Show moon in dark theme
          'absolute'
        )}
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
