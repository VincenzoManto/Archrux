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
import * as ss from 'simple-statistics'
import { Label } from '../../../../../components/ui/label'

function StatsNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [columns, setColumns] = useState<ColumnDef<DatasetRow, unknown>[]>([])
  const [input, setInput] = useState<Dataset>([])
  const [stats, setStats] = useState<Record<string, number>>({
    mean: 0,
    median: 0,
    mode: 0,
    variance: 0,
    std: 0,
    min: 0,
    max: 0,
    sum: 0,
    range: 0,
    quantile25: 0,
    quantile75: 0,
  })

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

    const stats = computeStats(input)
    setStats(stats)

    return () => {}
  }, [nodesData, columns])

  const computeStats = (data: Dataset) => {
    const flattenedData = data.flatMap(Object.values).map(Number).filter((value) => !isNaN(value))
    return {
      mean: ss.mean(flattenedData),
      median: ss.median(flattenedData),
      mode: ss.mode(flattenedData),
      variance: ss.variance(flattenedData),
      std: ss.standardDeviation(flattenedData),
      min: ss.min(flattenedData),
      max: ss.max(flattenedData),
      sum: ss.sum(flattenedData),
      range: ss.max(flattenedData) - ss.min(flattenedData),
      quantile25: ss.quantile(flattenedData, 0.25),
      quantile75: ss.quantile(flattenedData, 0.75),
    }
  }

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Stats
        <Separator className='shadow' />
      </div>
      <div className='stats grid grid-cols-3 gap-4'>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key}>
        <Label className='text-center capitalize'>{key.replace(/([A-Z])/g, ' $1')}</Label> {value.toFixed(4)}
          </div>
        ))}
      </div>
      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
    </div>
  )
}
export default memo(StatsNode)
