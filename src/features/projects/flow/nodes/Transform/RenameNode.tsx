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
import { ColumnSelector } from '../ColumnSelector'
import { TopHandle } from '../TopHandle'

function RenameNode({ id, data }: NodeProps<Node<TransformationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const { updateNodeData } = useReactFlow()
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [newColumnName, setNewColumnName] = useState<string>('')
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      const renamed = input.map((row: any) => {
        if (selectedColumn && newColumnName) {
          row[newColumnName] = row[selectedColumn]
          delete row[selectedColumn]
        }
        return row
      })
      updateNodeData(id, { output: renamed })
    }
  }, [nodesData?.length, selectedColumn, newColumnName])

  return (
    <div>
      <TopHandle name='Rename Column' />
      <Label>Column</Label>
      <ColumnSelector
        data={{ input }}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
      />
      <Label>New Column Name</Label>
      <Input
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
        placeholder='New Column Name'
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
export default memo(RenameNode)
