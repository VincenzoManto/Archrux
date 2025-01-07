import { Outlet, useNavigate, useParams } from '@tanstack/react-router'
import {
  IconArrowLeft,
  IconBrandOffice,
  IconBrandTelegram,
  IconFiles,
  IconMailAi,
  IconUser,
  IconUsersGroup,
  IconWebhook,
} from '@tabler/icons-react'
import Avatar from 'boring-avatars'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '../../../components/ui/button'
import SidebarNav from '../../settings/components/sidebar-nav'

export default function Agent() {
  const { workerId } = useParams({ strict: false })

  const sidebarNavItems = [
    {
      title: 'Settings',
      icon: <IconUser size={18} />,
      href: `/chats/agent/${workerId}/settings`,
    },
    {
      title: 'Connections',
      type: 'hr',
      disabled: workerId === 'new',
    },
    {
      title: 'File operations',
      icon: <IconFiles size={18} />,
      disabled: workerId === 'new',
      href: `/chats/agent/${workerId}/files`,
    },
    {
      title: 'Web search',
      icon: <IconWebhook size={18} />,
      disabled: workerId === 'new',
      href: `/chats/agent/${workerId}/web`,
    },
    {
      title: 'Suite CRM',
      icon: <IconUsersGroup size={18} />,
      disabled: workerId === 'new',
      href: `/chats/agent/${workerId}/suitecrm`,
    },
    {
      title: 'Telegram',
      icon: <IconBrandTelegram size={18} />,
      disabled: workerId === 'new',
      href: `/chats/agent/${workerId}/telegram`,
    },
    {
      title: 'Email',
      icon: <IconMailAi size={18} />,
      disabled: workerId === 'new',
      href: `/chats/agent/${workerId}/email`,
    },
    {
      title: 'O365',
      icon: <IconBrandOffice size={18} />,
      disabled: workerId === 'new',
      href: `/chats/agent/${workerId}/o365`,
    },
  ]

  const navigate = useNavigate()

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='flex items-center justify-start w-full'>
          <Button
            size='icon'
            variant='ghost'
            className='rounded-lg'
            onClick={() =>
              navigate({
                to: '/chats',
              })
            }
          >
            <IconArrowLeft size={24} className='stroke-muted-foreground' />
          </Button>
          <Avatar
            name={workerId}
            variant='beam'
            colors={['#000', '#fff', '#000', '#fff']}
            size={50}
          />
          <div className='space-y-0.5 ml-5'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Configuring Agent
            </h1>
            <p className='text-muted-foreground'>
              Manage this agent's settings and connections.
            </p>
          </div>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 md:space-y-2 overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full p-1 pr-4 overflow-y-hidden'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
