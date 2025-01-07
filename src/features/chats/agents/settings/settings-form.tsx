import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import memoize from 'memoize'
import timezones from 'timezones-list'
import { cn } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FakeProgress } from '../../../../components/fake-progress'
import { ServiceAutomate } from '../../../../lib/ServiceAutomate'
import { getToken } from '../../../../lib/utils'

const profileFormSchema = z.object({
  workerId: z.string().optional(),
  name: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  timezone: z.string({
    required_error: 'Please select a timezone.',
  }),
  duties: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
})

type AgentFormValues = z.infer<typeof profileFormSchema>

let saClient: ServiceAutomate

const timezonesList = timezones.map((t) => ({
  name: t.label.replace('_', ' ').split(' (')[0],
  label: t.label.replace('_', ' '),
}))

function randomName() {
  return new Promise((resolve, reject) => {
    fetch('https://randomuser.me/api/')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        resolve(data.results[0].name)
      })
      .catch((error) => {
        console.error('Error fetching random user:', error)
      })
  })
}

export default function AgentSettingsForm() {
  const [values, setValues] = useState<Partial<AgentFormValues>>({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [worker, setWorker] = useState<any>({})

  const { workerId } = useParams({ strict: false })

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
        if (!workerId) {
          navigate({
            to: '/500',
          })
          return
        }
        if (workerId === 'new') {
          const name: any = await randomName()
          const newData = {
            name: `${name.title} ${name.first} ${name.last}`,
            timezone: 'Europe/Rome',
            duties: [],
          }
          setWorker(newData)
          setValues(newData)
          form.reset(newData)
          setLoading(false)
          return
        }
        const data = await getWorkerMem(workerId)
        setWorker(data.request)
        const values = {
          ...data,
          ...data.request,
        }
        setValues(values)
        form.reset(values)
        setLoading(false)
      })
      .catch(() =>
        navigate({
          to: '/500',
        })
      )
  }, [])

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: values,
    mode: 'onChange',
  })

  function onSubmit(data: AgentFormValues) {
    setLoading(true)
    const payload = {
      ...worker,
      ...data,
    }
    payload.duties = payload.duties?.map((d: any) => d.value)
    const api =
      workerId === 'new'
        ? saClient.workerCreate(payload)
        : saClient.workerUpdate(workerId!, payload)
    console.log(payload)
    api
      .then((_: any) => {
        setLoading(false)
        toast({
          title: 'Everything is fine',
        }).dismiss(3000)
        navigate({
          to: '/chats',
        })
      })
      .catch((error: any) => {
        setLoading(false)
        console.log(error)
        toast({
          title: 'Something went wrong',
        }).dismiss(3000)
      })
  }

  const { fields, append } = useFieldArray({
    name: 'duties',
    control: form.control,
  })

  return loading ? (
    <FakeProgress />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Archrux' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='timezone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a timezone' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timezonesList.map((t) => (
                    <SelectItem value={t.name} key={t.name}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Set agent timezone to make sure you are in sync with your agent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`duties.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    Duties
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Describe agent duties. It will follow your indications
                  </FormDescription>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
          >
            Add duties
          </Button>
        </div>
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  )
}
