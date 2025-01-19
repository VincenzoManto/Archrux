import { memo, useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import {
  DataNodeProps,
  Dataset,
  DatasetRow,
  TransformationNodeProps,
  VisualizationNodeProps,
} from '@/lib/publicTypes'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '../../../../tasks/components/data-table'
import { TopHandle } from '../TopHandle'

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
    const input = nodesData[0].data?.output
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
      <TopHandle name='Table' />
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
