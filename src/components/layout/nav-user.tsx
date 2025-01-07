import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Avatar from 'boring-avatars'
import { signOut } from 'firebase/auth'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { auth } from '../../firebase'

export function NavUser() {
  const { isMobile } = useSidebar()

  const [authentication] = useState(auth)
  const [user, setUser] = useState(authentication?.currentUser)

  useEffect(() => {
    setUser(authentication?.currentUser)
  }, [authentication])

  const navigate = useNavigate()

  function signingOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate({ to: '/' })
        console.log('Signed out successfully')
      })
      .catch((error) => {
        // An error happened.
      })
  }

  return (
    <>
      {user ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar
                    name={user?.displayName}
                    variant='pixel'
                    colors={[
                      '#000',
                      '#ffffff',
                      '#000000',
                      '#ffffff',
                      '#ffa300',
                    ]}
                  />
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.displayName}
                    </span>
                    <span className='truncate text-xs'>{user?.email}</span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar
                      name={user?.displayName}
                      variant='pixel'
                      colors={[
                        '#000',
                        '#ffffff',
                        '#000000',
                        '#ffffff',
                        '#ffa300',
                      ]}
                    />
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user?.displayName}
                      </span>
                      <span className='truncate text-xs'>{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signingOut()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : null}
    </>
  )
}
