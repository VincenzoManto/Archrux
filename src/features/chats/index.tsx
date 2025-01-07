import { useEffect, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format, set } from 'date-fns'
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
import memoize from 'memoize'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { combineLatest } from 'rxjs'
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
import { toast } from '../../hooks/use-toast'
import {
  Chat,
  Message,
  ServiceAutomate,
  workerListOutput,
} from '../../lib/ServiceAutomate'
import { getToken } from '../../lib/utils'
import './Chat.css'

let saClient: ServiceAutomate

export default function Chats() {
  let conversations: workerListOutput[] = []
  const [search, setSearch] = useState('')
  const [selectedWorker, setSelectedWorker] = useState<workerListOutput | null>(
    null
  )
  const [waitingMessage, setWaitingMessage] = useState(false)
  const [mobileSelectedWorker, setMobileSelectedWorker] =
    useState<workerListOutput | null>(null)
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [filteredWorkers, setFilteredWorkers] = useState<workerListOutput[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [socket, setSocket] = useState<WebSocket>()
  const [websocketData, setWebsocketData] = useState({
    websocket: '',
    workerId: '',
    customerId: '',
    chatId: '',
  })
  const [text, setText] = useState('')

  const navigate = useNavigate()
  let w: any;

  let getChats = async (workerId: string) => {
    setLoading(true)
    const result = await saClient.chatList(workerId)
    result.forEach((e) => {
      e.createdAt = new Date(Math.round(+e.createdAt)) as any
    })
    setLoading(false)
    return result
  }

  let getChatMessages = async (workerId: string, chatId: string) => {
    setLoading(true)
    const results = await saClient.messagesList(workerId, chatId)
    setSelectedChat(chatId)
    setLoading(false)
    return results
  }

  let getWorkers = async () => {
    setLoading(true)
    const results = await saClient.workerList()
    setLoading(false)
    return results
  }

  let getChatsMem = memoize(getChats)
  let getWorkersMem = memoize(getWorkers)
  let getChatMessagesMem = memoize(getChatMessages)

  async function selectWorker(worker: workerListOutput) {
    w = worker
    setSelectedChat(null)
    setMobileSelectedWorker(worker)
    setSelectedWorker(worker)

    const data = await getChatsMem(worker.workerId)
    setFilteredChats(data)
    return selectedWorker;
  }

  useEffect(() => {
    getToken().then(async (token: string) => {
      saClient = new ServiceAutomate({
        token: token,
        domain: 'test.serviceautomate.com',
      })
      conversations = (await getWorkersMem()).map((e) => {
        return {
          ...e,
        }
      })
      setFilteredWorkers(conversations)
    })
  }, [])

  function openChat(workerId: string, chatId: string) {
    combineLatest([
      getChatMessagesMem(workerId, chatId),
      saClient.startWebsocket(workerId, chatId),
    ]).subscribe(([data, w]) => {
      setMessages(data.reverse())
      setWebsocketData(w)
      const s = new WebSocket(w.websocket)
      setSocket(s)
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

  async function newChat() {
    if (!selectedWorker && !w) return
    const sw = w || selectedWorker
    const ws = await saClient.startWebsocket(sw?.workerId!)
    setWebsocketData(ws)
    w = null;
    const s = new WebSocket(ws.websocket)
    setSocket(s)
    setSelectedChat(ws.chatId)
    getChats(sw.workerId)
    setFilteredChats([
      {
        chatId: ws.chatId,
        createdAt: new Date(),
        chatProperties: {
          title: 'New Chat',
        },
        objectId: Date.now().toFixed(2),
      } as any,
      ...filteredChats,
    ])
    setMessages([])
  }

  async function sendMessage(message: string) {
    if (!selectedWorker || !socket) return
    setWaitingMessage(true)
    const newMessage: Message = {
      objectId: Date.now().toFixed(2),
      expiresAt: Date.now(),
      customerId: '1',
      messages: [
        {
          content: [
            {
              type: 'text',
              text: {
                value: message,
              },
            },
          ],
          role: 'user',
        },
      ],
    }
    socket.send(
      JSON.stringify({
        action: 'chat',
        workerId: websocketData.workerId,
        customerId: websocketData.customerId,
        prompt: message,
      })
    )
    setText('')
    setMessages([newMessage, ...messages])
  }

  const handleMessages = (event: any) => {
    const data = JSON.parse(event.data)
    const newMessage: Message = {
      objectId: Date.now().toFixed(2),
      expiresAt: Date.now(),
      customerId: '1',
      messages: [
        {
          content: [
            {
              type: 'text',
              text: {
                value: data.message,
              },
            },
          ],
          role: 'assistant',
        },
      ],
    }
    setWaitingMessage(false)

    setMessages([newMessage, ...messages])
    console.log(messages)
  }

  function deleteWorker(workerId: string) {
    setLoading(true)
    saClient
      .workerDelete(workerId)
      .then(() => {
        setFilteredWorkers((prev) =>
          prev.filter((w) => w.workerId !== workerId)
        )
        setLoading(false)

        toast({
          title: 'Everything is fine',
        }).dismiss(3000)
      })
      .catch(() => {
        setLoading(false)

        toast({
          title: 'Error',
          description: 'An error occurred while deleting the worker',
        }).dismiss(3000)
      })
  }

  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', function (event) {
        console.log('WebSocket connection established')
      })

      socket.addEventListener('message', handleMessages)

      // Connection closed
      socket.addEventListener('close', function (event) {
        console.log('WebSocket connection closed')
      })

      // Error occurred
      socket.addEventListener('error', function (event) {
        console.error('WebSocket error:', event)
      })
    }
  }, [socket, handleMessages])

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
          {!selectedWorker ? (
            <>
              <div className='flex items-center justify-between mb-4'>
                <h1 className='text-2xl font-bold'>Projects</h1>
                <Button
                  onClick={() =>
                    navigate({
                      to: '/chats/agent/new/settings',
                    } as any)
                  }
                  variant='ghost'
                >
                  <IconPlus size={24} className='stroke-muted-foreground' />
                  <span className='ml-2'>New agent</span>
                </Button>
              </div>
              <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
                {filteredWorkers.map((app) => (
                  <li
                    key={app.workerId}
                    className='rounded-lg border p-4 hover:shadow-md'
                  >
                    <div className='mb-8 flex items-center justify-between'>
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                      >
                        <Avatar
                          name={app.workerName}
                          variant='beam'
                          colors={['#000', '#fff', '#000', '#fff']}
                          size={50}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={() =>
                            navigate({
                              to: `/chats/agent/${app.workerId}/settings`,
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
                          onClick={() => deleteWorker(app.workerId)}
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
                          onClick={() => selectWorker(app)}
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
                      onClick={async () => {
                        const w = await selectWorker(app);
                        console.log(w)
                        newChat();
                      }}
                    >
                      <h2 className='mb-1 font-semibold'>{app.workerName}</h2>
                      <p className='line-clamp-2 text-gray-500'>
                        {app.workerId}
                      </p>
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
                        onClick={() => setSelectedWorker(null)}
                      >
                        <IconArrowLeft
                          size={24}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                      <h2 className='text-2xl font-bold'>
                        Chats of {selectedWorker.workerName}
                      </h2>
                    </div>

                    <Button
                      size='icon'
                      variant='ghost'
                      className='rounded-lg'
                      onClick={() => newChat()}
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
                      placeholder='Search chat...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                </div>
                <ScrollArea className='-mx-3 h-full p-3'>
                  {filteredChats.map((chat) => {
                    return (
                      <Fragment key={chat.chatId}>
                        <button
                          type='button'
                          className={cn(
                            '-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75',
                            chat.chatId === websocketData?.chatId &&
                              'bg-primary-foreground'
                          )}
                          onClick={() => {
                            openChat(selectedWorker.workerId, chat.chatId)
                          }}
                        >
                          <div className='flex gap-2 w-full'>
                            <Avatar
                              name={selectedWorker.workerName}
                              variant='beam'
                              colors={['#000', '#fff', '#000', '#fff']}
                              size={50}
                            />

                            <div>
                              <span className='col-start-2 row-span-2 font-medium'>
                                {format(chat.createdAt, 'dd/MM/yyyy h:mm a')}
                              </span>
                              <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
                                {chat?.chatProperties?.title}
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

              {selectedChat ? (
                <div
                  className={cn(
                    'absolute inset-0 hworkerIdden left-full z-50 w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
                    mobileSelectedWorker && 'left-0 flex'
                  )}
                >
                  <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
                    <div className='flex gap-3'>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='-ml-2 h-full sm:hworkerIdden'
                        onClick={() => setMobileSelectedWorker(null)}
                      >
                        <IconArrowLeft />
                      </Button>
                      <div className='flex items-center gap-2 lg:gap-4'>
                        <Avatar
                          name={selectedWorker.workerName}
                          variant='beam'
                          colors={['#000', '#fff', '#000', '#fff']}
                          size={50}
                        />
                        <div>
                          <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                            {selectedWorker.workerName}
                          </span>
                          <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                            {selectedWorker.workerName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                      <Button
                        onClick={() =>
                          navigate({
                            to: `/chats/agent/${selectedWorker.workerId}/settings`,
                          })
                        }
                        size='icon'
                        variant='ghost'
                        className='hworkerIdden size-8 rounded-full sm:inline-flex lg:size-10'
                      >
                        <IconEdit
                          size={22}
                          className='stroke-muted-foreground'
                        />
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
                      <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hworkerIdden'>
                        <div className='chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                          {waitingMessage && (
                            <small className='linear-wipe'>typing...</small>
                          )}
                          {messages?.map((msg) => {
                            const text =
                              msg.messages?.[0]?.content?.[0]?.text?.value
                            const user = msg.messages[0]?.role
                            return (
                              <div
                                key={msg.objectId}
                                className={cn(
                                  'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                                  user === 'user'
                                    ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                                    : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                                )}
                              >
                                <ReactMarkdown remarkPlugins={[gfm]}>
                                  {cleanUrls(text)}
                                </ReactMarkdown>
                                <span
                                  className={cn(
                                    'mt-1 block text-xs font-light italic text-muted-foreground',
                                    user === 'You' && 'text-right'
                                  )}
                                >
                                  {format(msg.expiresAt, 'h:mm a')}
                                </span>
                              </div>
                            )
                          })}
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
                          <IconPlus
                            size={20}
                            className='stroke-muted-foreground'
                          />
                        </Button>
                        <Button
                          size='icon'
                          type='button'
                          variant='ghost'
                          className='hworkerIdden h-8 rounded-md lg:inline-flex'
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
                          className='hworkerIdden h-8 rounded-md lg:inline-flex'
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
                              sendMessage(text)
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
                        onClick={() => sendMessage(text)}
                        variant='ghost'
                        size='icon'
                        className='hworkerIdden sm:inline-flex'
                      >
                        <IconSend size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex flex-1 flex-col items-center justify-center'>
                  <IconMessages
                    size={100}
                    className='stroke-muted-foreground'
                    strokeWidth={1.3}
                  />
                  <h2 className='mt-4 text-2xl font-bold'>No chat selected</h2>
                  <p className='text-muted-foreground'>
                    Select a chat to start messaging
                  </p>
                </div>
              )}
            </section>
          )}
        </Main>
      )}
    </>
  )
}
