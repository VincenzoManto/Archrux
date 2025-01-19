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
  TransformationNodeProps,
} from '@/lib/publicTypes'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColumnSelector, OperatorSelector } from '../ColumnSelector'
import { TopHandle } from '../TopHandle'

function FilterNode({ id, data }: NodeProps<Node<TransformationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const { updateNodeData } = useReactFlow()
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [selectedOperator, setSelectedOperator] = useState<string>('')
  const [value, setValue] = useState<any>(null)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      const filtered = input.filter((row: any) => {
        if (!selectedColumn || !selectedOperator || !value) return true
        switch (selectedOperator) {
          case '>':
            return row[selectedColumn] > +value
          case '<':
            return row[selectedColumn] < +value
          case '==':
            return (
              row[selectedColumn] === +value ||
              row[selectedColumn]?.toString() === value
            )
          case '!=':
            return (
              row[selectedColumn] !== +value &&
              row[selectedColumn]?.toString() !== value
            )
          case '>=':
            return row[selectedColumn] >= +value
          case '<=':
            return row[selectedColumn] <= +value
          case 'contains':
            return row[selectedColumn]?.toString().includes(value)
          case 'startsWith':
            return row[selectedColumn]?.toString().startsWith(value)
          case 'endsWith':
            return row[selectedColumn]?.toString().endsWith(value)
          case 'regex':
            return new RegExp(value).test(row[selectedColumn]?.toString())
          default:
            return true
        }
      })
      updateNodeData(id, { output: filtered })
    }
  }, [nodesData?.length, selectedColumn, selectedOperator, value])

  return (
    <div>
      <TopHandle name='Filter' />
      <Label>Column</Label>
      <ColumnSelector
        data={{ input }}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
      />
      <Label>Operator</Label>
      <OperatorSelector
        selectedOperator={selectedOperator}
        setSelectedOperator={setSelectedOperator}
      />
      <Label>Value</Label>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Value'
      />
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
export default memo(FilterNode)
