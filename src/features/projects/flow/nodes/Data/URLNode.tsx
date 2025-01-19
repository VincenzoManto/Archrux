import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { DataNodeProps, URLDataNodeProps } from '../../../../../lib/publicTypes'
import { IconGripVertical, IconPlus } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'
import axios from 'axios'
import { Input } from '../../../../../components/ui/input'
import { Textarea } from '../../../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select'
import { Label } from '../../../../../components/ui/label'
import { Button } from '../../../../../components/ui/button'

function URLDataNode({
  id,
  data
}: NodeProps<Node<URLDataNodeProps>>) {
  const { updateNodeData } = useReactFlow()
  const [url, setUrl] = useState(data.url || '')
  const [headers, setHeaders] = useState(JSON.stringify(data.headers || {}))
  const [body, setBody] = useState(JSON.stringify(data.body || {}))
  const [method, setMethod] = useState(data.method?.toUpperCase() || 'GET')

  useEffect(() => {
    if (url && method) {
      const fetchData = async () => {
        try {
          const response = await axios({
            method: method.toLowerCase(),
            url,
            headers: JSON.parse(headers || '{}'),
            data: JSON.parse(body || '{}'),
          })
          updateNodeData(id, { 
            method: method.toLowerCase(),
            url,
            headers: JSON.parse(headers || '{}'),
            body: JSON.parse(body || '{}'),
            output: response.data })
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [url, headers, body, method])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        URL Data Collector
        <Separator className='shadow' />
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex gap-2'>
          <div className='w-auto'>
          <Select onValueChange={(e: any) => setMethod(e)} value={method} defaultValue='GET'>
            <SelectTrigger>
              <SelectValue placeholder='Method' />
            </SelectTrigger>
            <SelectContent>
              {['GET', 'POST', 'PATCH', 'DELETE'].map((m, i) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          <Input
            type='text'
            placeholder='URL'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className='input'
          />
        </div>
       
        <Label>Headers</Label>
        <div>
          {Object.entries(JSON.parse(headers || '{}')).map(([key, value], index) => (
            <div key={index} className='header-pair flex gap-2'>
              <Input
                type='text'
                placeholder='Key'
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...JSON.parse(headers || '{}'), [e.target.value]: value }
                  delete newHeaders[key]
                  setHeaders(JSON.stringify(newHeaders))
                }}
              />
              <Input
                type='text'
                placeholder='Value'
                value={value}
                onChange={(e) => {
                  const newHeaders = { ...JSON.parse(headers || '{}'), [key]: e.target.value }
                  setHeaders(JSON.stringify(newHeaders))
                }}
              />
            </div>
          ))}
          <Button
            variant={'secondary'}
            onClick={() => {
              const newHeaders = { ...JSON.parse(headers || '{}'), '': '' }
              setHeaders(JSON.stringify(newHeaders))
            }}
            className='mt-2 w-full p-1'
          >
            <IconPlus size={16} className='inline' />
            Header
          </Button>
        </div>
        <Label>Body</Label>
        <Textarea
          placeholder='Body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className='textarea'
        />
      </div>
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}

export default memo(URLDataNode)