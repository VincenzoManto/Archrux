import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { SheetDataNodeProps } from '../../../../../lib/publicTypes'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'
import axios from 'axios'
import { Input } from '../../../../../components/ui/input'

function SheetNode({
  id,
  data
}: NodeProps<Node<SheetDataNodeProps>>) {
  const { updateNodeData } = useReactFlow()
  const [spreadsheetId, setSpreadsheetId] = useState(data.spreadsheetId || '')
  const [range, setRange] = useState(data.range || '')

  useEffect(() => {
    if (spreadsheetId && range) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
            headers: {
              'Authorization': `Bearer ${data.apiKey}`
            }
          })
          updateNodeData(id, { 
            spreadsheetId,
            range,
            output: response.data.values 
          })
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchData()
    }
  }, [spreadsheetId, range])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Spreadsheet Data Collector
        <Separator className='shadow' />
      </div>
      <div className='flex flex-col gap-3'>
        <Input
          type='text'
          placeholder='Spreadsheet ID'
          value={spreadsheetId}
          onChange={(e) => setSpreadsheetId(e.target.value)}
          className='input'
        />
        <Input
          type='text'
          placeholder='Range (e.g., Sheet1!A1:D10)'
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className='input'
        />
      </div>
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}

export default memo(SheetNode)