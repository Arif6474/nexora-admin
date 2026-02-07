import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';
import { selectEmployee } from '../../redux/features/auth/authSelectors';
import { IconLogout } from '@tabler/icons-react';

export function UserNav() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const employee = useSelector(selectEmployee);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign-in');
  };
  function getInitials(name) {
    const words = name.trim().split(" ");
    if (words.length < 2) return "";

    const initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
    return initials;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{getInitials(employee?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{employee?.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {employee?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>
            {<IconLogout />}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
