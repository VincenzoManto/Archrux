import { memo, useEffect, useState } from 'react'
import { Separator } from '@radix-ui/react-separator'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import {
  DataNodeProps,
  Dataset,
  GroupByNodeProps,
  TransformationNodeProps,
} from '@/lib/publicTypes'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ColumnSelector, MultiColumnSelector } from '../ColumnSelector'

function GroupByNode({ id, data }: NodeProps<Node<GroupByNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const { updateNodeData } = useReactFlow()
  const [selectedColumn, setSelectedColumn] = useState<string>(
    data.selectedColumn || ''
  )
  const [selectedAgg, setSelectedAgg] = useState<string>(
    data.selectedAgg || 'sum'
  )
  const [subColumns, setSubColumns] = useState<string[]>(data.subColumns || [])
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      if (!selectedColumn || !subColumns.length || !selectedAgg) {
        return
      }
      const grouped = input.reduce((acc: any, row: any) => {
        const key = row[selectedColumn]
        if (!acc[key]) {
          acc[key] = subColumns.reduce((subAcc: any, subCol) => {
            subAcc[subCol] = []
            return subAcc
          }, {})
        }
        subColumns.forEach((subCol) => {
          if (row[subCol] !== undefined && row[subCol] !== null) {
            acc[key][subCol].push(row[subCol])
          }
        })
        return acc
      }, {})

      Object.keys(grouped).forEach((key) => {
        subColumns.forEach((subCol) => {
          switch (selectedAgg) {
            case 'sum':
              grouped[key][subCol] = grouped[key][subCol].reduce(
                (a: any, b: any) => a + b,
                0
              )
              break
            case 'mean':
              grouped[key][subCol] =
                grouped[key][subCol].reduce((a: any, b: any) => a + b, 0) /
                grouped[key][subCol].length
              break
            case 'median':
              grouped[key][subCol].sort((a: number, b: number) => a - b)
              const mid = Math.floor(grouped[key][subCol].length / 2)
              grouped[key][subCol] =
                grouped[key][subCol].length % 2 !== 0
                  ? grouped[key][subCol][mid]
                  : (grouped[key][subCol][mid - 1] +
                      grouped[key][subCol][mid]) /
                    2
              break
            case 'max':
              grouped[key][subCol] = Math.max(...grouped[key][subCol])
              break
            case 'min':
              grouped[key][subCol] = Math.min(...grouped[key][subCol])
              break
            default:
              break
          }
        })
      });
      const output = Object.keys(grouped).map((key) => ({
        [selectedColumn]: key,
        ...grouped[key],
      }));
      updateNodeData(id, {
        selectedColumn,
        selectedAgg,
        subColumns,
        output,
      })
    }
  }, [nodesData, selectedColumn, selectedAgg, subColumns])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Group By
        <Separator className='shadow' />
      </div>
      <Label>Column</Label>
      <ColumnSelector
        data={{ input }}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
      />
      <Label>SubColumns</Label>
      <MultiColumnSelector
        data={{ input }}
        selectedColumns={subColumns}
        setSelectedColumns={setSubColumns}
      />
      <Label>Aggregation</Label>
      <Select onValueChange={(e) => setSelectedAgg(e)} value={selectedAgg}>
        <SelectTrigger>
          <SelectValue placeholder='Order' />
        </SelectTrigger>
        <SelectContent>
          {['sum', 'mean', 'median', 'max', 'min'].map((order) => (
            <SelectItem key={order} value={order}>
              {order}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
      <Handle
        type='source'
        className='custom-handle'
        position={Position.Right}
      />
    </div>
  )
}
export default memo(GroupByNode)
