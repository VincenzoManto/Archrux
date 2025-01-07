import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import memoize from 'memoize'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FakeProgress } from '../../../../components/fake-progress'
import { Switch } from '../../../../components/ui/switch'
import { ServiceAutomate } from '../../../../lib/ServiceAutomate'
import { getToken } from '../../../../lib/utils'

const profileFormSchema = z.object({
  workerId: z.string().optional(),
  browse: z
    .object({
      type: z.string().default('browse'),
      enabled: z.boolean().default(false),
      id: z.string().default('browse1'),
      data: z
        .object({
          maxResults: z.onumber().default(5),
        })
        .optional(),
    })
    .optional(),
  email: z
    .object({
      enabled: z.boolean().default(false),
      type: z.string().default('email'),
      id: z.string().default('email1'),
    })
    .optional(),
  enableFileSearch: z.boolean().default(false),
  enableFileOperations: z.boolean().default(false),
  telegram: z
    .object({
      enabled: z.boolean().default(false),
      type: z.string().default('telegram'),
      id: z.string().default('telegram1'),
      data: z
        .object({
          token: z.string().default(''),
          url: z.string().default(''),
        })
        .optional(),
    })
    .optional(),
  o365: z
    .object({
      enabled: z.boolean().default(false),
      type: z.string().default('o365'),
      id: z.string().default('o3651'),
    })
    .optional(),
  suitecrm: z
    .object({
      enabled: z.boolean().default(false),
      type: z.string().default('suitecrm'),
      id: z.string().default('suitecrm1'),
      data: z
        .object({
          psk: z.string().default(''),
          url: z.string().default(''),
          connectionMode: z.string().default('module'),
        })

        .optional(),
    })
    .optional(),
})

type AgentFormValues = z.infer<typeof profileFormSchema>

let saClient: ServiceAutomate
export default function AgentConnectionsForm() {
  const [values, setValues] = useState<Partial<AgentFormValues>>({})
  const [worker, setWorker] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const { workerId } = useParams({ strict: false })
  const { area } = useParams({ strict: false })

  async function getWorker(workerId: string) {
    return await saClient.workerGet(workerId)
  }

  const getWorkerMem = memoize(getWorker)

  useEffect(() => {
    getToken()
      .then(async (token: string) => {
        saClient = new ServiceAutomate({
          token: token,
          domain: 'test.serviceautomate.com',
        })
        console.log(workerId)
        if (!workerId) {
          navigate({
            to: '/500',
          })
          return
        }
        const data = await getWorkerMem(workerId)
        setWorker(data.request)
        const values = {
          ...data,
          ...data.request,
        }
        const skills: any = {
          enableFileSearch: values.enableFileSearch,
          enableFileOperations: values.enableFileOperations,
        }
        for (const skill of values.skills || []) {
          skills[skill.type] = skill
          skills[skill.type].enabled = true
        }
        console.log(skills)
        setLoading(false)
        setValues(skills)
        form.reset(skills)
      })
      .catch((e) => {
        console.log(e)
        navigate({
          to: '/500',
        })
      })
  }, [])

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: values,
    mode: 'onChange',
  })

  function onSubmit(data: any) {
    setLoading(true)
    try {
      const payload = {
        ...worker,
        enableFileSearch: data.enableFileSearch,
        enableFileOperations: data.enableFileOperations,
        skills: Object.keys(data)
          .map((key: string) => {
            if (!data[key].enabled) {
              return null
            }
            return {
              ...(data[key] as any),
              type: key,
            }
          })
          .filter((x: any) => x),
      }
      saClient
        .workerUpdate(workerId!, payload)
        .then((data: any) => {
          setLoading(false)
          console.log(data)
          toast({
            title: 'Everything is fine',
          }).dismiss(3000)
          navigate({
            to: '/chats',
          })
        })
        .catch((error: any) => {
          setLoading(false)
          console.warn('ERROR', error)
          toast({
            title: 'Something went wrong',
          }).dismiss(3000)
        })
    } catch (e) {
      setLoading(false)
      console.warn('ERROR', e)
      toast({
        title: 'Something went wrong',
      }).dismiss(3000)
    }
  }

  function handleSwitch(field: any, e: any) {
    field.onChange(e)
    setValues({ ...form.getValues() })
  }

  return (
    <>
      {loading ? <FakeProgress></FakeProgress> : (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (e) =>
            console.warn('ERROR', e)
          )}
          className='space-y-8'
        >
          {area === 'files' && (
            <>
              <FormLabel>General</FormLabel>
              <FormField
                control={form.control}
                name='enableFileOperations'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        File operations
                      </FormLabel>
                      <FormDescription>
                        Allow agent to upload and download files.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => handleSwitch(field, e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='enableFileSearch'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>File search</FormLabel>
                      <FormDescription>
                        Allow agent to search in files.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => handleSwitch(field, e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <hr />
            </>
          )}
          {area === 'web' && (
            <>
              <FormLabel>Websearch</FormLabel>
              <FormField
                control={form.control}
                name='browse.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Web search</FormLabel>
                      <FormDescription>
                        Allow agent to search in the web.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => handleSwitch(field, e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {values.browse?.enabled && (
                <FormField
                  control={form.control}
                  name='browse.data.maxResults'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max results</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum number of results to show.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <hr />
            </>
          )}
          {area === 'telegram' && (
            <>
              <FormLabel>Telegram</FormLabel>
              <FormField
                control={form.control}
                name='telegram.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Telegram</FormLabel>
                      <FormDescription>
                        Use agent on Telegram as a bot.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e)
                          if (!values.telegram) {
                            values.telegram = { enabled: false } as any
                          }
                          values.telegram!.enabled = e
                          setValues({ ...values })
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {values.telegram?.enabled && (
                <>
                  <FormField
                    control={form.control}
                    name='telegram.data.token'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Token for Telegram bot.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='telegram.data.url'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Url for Telegram bot.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <hr />
            </>
          )}
          {area === 'email' && (
            <>
              <FormLabel>Email</FormLabel>
              <FormField
                control={form.control}
                name='email.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Email</FormLabel>
                      <FormDescription>
                        Allow agent to send and receive emails.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => handleSwitch(field, e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <hr />
            </>
          )}
          {area === 'o365' && (
            <>
              <FormLabel>Outlook 365</FormLabel>
              <FormField
                control={form.control}
                name='o365.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>o365</FormLabel>
                      <FormDescription>
                        Use agent on Outlook 365.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => handleSwitch(field, e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <hr />
            </>
          )}
          {area === 'suitecrm' && (
            <>
              <FormLabel>SuiteCRM</FormLabel>
              <FormField
                control={form.control}
                name='suitecrm.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>SuiteCRM</FormLabel>
                      <FormDescription>Use agent on SuiteCRM.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => handleSwitch(field, e)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {values.suitecrm?.enabled && (
                <>
                  <FormField
                    control={form.control}
                    name='suitecrm.data.url'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>Url for SuiteCRM.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='suitecrm.data.psk'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PSK</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>PSK for SuiteCRM.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <hr />
            </>
          )}
          <Button type='submit'>Save</Button>
        </form>
      </Form>
      )}
    </>
  )
}
