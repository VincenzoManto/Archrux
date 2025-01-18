import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react'
import { DataNodeProps, Dataset, TransformationNodeProps } from '@/lib/publicTypes'
import { ColumnSelector } from '../ColumnSelector'
import { Label } from '@/components/ui/label'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'

function GroupByNode({
  id,
  data,
}: NodeProps<Node<TransformationNodeProps>>) {

  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const { updateNodeData } = useReactFlow()
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
      const grouped = input.reduce((acc: any, item: any) => {
        const key = item[selectedColumn]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item)
        return acc
      }, {})
      updateNodeData(id, { output: grouped })
    }
  }, [nodesData?.length, selectedColumn])

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
      <Handle type='target' className='custom-handle' position={Position.Left} />
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}
export default memo(GroupByNode);
