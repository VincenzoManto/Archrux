import { memo, useEffect, useState } from 'react'
import { Handle, Node, NodeProps, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react'
import { DataNodeProps, Dataset, TransformationNodeProps } from '@/lib/publicTypes'
import { ColumnSelector, OrderSelector } from '../ColumnSelector'
import { Label } from '@/components/ui/label'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from '@radix-ui/react-separator'

function SortNode({
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
  const [selectedOrder, setSelectedOrder] = useState<'asc' | 'desc'>('asc')
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
      const sorted = [...input].sort((a: any, b: any) => {
        if (!selectedColumn) return 0
        if (selectedOrder === 'asc') {
          return a[selectedColumn] > b[selectedColumn] ? 1 : -1
        } else {
          return a[selectedColumn] < b[selectedColumn] ? 1 : -1
        }
      })
      updateNodeData(id, { output: sorted })
    }
  }, [nodesData?.length, selectedColumn, selectedOrder])

  return (
    <div>
    <div className='drag-handle__custom border-b py-2 text-left mb-2'>
      <IconGripVertical size={12} className='inline' />
      Sort
      <Separator className='shadow' />
    </div>
      <Label>Column</Label>
      <ColumnSelector
        data={{ input }}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
      />
      <Label>Order</Label>
      <OrderSelector
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
      <Handle type='target' className='custom-handle' position={Position.Left} />
      <Handle type='source' className='custom-handle' position={Position.Right} />
    </div>
  )
}
export default memo(SortNode);
