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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ColumnSelector } from '../ColumnSelector'
import { TopHandle } from '../TopHandle'

function PieNode(props: NodeProps<Node<VisualizationNodeProps>>) {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData<Node<DataNodeProps | TransformationNodeProps>>(
    connections.map((connection) => connection.source)
  )

  const [categoryColumn, setCategoryColumn] = useState<string>('')
  const [valueColumn, setValueColumn] = useState<string>('')
  const chartRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<Dataset>([])

  useEffect(() => {
    if (!nodesData?.length) return
    const input = nodesData[0].data?.output
    if (input) {
      setInput(input)
      if (!categoryColumn && !valueColumn) {
        setCategoryColumn(Object.keys(input[0])[0])
        setValueColumn(Object.keys(input[0])[1])
      }
    }
    if (!input || !categoryColumn || !valueColumn) return
    const chart = echarts.init(chartRef.current!)
    const data = input.map((row: any) => ({
      name: row[categoryColumn],
      value: row[valueColumn],
    }))

    chart.setOption({
      color: ['#00d86f', '#ff6f00', '#ff006f', '#6f00ff', '#006fff'],
      series: [
        {
          type: 'pie',
          data,
        },
      ],
    })

    return () => chart.dispose()
  }, [nodesData, categoryColumn, valueColumn])

  return (
    <div>
      <TopHandle name='Pie' />
      <Label>Category</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={categoryColumn}
        setSelectedColumn={setCategoryColumn}
      />
      <Label>Value</Label>
      <ColumnSelector
        data={{ input: input }}
        selectedColumn={valueColumn}
        setSelectedColumn={setValueColumn}
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

export default memo(PieNode)
