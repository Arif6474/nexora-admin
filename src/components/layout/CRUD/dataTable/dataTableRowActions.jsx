import React from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';


export function DataTableRowActions({ actions }) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {actions.map(({ label, onClick, icon: Icon }, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem onClick={onClick}>
              {label}
              {Icon && <DropdownMenuShortcut>{<Icon />}</DropdownMenuShortcut>}
            </DropdownMenuItem>
            {index < actions.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
