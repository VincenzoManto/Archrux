import { memo, useEffect, useRef, useState } from 'react'
import { IconGripVertical } from '@tabler/icons-react'
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import * as echarts from 'echarts'
import { Separator } from '@/components/ui/separator'
import { DataNodeProps, Dataset, TransformationNodeProps, VisualizationNodeProps } from '@/lib/publicTypes'
import { ColumnSelector } from '../ColumnSelector'
import { Label } from '@/components/ui/label'

function BarNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [xColumn, setXColumn] = useState<string>('')
  const [yColumn, setYColumn] = useState<string>('')
  const chartRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output;
    if (input) {
      setInput(input)
      if (!xColumn && !yColumn) {
        setXColumn(Object.keys(input[0])[0])
        setYColumn(Object.keys(input[0])[1])
      }
    }
    if (!input || !xColumn || !yColumn) return
    const chart = echarts.init(chartRef.current!)
    const xData = input.map((row: any) => row[xColumn] as string)
    const yData = input.map((row: any) => row[yColumn] as number)

    chart.setOption({
      color: ['#00d86f'],
      xAxis: { type: 'category', name: xColumn, data: xData },
      yAxis: { type: 'value', name: yColumn },
      series: [{ data: yData, type: 'bar' }],
    })

    return () => chart.dispose()
  }, [nodesData, xColumn, yColumn])

  return (
    <div>
      <div className='drag-handle__custom border-b py-2 text-left mb-2'>
        <IconGripVertical size={12} className='inline' />
        Bar
        <Separator className='shadow' />
      </div>
      <Label>X-Axis</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={xColumn}
        setSelectedColumn={setXColumn}
      />
      <Label>Y-Axis</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={yColumn}
        setSelectedColumn={setYColumn}
      />
      <div ref={chartRef} style={{ width: 300, height: 300 }}></div>
      <Handle
        type='target'
        className='custom-handle'
        position={Position.Left}
      />
    </div>
  )
}
export default memo(BarNode)