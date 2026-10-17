import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import SkipToMain from './skipToMain'
import useIsCollapsed from '../hooks/useIsCollapsed'

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <SkipToMain />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} h-full bg-slate-50 dark:bg-[#0b0d11] text-stone-900 dark:text-stone-100`}
      >
        <Outlet /> 
      </main>
    </div>
  )
}
