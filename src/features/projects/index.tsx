import { useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { Message } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessagePlus,
  IconMessages,
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
  IconTrash,
} from '@tabler/icons-react'
import Avatar from 'boring-avatars'
import { User } from 'firebase/auth'
import {
  DatabaseReference,
  equalTo,
  onValue,
  orderByChild,
  push,
  query,
  ref,
} from 'firebase/database'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FakeProgress } from '../../components/fake-progress'
import { auth, database } from '../../firebase'
import { Project } from '../../lib/publicTypes'
import './Chat.css'
import Flow from './flow'

export default function Projects() {
  const [search, setSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [waitingMessage, setWaitingMessage] = useState(false)
  const [mobileSelectedProject, setMobileSelectedProject] =
    useState<Project | null>(null)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [dbRef, setDbRef] = useState<DatabaseReference>()
  const [socket, setSocket] = useState<WebSocket>()
  const [db] = useState<any>(database)
  const [websocketData, setWebsocketData] = useState({
    websocket: '',
    id: '',
    customerId: '',
    projectId: '',
  })


  const navigate = useNavigate()
  const [authentication] = useState(auth)


  useEffect(() => {
    const unsubscribeAuth = authentication.onAuthStateChanged((user: User | null) => {
      if (user) {
        const vs = query(
          ref(db, 'archs'),
          orderByChild('customer'),
          equalTo(user.uid)
        );

        const unsubscribeDb = onValue(vs, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const projects = Object.keys(data).map((key) => ({
              idx: key,
              ...data[key],
            }));
            setFilteredProjects(projects);
          }
        });

        return () => {
          unsubscribeDb();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [authentication, db]);


  async function selectProject(worker: Project) {
    navigate({
      to: `/projects/${worker.idx}`,
    })
  }

  function cleanUrls(text: string) {
    const urlRegex = /(\bhttps?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
    const markdownLinkRegex =
      /\[([^\]]+)\]\((https?:\/\/[^\s<]+[^<.,:;"')\]\s])\)/g

    return text.replace(urlRegex, (url) => {
      if (markdownLinkRegex.test(text)) {
        return url
      }
      return `[${url}](${url})`
    })
  }

  function deleteProject(id: string) {
    setLoading(true)
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {loading ? (
        <FakeProgress />
      ) : (
        <Main fixed>
          {!selectedProject ? (
            <>
              <div className='flex items-center justify-between mb-4'>
                <h1 className='text-2xl font-bold'>Projects</h1>
                <Button
                  onClick={() =>
                    navigate({
                      to: '/projects/settings/new/settings',
                    } as any)
                  }
                  variant='ghost'
                >
                  <IconPlus size={24} className='stroke-muted-foreground' />
                  <span className='ml-2'>New project</span>
                </Button>
              </div>
              <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
                {filteredProjects.map((app) => (
                  <li
                    key={app.id}
                    className='rounded-lg border p-4 hover:shadow-md'
                  >
                    <div className='mb-8 flex items-center justify-between'>
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                      >
                        <Avatar
                          name={app.name}
                          variant='pixel'
                          colors={[
                            '#000',
                            '#ffffff',
                            '#000000',
                            '#ffffff',
                            '#ffa300',
                          ]}
                          size={50}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={() =>
                            navigate({
                              to: `/Projects/agent/${app.id}/settings`,
                            })
                          }
                          className='mr-2'
                          variant='outline'
                          size='sm'
                        >
                          <IconEdit
                            size={22}
                            className='stroke-muted-foreground'
                          />
                        </Button>
                        <Button
                          onClick={() => deleteProject(app.id)}
                          className='mr-2'
                          variant='outline'
                          size='sm'
                        >
                          <IconTrash
                            size={22}
                            className='stroke-muted-foreground'
                          />
                        </Button>
                        <Button
                          onClick={() => selectProject(app)}
                          variant='outline'
                          size='sm'
                        >
                          <IconMessages
                            size={22}
                            className='stroke-muted-foreground'
                          />
                        </Button>
                      </div>
                    </div>
                    <div
                      className='cursor-pointer'
                      onClick={() => selectProject(app)}
                    >
                      <h2 className='mb-1 font-semibold'>{app.name}</h2>
                      <p className='line-clamp-2 text-gray-500'>{app.id}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <section className='flex h-full gap-6'>
              <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
                <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
                  <div className='flex items-center justify-between py-2'>
                    <div className='flex gap-2 items-center'>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='rounded-lg'
                        onClick={() => setSelectedProject(null)}
                      >
                        <IconArrowLeft
                          size={24}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                      <h2 className='text-2xl font-bold'>
                        Projects of {selectedProject.name}
                      </h2>
                    </div>

                    <Button
                      size='icon'
                      variant='ghost'
                      className='rounded-lg'
                      onClick={() => {
                        // newChat()
                      }}
                    >
                      <IconMessagePlus
                        size={24}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                  </div>

                  <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                    <IconSearch size={15} className='mr-2 stroke-slate-500' />
                    <span className='sr-only'>Search</span>
                    <input
                      type='text'
                      className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                      placeholder='Search project...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                </div>
                <ScrollArea className='-mx-3 h-full p-3'>
                  {filteredProjects.map((project) => {
                    return (
                      <Fragment key={project.id}>
                        <button
                          type='button'
                          className={cn(
                            '-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75',
                            project.id === websocketData?.projectId &&
                              'bg-primary-foreground'
                          )}
                          onClick={() => {
                            // openChat(selectedProject.id, project.projectId)
                          }}
                        >
                          <div className='flex gap-2 w-full'>
                            <Avatar
                              name={selectedProject.name}
                              variant='pixel'
                              colors={[
                                '#000',
                                '#ffffff',
                                '#000000',
                                '#ffffff',
                                '#ffa300',
                              ]}
                              size={50}
                            />

                            <div>
                              <span className='col-start-2 row-span-2 font-medium'>
                                {format(project.createdAt || new Date(), 'dd/MM/yyyy h:mm a')}
                              </span>
                              <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
                                {project?.name}
                              </span>
                            </div>
                          </div>
                        </button>
                        <Separator className='my-1' />
                      </Fragment>
                    )
                  })}
                </ScrollArea>
              </div>

              
            </section>
          )}
        </Main>
      )}
    </>
  )
}
