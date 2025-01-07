import Avatar from 'boring-avatars'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from '@tanstack/react-router';
import {  signOut } from "firebase/auth";

export function ProfileDropdown() {

  const [authentication] = useState(auth);
  const [user, setUser] = useState(authentication?.currentUser);

  useEffect(() => {
    setUser(authentication?.currentUser);
  }, [authentication])

  const navigate = useNavigate();

  function signingOut() {
    signOut(auth).then(() => {
      // Sign-out successful.
          navigate({ to: "/sign-up"});
          console.log("Signed out successfully")
      }).catch(() => {
      // An error happened.
      });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar
            name={user?.displayName}
            variant='pixel'
            colors={["#000", "#ffffff", "#000000", "#ffffff", "#ffa300"]} 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user?.displayName}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧Ctrl + P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>Ctrl + B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>Ctrl + S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signingOut()}>
          Log out
          <DropdownMenuShortcut>⇧Ctrl + Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
