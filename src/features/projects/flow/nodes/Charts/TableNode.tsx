import { memo, useEffect, useState } from 'react'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import { Separator } from '@/components/ui/separator'
import { DataNodeProps, Dataset, DatasetRow, TransformationNodeProps, VisualizationNodeProps } from '@/lib/publicTypes'
import { DataTable } from '../../../../tasks/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

function TableNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [columns, setColumns] = useState<ColumnDef<DatasetRow, any>[]>([])
  const [input, setInput] = useState<DatasetRow[]>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
    } else {
      return
    }

    const columns = Object.keys(input[0]).map((key) => ({
      accessorKey: key,
      header: key,
    }))
    setColumns(columns)
  }, [nodesData])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Table
        <Separator className='shadow' />
      </div>
      <DataTable data={input} columns={columns} />
      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
    </div>
  )
}
export default memo(TableNode)
