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
import {
  DataNodeProps,
  Dataset,
  TransformationNodeProps,
  VisualizationNodeProps,
} from '@/lib/publicTypes'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ColumnSelector } from '../ColumnSelector'
import { TopHandle } from '../TopHandle'

function HistogramNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [categoryColumn, setCategoryColumn] = useState<string>('')
  const [bins, setBins] = useState<number>(10)
  const chartRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      if (!categoryColumn) {
        setCategoryColumn(Object.keys(input[0])[0])
      }
    }
    if (!input || !categoryColumn || bins <= 0) return
    const chart = echarts.init(chartRef.current!)

    const data = input.map((row: any) => row[categoryColumn])
    const min = Math.min(...data)
    const max = Math.max(...data)
    const binWidth = (max - min) / bins
    const histogramData = Array(bins).fill(0)

    data.forEach((value: any) => {
      const binIndex = Math.floor((value - min) / binWidth)
      histogramData[Math.min(binIndex, bins - 1)] += 1
    })

    chart.setOption({
      color: ['#00d86f'],
      xAxis: {
        type: 'category',
        data: Array.from({ length: bins }, (_, i) =>
          (min + i * binWidth).toFixed(2)
        ),
        name: categoryColumn,
      },
      yAxis: {
        type: 'value',
        name: 'Frequency',
      },
      series: [
        {
          type: 'bar',
          data: histogramData,
        },
      ],
    })

    return () => chart.dispose()
  }, [nodesData, categoryColumn, bins])

  return (
    <div>
      <TopHandle name='Histogram' />
      <Label>Category</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={categoryColumn}
        setSelectedColumn={setCategoryColumn}
      />
      <Label>Bins</Label>
      <Input
        type='number'
        value={bins}
        onChange={(e) => setBins(Number(e.target.value))}
        min={1}
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

export default memo(HistogramNode)
