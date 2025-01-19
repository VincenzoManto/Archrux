import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  IconArrowLeft,
  IconChecks,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconSend,
} from '@tabler/icons-react'
import { Edge, Node } from '@xyflow/react'
import Avatar from 'boring-avatars'
import { User } from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import _ from 'lodash'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FakeProgress } from '../../../components/fake-progress'
import { auth, database } from '../../../firebase'
import { Project, Structure } from '../../../lib/publicTypes'
import '../Chat.css'
import Flow from '../flow'
import { toast } from '../../../hooks/use-toast'

export function Details() {
  const [text, setText] = useState('')
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [authentication] = useState(auth)
  const [db] = useState(database)

  const [initStructure, setInitStructure] = useState<Structure>({
    nodes: [],
    edges: [],
  })

  const [structure, setStructure] = useState<Structure>({
    nodes: [],
    edges: [],
  })

  const handleSave = () => {
    const projectRef = ref(db, `archs/${id}/nodes`)
    set(projectRef, structure.nodes)
    const projectRef2 = ref(db, `archs/${id}/edges`)
    set(projectRef2, structure.edges)

    console.log('save', {
      nodes: structure.nodes,
      edges: structure.edges,
    })
    toast({
      title: 'Saved!',
      description: (
        <div className='flex items-center gap-2'>
          <IconChecks size={24} className='text-muted-foreground'/>
          <span className='text-sm text-muted-foreground inline'>
            Your project has been saved.
          </span>
        
        </div>
      ),
    }).dismiss(3000)
  }

  const handleChange = (nodes: Node[], edges: Edge[]) => {
    const n = _.cloneDeep(nodes)
    n.forEach((node: any) => {
      delete node.data.output
    })
    structure.nodes = n
    structure.edges = edges
  }

  useEffect(() => {
    const unsubscribeAuth = authentication.onAuthStateChanged(
      (user: User | null) => {
        if (user) {
          const vs = ref(db, 'archs/' + id)

          const unsubscribeDb = onValue(vs, (snapshot) => {
            const data = snapshot.val()
            if (data) {
              setInitStructure({
                nodes: data.nodes || [],
                edges: data.edges || [],
              })
              setStructure({
                nodes: data.nodes || [],
                edges: data.edges || [],
              })
              setSelectedProject(data)
            }
          })

          return () => {
            unsubscribeDb()
          }
        }
      }
    )

    return () => {
      unsubscribeAuth()
    }
  }, [authentication, db, id])

  return (
    (selectedProject && (
      <>
        <Header>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main fixed>
          <div
            className={cn(
              'absolute inset-0 hidden left-full z-50 w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex'
            )}
          >
            <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
              <div className='flex gap-3'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='-ml-2 h-full sm:hidden'
                  onClick={() => navigate({ to: '/projects' })}
                >
                  <IconArrowLeft />
                </Button>
                <div className='flex items-center gap-2 lg:gap-4'>
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
                    <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                      {selectedProject.name}
                    </span>
                    <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                      {selectedProject.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={handleSave}
                  className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                  <IconDeviceFloppy
                    size={22}
                    className='stroke-muted-foreground'
                  />
                </Button>
                <Button
                  onClick={() =>
                    navigate({
                      to: `/Projects/agent/${selectedProject.id}/settings`,
                    })
                  }
                  size='icon'
                  variant='ghost'
                  className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                  <IconEdit size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                >
                  <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                </Button>
              </div>
            </div>

            <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0'>
              <div className='flex size-full flex-1'>
                <div className='project-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='project-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                    <Flow onChange={handleChange} structure={initStructure}></Flow>
                  </div>
                </div>
              </div>
              <div className='flex  items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
                <div className='space-x-1'>
                  <Button
                    size='icon'
                    type='button'
                    variant='ghost'
                    className='h-8 rounded-md'
                  >
                    <IconPlus size={20} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    type='button'
                    variant='ghost'
                    className='hidden h-8 rounded-md lg:inline-flex'
                  >
                    <IconPhotoPlus
                      size={20}
                      className='stroke-muted-foreground'
                    />
                  </Button>
                  <Button
                    size='icon'
                    type='button'
                    variant='ghost'
                    className='hidden h-8 rounded-md lg:inline-flex'
                  >
                    <IconPaperclip
                      size={20}
                      className='stroke-muted-foreground'
                    />
                  </Button>
                </div>
                <label className='flex-1'>
                  <input
                    onChange={(e) => setText(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        // sendMessage(text)
                      }
                    }}
                    value={text}
                    className='h-8 w-full bg-inherit focus-visible:outline-none'
                    type='text'
                    placeholder='Type a message...'
                    autoFocus
                  />
                </label>
                <Button
                  onClick={() => {
                    // sendMessage(text)
                  }}
                  variant='ghost'
                  size='icon'
                  className='hidden sm:inline-flex'
                >
                  <IconSend size={20} />
                </Button>
              </div>
            </div>
          </div>
        </Main>
      </>
    )) || <FakeProgress />
  )
}
